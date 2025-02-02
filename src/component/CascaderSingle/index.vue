<script setup>
import { onMounted, ref, watch, useAttrs, computed, nextTick } from "vue";
import { findNodeFromTreeById } from '@/utils/tools.js';

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
  fieldNames: {
    type: Object,
    default: () => ({ value: "boDictId", text: "dictName" }),
  },
  options: {
    type: Array,
    default: () => [],
  },
  readonly:{
    default:true,
    type: Boolean,
  }
});

const emit = defineEmits(["update:value", "update:text", "change"]);

const attrs = useAttrs();

const selectVisible = ref(false);

const selectValue = ref("");

const selectText = ref("");

watch(() => props.value, (val) => {
  nextTick(() => {
    if (props.value && selectValue.value?.length <= 0) {
      selectValue.value = props.value;
      if (props.text) {
        selectText.value = props.text?.length > 0 ? props.text.join('/') : props.text;
      } else if (props.value && !props.text) {
        selectText.value = props.value?.map(item => {
          const temp = findNodeFromTreeById({ boAreaId: '-1', areaName: '-1', children: props.options }, item, 'boDictId')
          return temp?.dictName
        })?.join('/')
      }
    } else if (!props.value) {
      selectValue.value =''
      selectText.value = ''
    }
  })
}, { immediate: true })

const onFinish = ({ selectedOptions }) => {
  const values = selectedOptions.map((option) => option[props.fieldNames.value]);
  const texts = selectedOptions.map((option) => option[props.fieldNames.text])
  selectText.value = texts.join("/");
  emit("update:value", values);
  emit("update:text", texts);
  emit("change", values, selectedOptions);
  selectVisible.value = false;
};

const handleShow = () => {
  if (attrs?.disabled || props.showPreview) {
    return
  }
  selectVisible.value = true
}

defineOptions({
  name: "CascaderSingle",
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
    :readonly="readonly"
    class="cascader-single"
  >
  <template v-slot:label="" v-if="label">
      <slot name="label">
        <div v-if="label" class="field-annotation1">{{ label }}</div>
      </slot>
    </template>
  </van-field>
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="single-wrapper">
      <van-cascader
        v-model="selectValue"
        :title="placeholder"
        :options="options"
        :field-names="fieldNames"
        active-color="#2c59f2"
        @close="selectVisible = false"
        @finish="onFinish"
      />
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.single-wrapper {
  // max-height: 50vh;
}
</style>