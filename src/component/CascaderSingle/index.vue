<script setup>
import { onMounted, ref, watch, computed } from "vue";

const props = defineProps({
  value: {
    type: [String, Array],
    default: "",
  },
  text: {
    type: [String, Array],
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "自然灾害类型",
  },
  placeholder: {
    type: String,
    default: "请选择自然灾害类型",
  },
  rule: {
    type: Array,
    default: () => [],
  },
  fieldNames: {
    type: Object,
    default: () => ({ value: "boDictId", text: "dictName" }),
  },
  options: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:value", "update:text", "change"]);

const selectVisible = ref(false);

const selectValue = ref("");

const selectText = ref("");

const onFinish = ({ selectedOptions }) => {
  const values = selectedOptions.map((option) => option[props.fieldNames.value]);
  const texts = selectedOptions.map((option) => option[props.fieldNames.text])
  selectText.value = texts.join("/");
  emit("update:value", values);
  emit("update:text", texts);
  emit("change", values, selectedOptions);
  selectVisible.value = false;
};

defineOptions({
  name: "CascaderSingle",
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
    @click="selectVisible = true"
  />
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="single-wrapper">
      <van-cascader
        v-model="selectValue"
        :title="placeholder"
        :options="options"
        :field-names="fieldNames"
        active-color="#1989fa"
        @close="selectVisible = false"
        @finish="onFinish"
      />
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.single-wrapper {
  max-height: 50vh;
}
</style>