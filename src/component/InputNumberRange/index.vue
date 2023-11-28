<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  value: {
    type: [Array],
    default: () => [],
  },
  precision: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: "",
  },
  addonAfter: {
    type: String,
    default: "",
  },
  showPreview: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 1000000000000,
  },
  placeholder: {
    type: Array,
    default: ['请输入最小值', '请输入最大值'],
  },
});

const emit = defineEmits(["update:value", "change"]);

const rangeValue = ref(["", ""]);

watch(() => props.value, (newValue) => {
  if (newValue?.length > 0 && Array.isArray(newValue)) {
    rangeValue.value = newValue;
  }
}, { immediate: true });

const onMinChange = () => {
  emit("update:value", rangeValue.value);
  emit("change", rangeValue.value);
};

const onMaxChange = () => {
  emit("update:value", rangeValue.value);
  emit("change", rangeValue.value);
};

defineOptions({
  name: "InputNumberRange",
})
</script>

<template>
  <div class="input-number-range">
    <span class="range-label">{{ label }}</span>
    <van-field
      v-model="rangeValue[0]"
      :placeholder="placeholder[0]"
      type="number"
      @change="onMinChange"
    />
    <span>~</span>
    <van-field
      v-model="rangeValue[1]"
      :placeholder="placeholder[1]"
      type="number"
      @change="onMaxChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.input-number-range {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0px 10px;
  .range-label {
    min-width: 100px;
  }
}
</style>
