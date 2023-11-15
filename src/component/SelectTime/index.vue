<script setup>
import { onMounted, ref, watch, computed } from "vue";
import dayjs from "dayjs";
import { getLastMonth } from '@/utils/tools.js'

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
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
    default: "请选择",
  },
  rule: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:value", "change"]);

const options = ref([
{
    label: '今日',
    value: '今日',
    time: [dayjs().startOf('day'), dayjs().endOf('day')],
  },
  {
    label: '昨日',
    value: '昨日',
    time: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
  },
  {
    label: '本周',
    value: '本周',
    time: [dayjs().startOf('week'), dayjs().endOf('week')],
  },
  {
    label: '上周',
    value: '上周',
    time: [dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')],
  },
  {
    label: '本月',
    value: '本月',
    time: [dayjs().startOf('month'), dayjs().endOf('month')],
  },
  {
    label: '上月',
    value: '上月',
    time: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
  },
  {
    label: '本年',
    value: '本年',
    time: [dayjs().startOf('year'), dayjs().endOf('year')],
  },
  {
    label: '去年',
    value: '去年',
    time: [dayjs().subtract(1, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')],
  },
  // {
  //   label: '近一周',
  //   value: '近一周',
  //   time: [dayjs().subtract(1, 'week').startOf('day').add(1, 'day'), dayjs().endOf('day')],
  // },
  {
    label: '近一月',
    value: '近一月',
    time: [dayjs().subtract(1, 'month').startOf('day').add(1, 'day'), dayjs().endOf('day')],
  },
]);

const selectVisible = ref(false);

const selectValue = ref(getLastMonth());

const selectText = ref("最近一个月");

watch(
  () => props.value, (newValue) => {
    if (newValue?.length > 0) {
      selectValue.value = newValue;
      selectText.value = newValue?.[2]
    } else {
      selectValue.value = '';
      selectText.value = ''
    }
  },
  { immediate: true }
);

const handleSelect = (item) => {
  if (selectValue.value !== item.value) {
    selectVisible.value = false;
    selectText.value = item.label;
    selectValue.value = [...item.time, item.label];
    emit("update:value", selectValue.value);
    emit("change", selectValue.value, item);
  } else {
    selectValue.value = [];
    selectText.value = ''
    emit("update:value", selectValue.value);
    emit("change", selectValue.value, item);
  }
};

const handleShow = () => {
  selectVisible.value = true;
};

const handleCancel = () => {
  selectVisible.value = false;
};

defineOptions({
  name: "SelectTime",
});
</script>

<template>
  <van-field
    v-model="selectText"
    is-link
    readonly
    :required="required"
    :label="label"
    :placeholder="placeholder"
    :rule="rule"
    @click="handleShow"
  />
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="select-single">
      <div class="header">
        <van-button type="default" size="small" @click="handleCancel">
          取消
        </van-button>
        <div class="modal-title">{{ title }}</div>
      </div>
      <div class="single-wrapper">
        <van-radio-group v-model="selectValue[2]">
          <van-cell-group inset>
            <van-cell
              v-for="item in options"
              :title="item.label"
              :key="item.value"
              clickable
              @click="handleSelect(item)"
            >
              <template #right-icon>
                <van-radio :name="item.value">
                  <template #icon="props">
                    <van-icon
                      name="success"
                      class="selected-icon"
                      v-if="props.checked"
                    />
                  </template>
                </van-radio>
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.select-single {
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    height: 44px;
    padding: 0 10px;
    background-color: white;
    display: flex;
    align-items: center;
    position: relative;
    .modal-title {
      color: #242424;
      font-size: 16px;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .single-wrapper {
    max-height: 50vh;
    overflow-y: auto;
    .selected-icon {
      background-color: white;
      border: white;
      color: #1989fa;
    }
  }
}
</style>