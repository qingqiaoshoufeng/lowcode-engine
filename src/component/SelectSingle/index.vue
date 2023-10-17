<script setup>
import { onMounted, ref, watch, computed } from "vue";

const props = defineProps({
  value: {
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
});

const emit = defineEmits(["update:value", "change"]);

const selectVisible = ref(false);

const selectValue = ref("");

const selectText = ref("");

const handleSelect = (item) => {
  selectVisible.value = false;
  selectValue.value = item[props.fieldNames.value];
  selectText.value = item[props.fieldNames.label];
  emit("update:value", selectValue.value);
  emit("change", selectValue.value, item);
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
    @click="selectVisible = true"
  />
  <van-popup v-model:show="selectVisible" position="bottom">
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
              <van-radio :name="item[fieldNames.value]" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.single-wrapper {
  max-height: 50vh;
}
</style>