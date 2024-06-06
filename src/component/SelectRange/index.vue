<script setup>
import { onMounted, ref, watch, computed } from "vue";
import dayjs from "dayjs";

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
    default: () => new Date(),
  },
});

const emit = defineEmits(["update:value", "change"]);

const selectVisible = ref(false);

const startDate = ref([]);

const endDate = ref([]);

const selectText = ref("");

watch(
  () => props.value,
  (val) => {
    if (props.value) {
      startDate.value = props.value?.[0] ? dayjs(props.value?.[0]).format("YYYY-MM-DD").split("-") : [];
      endDate.value = props.value?.[1] ? dayjs(props.value?.[1]).format("YYYY-MM-DD").split("-") : [];
      selectText.value = `${startDate.value.join("-")} ~ ${endDate.value.join("-")}`;
    } else {
      startDate.value = [];
      endDate.value = [];
      selectText.value = "";
    }
  },
  { immediate: true }
);

const onConfirm = () => {
  selectText.value = `${startDate.value.join("-")} ~ ${endDate.value.join("-")}`;
  emit("update:value", [
    dayjs(startDate.value).set('hour', 0).set('minute', 0).set('second', 0),
    dayjs(endDate.value).set('hour', 23).set('minute', 59).set('second', 59),
    ""
  ]);
  emit("change", [
    dayjs(startDate.value).set('hour', 0).set('minute', 0).set('second', 0),
    dayjs(endDate.value).set('hour', 23).set('minute', 59).set('second', 59),
    ""
  ]);
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
          :title="placeholder"
          :tabs="['开始日期', '结束日期']"
          @confirm="onConfirm"
          @cancel="onCancel"
        >
          <van-date-picker
            v-model="startDate"
            :max-date="maxDate"
          />
          <van-date-picker
            v-model="endDate"
            :max-date="maxDate"
          />
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
    // max-height: 50vh;
    overflow-y: auto;
    .selected-icon {
      background-color: white;
      border: white;
      color: var(--van-primary-color);
    }
  }
}
</style>