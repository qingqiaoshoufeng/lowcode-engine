<script setup>
import { ref } from "vue";
import Tags from "./tags.vue";
import ProModal from "@/component/ProModal/index";

const props = defineProps({
  value: {
    type: [String, Array],
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "请选择警情标签",
  },
});

const emit = defineEmits(["update:value", "change"]);

const selectVisible = ref(false);

const selectText = ref("");

defineOptions({
  name: "PoliceTags",
});
</script>

<template>
  <van-field
    v-model="selectText"
    is-link
    readonly
    :required="required"
    label="警情标签"
    :placeholder="placeholder"
    @click="selectVisible = true"
  />
  <ProModal v-model:visible="selectVisible" title="选择标签">
    <template #default="{ setHandleOk }">
      <Tags
        v-model:value="selectText"
        :options="options"
        :set-handle-ok="setHandleOk"
      />
    </template>
  </ProModal>
</template>

<style lang="scss">
.police-tags {
}
</style>