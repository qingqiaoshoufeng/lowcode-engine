<script setup>
import { onMounted, ref, watch, computed } from "vue";
import dayjs from "dayjs";
import { showToast } from "vant";

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
      startDate.value = [];
      startTime.value = ['00', '00']
      endDate.value = [];
      endTime.value = ['23', '59']
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
        <div class="field-annotation1">{{ label }}</div>
      </slot>
    </template>
  </van-field>
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="select-range">
      <div class="single-wrapper">
        <van-picker-group
          title="预约日期"
          :tabs="['开始日期', '结束日期']"
          @confirm="onConfirm"
          @cancel="onCancel"
        >
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
.select-range {
  display: flex;
  flex-direction: column;
  .single-wrapper {
    max-height: 50vh;
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