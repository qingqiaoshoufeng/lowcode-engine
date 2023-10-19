<script setup>
import { onMounted, ref, watch, computed } from "vue";

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
    default: "行政区域",
  },
  placeholder: {
    type: String,
    default: "请选择行政区域",
  },
  rule: {
    type: Array,
    default: () => [],
  },
  fieldNames: {
    type: Object,
    default: () => ({ value: "boDictId", label: "dictName" }),
  },
  options: {
    type: Array,
    default: () => [],
  },
  checkShowFn: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits(["update:value", "change"]);

const selectVisible = ref(false);

const selectValue = ref("");

const selectText = ref("");

watch(() => props.value, (val) => {
  if (props.value) {
    selectValue.value = props.value;
    selectText.value = props.options?.filter((item) => item[props.fieldNames.value] == props.value)?.[0]?.[props.fieldNames.label]
  }
}, { immediate: true })

const handleSelect = (item) => {
  selectVisible.value = false;
  selectValue.value = item[props.fieldNames.value];
  selectText.value = item[props.fieldNames.label];
  emit("update:value", selectValue.value);
  emit("change", selectValue.value, item);
};

const handleShow = () => {
  if (props.checkShowFn && props.checkShowFn()) {
    return;
  }
  selectVisible.value = true;
};

const handleCancel = () => {
  selectVisible.value = false;
};

defineOptions({
  name: "SelectSingle",
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
        <van-radio-group v-model="selectValue">
          <van-cell-group inset>
            <van-cell
              v-for="item in options"
              :title="item[fieldNames.label]"
              :key="item[fieldNames.value]"
              clickable
              @click="handleSelect(item)"
            >
              <template #right-icon>
                <van-radio :name="item[fieldNames.value]">
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