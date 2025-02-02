<script setup>
import { onMounted, ref, watch, computed, useAttrs, nextTick } from "vue";

const props = defineProps({
  value: {
    type: [String, Number],
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
  fieldNames: {
    type: Object,
    default: () => ({ value: "boDictId", label: "dictName" }),
  },
  options: {
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
  checkShowFn: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits(["update:value", "change"]);

const attrs = useAttrs();

const selectVisible = ref(false);

const selectValue = ref("");

const selectText = ref("");

const isRequired = computed(()=>{
  if (props.required) {
    return true
  } else {
    return props.rules?.some(item => item.required)
  }
})

watch(() => [props.value, props.options], (val) => {
  nextTick(() => {
    if (props.value) {
      selectValue.value = props.value;
      selectText.value = props.options?.filter((item) => item[props.fieldNames.value] === props.value)?.[0]?.[props.fieldNames.label]
    } else {
      selectValue.value = ''
      selectText.value = ''
    }
  })
}, { immediate: true })

const handleSelect = (item) => {
  if (item.disabled) {
    return
  }
  if (selectValue.value !== item[props.fieldNames.value]) {
    selectVisible.value = false;
    selectValue.value = item[props.fieldNames.value];
    selectText.value = item[props.fieldNames.label];
    emit("update:value", selectValue.value);
    emit("change", selectValue.value, item);
  } else {
    selectValue.value = '';
    selectText.value = '';
    emit("update:value", selectValue.value);
    emit("change", selectValue.value, item);
  }
};

const handleShow = () => {
  if (props.checkShowFn && props.checkShowFn()) {
    return;
  }
  if (attrs?.disabled || props.showPreview) {
    return
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
    class="select_single"
    :class="{
      'van-field--disabled1':$attrs.disabled,
      'is-black-detail':showPreview,
    }"
    v-model="selectText"
    v-preview-text="showPreview"
    is-link
    v-bind="$attrs"
    :readonly="readonly"
    :required="isRequired"
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
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="select-single">
      <div class="header">
        <div class="cancel" @click="handleCancel">取消</div>
        <div class="modal-title">{{ title }}</div>
      </div>
      <div class="single-wrapper">
        <van-radio-group v-model="selectValue">
          <van-cell
            v-for="item in options"
            :title="item[fieldNames.label]"
            :key="item[fieldNames.value]"
            clickable
            @click="handleSelect(item)"
            :class="{'single-disabled': item.disabled}"
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
        </van-radio-group>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.van-field--disabled {
  pointer-events: none;
}
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
    .cancel {
      color: #969799;
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
  .single-wrapper {
    height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;
    .selected-icon {
      background-color: white;
      border: white;
      color: var(--van-primary-color);
    }
    .single-disabled {
      color: #969799;
    }
  }
}
</style>