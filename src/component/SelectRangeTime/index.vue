<script setup>
import { onMounted, ref, watch, computed } from "vue";
import dayjs from "dayjs";
import { showToast } from "vant";
import { dateTimeRange } from '@/utils/constants.js';

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  rule: {
    type: Array,
    default: () => [],
  },
  maxDate: {
    type: Object,
    default: new Date(),
  },
});

const emit = defineEmits(["update:value", "change"]);

const selectVisible = ref(false);

const startDate = ref([]);

const startTime = ref(['00', '00']);

const endDate = ref([]);

const endTime = ref(['23', '59']);

const selectText = ref("");

watch(
  () => props.value,
  (val) => {
    if (props.value) {
      startDate.value = props.value?.[0] ? dayjs(props.value?.[0]).format("YYYY-MM-DD").split("-") : [];
      startTime.value = props.value?.[0] ? dayjs(props.value?.[0]).format("HH:mm:ss").split(":").slice(0, 2) : [];
      endDate.value = props.value?.[1] ? dayjs(props.value?.[1]).format("YYYY-MM-DD").split("-") : [];
      endTime.value = props.value?.[1] ? dayjs(props.value?.[1]).format("HH:mm:ss").split(":").slice(0, 2) : [];
      selectText.value = `${startDate.value.join("-")} ${startTime.value.join(":")} ~ ${endDate.value.join("-")}  ${endTime.value.join(":")}`;
    } else {
      startDate.value = dayjs().subtract(1, 'month').format("YYYY-MM-DD").split("-");
      startTime.value = ['00', '00'];
      endDate.value = dayjs().format("YYYY-MM-DD").split("-");
      endTime.value = ['23', '59'];
      selectText.value = "";
    }
  },
  { immediate: true }
);

const onConfirm = () => {
  const start = dayjs(startDate.value.join("-") + " " + startTime.value.join(":"));
  const end = dayjs(endDate.value.join("-") + " " + endTime.value.join(":"));
  if (start?.valueOf() >= end?.valueOf()) {
    showToast('开始时间不能晚于结束时间')
    return
  }
  selectText.value = `${startDate.value.join("-")} ${startTime.value.join(":")} ~ ${endDate.value.join("-")}  ${endTime.value.join(":")}`;
  emit("update:value", [start, end, ""]);
  emit("change", [start, end, ""]);
  selectVisible.value = false;
};

const handleFast = (item, key) => {
  const start = item[0];
  const end = item[1];
  if (start?.valueOf() >= end?.valueOf()) {
    showToast('开始时间不能晚于结束时间')
    return
  }
  selectText.value = `${dayjs(start).format("YYYY-MM-DD HH:mm")} ~ ${dayjs(end).format("YYYY-MM-DD HH:mm")}`;
  emit("update:value", [start, end, ""]);
  emit("change", [start, end, ""]);
  selectVisible.value = false;
}

const handleShow = () => {
  selectVisible.value = true;
};

const onCancel = () => {
  selectVisible.value = false;
};

defineOptions({
  name: "SelectRange",
});
</script>

<template>
  <van-field
    v-model="selectText"
    is-link
    readonly
    v-bind="$attrs"
    :required="required"
    :label="label"
    :placeholder="placeholder"
    :rule="rule"
    @click="handleShow"
  >
    <template v-slot:label="" v-if="label">
      <slot name="label">
        <div class="field-annotation">{{ label }}</div>
      </slot>
    </template>
  </van-field>
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="select-range-time">
      <div class="single-wrapper">
        <van-picker-group
          :title="placeholder"
          :tabs="['开始日期', '结束日期']"
          @confirm="onConfirm"
          @cancel="onCancel"
        >
          <template #toolbar>
            <div class="fast-toolbar">
              <div class="fast-wrapper">
                <div class="cancel" @click="onCancel">取消</div>
                <div class="label">{{ placeholder }}</div>
                <div class="confirm" @click="onConfirm">确定</div>
              </div>
              <div class="fast-btn">
                <div
                  v-for="(item, key) in dateTimeRange"
                  :key="item"
                  class="fast-btn-item"
                  @click="handleFast(item, key)"
                >
                  {{ key }}
                </div>
              </div>
            </div>
          </template>
          <div class="wrapper-card">
            <van-date-picker
              v-model="startDate"
              :max-date="maxDate"
            />
            <van-time-picker
              v-model="startTime"
            />
          </div>
          <div class="wrapper-card">
            <van-date-picker
              v-model="endDate"
              :max-date="maxDate"
            />
            <van-time-picker
              v-model="endTime"
            />
          </div>
        </van-picker-group>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.select-range-time {
  display: flex;
  flex-direction: column;
  :deep(.van-picker__toolbar) {
    height: unset;
  }
  :deep(.fast-toolbar) {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  :deep(.fast-wrapper) {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 0 16px;
    .cancel {
      color: #969799;
    }
    .confirm {
      color: #1989fa;
    }
    .label {
      width: 100%;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
  }
  :deep(.fast-btn) {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    padding: 0 16px;
    .fast-btn-item {
      padding: 3px 8px;
      border: 1px solid #1989fa;
      white-space: nowrap;
      margin-right: 10px;
    }
  }
  :deep(.fast-btn::-webkit-scrollbar) {
    display: none;
  }
  .single-wrapper {
    // max-height: 50vh;
    overflow-y: auto;
    .wrapper-card {
      display: flex;
      :deep(.van-picker) {
        flex: 1;
      }
    }
    .selected-icon {
      background-color: white;
      border: white;
      color: #1989fa;
    }
  }
}
</style>