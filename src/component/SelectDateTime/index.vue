<script setup>
import { computed, ref, watch, useAttrs } from "vue";
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
  readonly: {
    type: Boolean,
    default: true,
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
    default: () => new Date(),
  },
  minDate:{
    type: Object,
  }
});

const emit = defineEmits(["update:value", "change"]);

const attrs = useAttrs();

const selectVisible = ref(false);

const selectText = ref("");

const currentDate = ref([]);

const currentTime = ref([]);

const canConfirm = computed(() => {
  const value = dayjs(currentDate.value.join("-") + " " + currentTime.value.join(":"));
  return value.valueOf() >= dayjs(props.maxDate).valueOf() || (props.minDate && value.valueOf() <= dayjs(props.minDate).valueOf())
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
  if (canConfirm.value) {
    return
  }
  const value = dayjs(currentDate.value.join("-") + " " + currentTime.value.join(":"));
  selectText.value = value.format("YYYY-MM-DD HH:mm:ss");
  emit("update:value", value);
  emit("change", value);
  selectVisible.value = false;
}

const handleShow = () => {
  if (attrs?.disabled || props.showPreview) {
    return
  }
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
    :readonly="readonly"
    :required="required"
    :label="label"
    :placeholder="placeholder"
    :rules="rules"
    @click="handleShow"
  >
    <template v-slot:label="" v-if="label">
      <slot name="label">
        <div class="field-annotation1">{{ label }}</div>
      </slot>
    </template>
  </van-field>
  <van-popup v-model:show="selectVisible" position="bottom" @closed="onClose">
    <div class="select-date-time">
      <div class="header">
        <div class="cancel" @click="handleCancel">取消</div>
        <div class="modal-title">{{ title }}</div>
        <div :class="{ 'cancel': canConfirm, 'confirm': !canConfirm }" @click="handleOk">确定</div>
      </div>
      <div class="select-date-wrapper">
        <van-date-picker
          v-model="currentDate"
          title="选择日期"
          :show-toolbar="false"
          :max-date="maxDate"
          :min-date="minDate"
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
    background-color: white;
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
