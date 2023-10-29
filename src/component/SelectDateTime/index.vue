<script setup>
import { computed, ref, watch } from "vue";
import dayjs from 'dayjs'
import { showToast } from "vant";

const props = defineProps({
  value: {
    type: [String, Object],
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
  rules: {
    type: Array,
    default: () => [],
  },
  showPreview: {
    type: Boolean,
    default: false,
  },
  columnsType: {
    type: Array,
    default: () => ["hour", "minute", "second"],
  },
  maxDate: {
    type: Object,
    default: new Date(),
  },
});

const emit = defineEmits(["update:value", "change"]);

const selectVisible = ref(false);

const selectText = ref("");

const currentDate = ref([]);

const currentTime = ref([]);

const canConfirm = computed(() => {
  const value = dayjs(currentDate.value.join("-") + " " + currentTime.value.join(":"));
  return value.valueOf() >= dayjs(props.maxDate).valueOf()
})

watch(() => props.value, (newVal) => {
  if (props.value) {
    const value = dayjs(props.value);
    currentDate.value = [value.year(), value.month() + 1, value.date()];
    currentTime.value = [value.hour(), value.minute(), value.second()];
    selectText.value = value.format("YYYY-MM-DD HH:mm:ss");
  }
}, { immediate: true });

const handleOk = () => {
  const value = dayjs(currentDate.value.join("-") + " " + currentTime.value.join(":"));
  selectText.value = value.format("YYYY-MM-DD HH:mm:ss");
  emit("update:value", value);
  emit("change", value);
  selectVisible.value = false;
}

const handleShow = () => {
  if (!currentDate.value || currentDate.value.length <= 0 || !selectText.value) {
    const current = dayjs();
    currentDate.value = [current.year(), current.month() + 1, current.date()];
    currentTime.value = ['00', '00', '00'];
  }
  selectVisible.value = true;
};

const handleCancel = () => {
  selectVisible.value = false;
};

const onClose = () => {
  if (!selectText.value) {
    currentDate.value = [];
    currentTime.value = [];
  }
}

defineOptions({
  name: "SelectDateTime",
});
</script>

<template>
  <van-field
    v-model="selectText"
    v-preview-text="showPreview"
    is-link
    v-bind="$attrs"
    :required="required"
    :label="label"
    :placeholder="placeholder"
    :rules="rules"
    @click="handleShow"
  />
  <van-popup v-model:show="selectVisible" position="bottom" @closed="onClose">
    <div class="select-date-time">
      <div class="header">
        <van-button type="default" size="small" @click="handleCancel">
          取消
        </van-button>
        <div class="modal-title">{{ title }}</div>
        <van-button type="primary" size="small" style="margin-left: auto;" :disabled="canConfirm" @click="handleOk">
          确定
        </van-button>
      </div>
      <div class="select-date-wrapper">
        <van-date-picker
          v-model="currentDate"
          title="选择日期"
          :show-toolbar="false"
          :max-date="maxDate"
          class="left"
        />
        <van-time-picker
          v-model="currentTime"
          title="选择时间"
          :show-toolbar="false"
          :columns-type="columnsType"
          class="right"
        />
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.select-date-time {
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
      white-space: nowrap;
    }
  }
  .select-date-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    .left,
    .right {
      flex: 1;
    }
  }
}
</style>
