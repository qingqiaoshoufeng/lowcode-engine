<script setup>
import { onMounted, ref, watch, computed } from "vue";

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
    default: "",
  },
  rules: {
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

const selectItem = ref([]);

const selectValue = ref([]);

const selectText = ref("");

const checkboxRefs = ref([]);

watch(() => props.value, (val) => {
  if (props.value) {
    selectItem.value = props.options?.filter((item) => props.value.includes(item[props.fieldNames.value]));
    selectValue.value = props.value;
    selectText.value = selectItem.value?.map(item => item[props.fieldNames.label])
  }
}, { immediate: true })

const toggle = (index) => {
  checkboxRefs.value[index].toggle();
};

const handleOk = () => {
  const { options } = props;
  selectItem.value = options?.filter(
    (item) => selectValue.value?.indexOf(item[props.fieldNames.value]) > -1
  );
  selectText.value = selectItem.value
    ?.map((item) => item[props.fieldNames.label])
    .join(",");
  emit("update:value", selectValue.value);
  emit("change", selectValue.value, selectItem.value);
  selectVisible.value = false;
};

const handleCancel = () => {
  selectVisible.value = false;
};

defineOptions({
  name: "SelectMultiple",
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
    :rules="rules"
    @click="selectVisible = true"
  />
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="select-multiple">
      <div class="header">
        <van-button
          type="default"
          size="small"
          style="margin-right: 10px"
          @click="handleCancel"
        >
          取消
        </van-button>
        <div class="modal-title">{{ title }}</div>
        <van-button type="primary" size="small" @click="handleOk"
          >确定</van-button
        >
      </div>
      <div class="multiple-wrapper">
        <van-checkbox-group v-model="selectValue">
          <van-cell-group inset>
            <van-cell
              v-for="(item, index) in options"
              :title="item[fieldNames.label]"
              :key="item[fieldNames.value]"
              clickable
              @click="toggle(index)"
            >
              <template #right-icon>
                <van-checkbox
                  :name="item[fieldNames.value]"
                  :ref="(el) => (checkboxRefs[index] = el)"
                  @click.stop
                >
                  <template #icon="props">
                    <van-icon name="success" class="selected-icon" v-if="props.checked"  />
                  </template>
                </van-checkbox>
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.select-multiple {
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    height: 44px;
    padding: 0 10px;
    background-color: white;
    display: flex;
    align-items: center;
    .modal-title {
      color: #242424;
      font-size: 16px;
      flex: 1;
      text-align: center;
    }
  }
  .multiple-wrapper {
    height: 50vh;
    overflow-y: auto;
    .selected-icon {
      background-color: white;
      border: white;
      color: #1989fa;
    }
  }
}
</style>
