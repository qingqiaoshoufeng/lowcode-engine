<script setup>
import { onMounted, ref, watch, useAttrs, computed } from "vue";

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  nodes: {
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
  readonly: {
    type: Boolean,
    default: true,
  },
  showPreview: {
    type: Boolean,
    default: false,
  },
  selectOne: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:value", "update:nodes", "change"]);

const attrs = useAttrs();

const selectVisible = ref(false);

const selectItem = ref([]);

const selectValue = ref([]);

const selectText = ref("");

const checkboxRefs = ref([]);

const checkboxGroupRef = ref(null);

watch(() => [props.value, props.nodes], (val) => {
  if (props.value?.length > 0) {
    selectItem.value = props.options?.filter((item) => props.value.includes(item[props.fieldNames.value]));
    selectValue.value = props.value;
    selectText.value = selectItem.value?.map(item => item[props.fieldNames.label])?.join(",");
  } else if (props.nodes?.length > 0) {
    selectItem.value = props.nodes
    selectValue.value = props.nodes?.map(item => item[props.fieldNames.value])?.join(",");
    selectText.value = selectItem.value?.map(item => item[props.fieldNames.label])?.join(",");
  } else {
    selectItem.value = []
    selectValue.value = []
    selectText.value = ''
  }
}, { immediate: true, deep: true })

const toggle = (index) => {
  if (props.selectOne) {
    props.options.forEach((item, i) => {
      if (i !== index) {
        checkboxRefs.value[i].toggle(false);
      }
    })
    checkboxRefs.value[index].toggle();
    if (!checkboxRefs.value[index]?.checked?.value) {
      selectValue.value = [selectValue.value[selectValue.value.length - 1]]
    } else {
      selectValue.value = []
    }
  } else {
    checkboxRefs.value[index].toggle();
  }
};

const handleOk = () => {
  const { options } = props;
  selectItem.value = options?.filter(
    (item) => selectValue.value?.indexOf(item[props.fieldNames.value]) > -1
  );
  selectText.value = selectItem.value
    ?.map((item) => item[props.fieldNames.label])
    ?.join(",");
  emit("update:value", selectValue.value);
  emit("update:nodes", selectItem.value);
  emit("change", selectValue.value, selectItem.value);
  selectVisible.value = false;
};

const handleCancel = () => {
  selectVisible.value = false;
};

const handleShow = () => {
  if (attrs?.disabled || props.showPreview) {
    return
  }
  selectVisible.value = true
}

defineOptions({
  name: "SelectMultiple",
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
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="select-multiple">
      <div class="header">
        <div class="cancel" @click="handleCancel">取消</div>
        <div class="modal-title">{{ title }}</div>
        <div class="confirm" @click="handleOk">确定</div>
      </div>
      <div class="multiple-wrapper">
        <van-checkbox-group ref="checkboxGroupRef" v-model="selectValue">
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
    .cancel {
      color: #969799;
    }
    .confirm {
      color: var(--van-primary-color);
    }
    .modal-title {
      color: #242424;
      font-size: 16px;
      flex: 1;
      text-align: center;
    }
  }
  .multiple-wrapper {
    height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;
    .selected-icon {
      background-color: white;
      border: white;
      color: var(--van-primary-color);
    }
  }
}
</style>
