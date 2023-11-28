<script setup>
import { onMounted, ref, watch, computed, nextTick, useAttrs } from "vue";

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
  title: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  single: {
    type: Boolean,
    default: false,
  },
  selectLeaf: {
    // 是否只选择叶子节点
    type: Boolean,
    default: true,
  },
  selectLevel: {
    type: Number,
    default: -1,
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
    default: () => ({ value: "boDictId", label: "dictName" }),
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

const tabs = ref([{ title: "请选择", key: 0 }]);

const tabsActive = ref(0);

const treeData = ref([]);

const selectValue = ref([]);

const selectItem = ref([]);

const selectText = ref([]);

const selectTextValue = computed(() => {
  return selectText.value?.join(",");
})

watch(() => props.value, (newVal, oldVal) => {
  nextTick(() => {
    if (props.value) {
    //   selectItem.value = props.value
    //   selectValue.value = props.value
    //   selectText.value = props.value
    } else {
      selectItem.value = [];
      selectValue.value = [];
      selectText.value = [];
    }
  })
}, { immediate: true })

const renderChecked = (item) => {
  return selectValue.value?.indexOf(item.key) > -1; // TODO
}

const getItem = (item) => {
  return {
    ...item,
    checked: renderChecked(item),
    title: item[props.fieldNames.label],
    key: item[props.fieldNames.value],
  };
};

watch(() => props.options, () => {
  treeData.value = [props.options?.map(getItem)];
}, { immediate: true, deep: true })

const showCheck = (item) => {
  if (props.selectLeaf) {
    return !item.hasChildren;
  }
  if (!props.single) {
    return true
  }
  return true;
};

const handleShow = () => {
  if (attrs?.disabled || props.showPreview) {
    return
  }
  selectVisible.value = true;
};

const handleCancel = () => {
  selectVisible.value = false;
};

const handleOk = () => {
  emit("update:value", selectItem.value);
  emit("update:text", selectText.value);
  emit("change", selectValue.value, selectItem.value, selectText.value);
  selectVisible.value = false;
};

const handleCheck = (item) => {
//   if (props.single && item.checked) {
//   }
  if (item.checked) {
    selectValue.value.push(item.key);
    selectText.value.push(item.title);
    selectItem.value.push(item);
  } else {
    selectValue.value = selectValue.value.filter((temp) => temp !== item.key); // TODO
    selectText.value = selectText.value.filter((temp) => temp !== item.title); // TODO
    selectItem.value = selectItem.value.filter((temp) => temp.key !== item.key); // TODO
  }
};

const handleEnter = (item) => {
  if (item.hasChildren) {
    const currentIndex = tabs.value.findIndex((node) => node.key === item.key);
    if (currentIndex > -1) {
      treeData.value = treeData.value.slice(0, currentIndex + 1);
      tabs.value = tabs.value.slice(0, currentIndex);
      tabs.value.push(item);
      tabs.value.push({ title: "请选择", key: 0 });
      tabsActive.value = 0;
    } else {
      tabs.value = tabs.value.filter((tab) => tab.key !== 0);
      tabs.value.push(item);
      tabs.value.push({ title: "请选择", key: 0 });
      tabsActive.value = 0;
    }
    treeData.value.push(item.children?.map(getItem));
  }
};

const handleDelete = (item) => {
  // 已经选中的要重置
  treeData.value.forEach(arr => {
    arr.forEach(i => {
      if (i.key === item.key) {
        i.checked = false
      }
    })
  })
  selectValue.value = selectValue.value.filter((temp) => temp !== item.key); // TODO
  selectText.value = selectText.value.filter((temp) => temp !== item.title); // TODO
  selectItem.value = selectItem.value.filter((temp) => temp.key !== item.key); // TODO
}

defineOptions({
  name: "CascaderMultiple",
});
</script>

<template>
  <van-field
    v-model="selectTextValue"
    is-link
    v-preview-text="showPreview"
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
        <div class="field-annotation">{{ label }}</div>
      </slot>
    </template>
  </van-field>
  <van-popup v-model:show="selectVisible" position="bottom" v-bind="$attrs">
    <div class="cascader-multiple">
      <div class="header">
        <van-button type="default" size="small" @click="handleCancel">
          取消
        </van-button>
        <div class="modal-title">{{ title }}</div>
        <van-button type="primary" size="small" @click="handleOk">
          确定
        </van-button>
      </div>
      <div class="content-wrapper">
        <div class="content-selects">
          <van-tag
            v-for="item in selectItem"
            :key="item.key"
            closeable
            plain
            size="medium"
            type="primary"
            @close="handleDelete(item)"
          >
            {{ item.title }}
          </van-tag>
        </div>
        <div class="content-tabs">
          <van-tabs v-model:active="tabsActive" swipe-threshold="1" shrink>
            <van-tab
              v-for="(temp, index) in tabs"
              :title="temp.title"
              :key="temp.key"
              :name="temp.key"
            >
              <div class="content-list">
                <div
                  v-for="item in treeData[index]"
                  :key="item.key"
                  class="item"
                  @click="handleEnter(item)"
                >
                  <div class="item-title">{{ item.title }}</div>
                  <van-checkbox
                    v-if="showCheck(item)"
                    v-model="item.checked"
                    @change="handleCheck(item)"
                    @click.stop
                  />
                  <van-icon v-if="item.hasChildren" name="arrow" class="icon-arrow" />
                  <van-icon v-else name="arrow" class="icon-arrow" style="color: white;" />
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.cascader-multiple {
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
  .content-wrapper {
    .content-selects {
      height: 12vh;
      padding: 10px 10px;
      border-bottom: 1px solid #dcdee0;
      overflow-y: auto;
      span {
        margin-bottom: 5px;
        margin-right: 5px;
      }
    }
    .content-tabs {
    }
    .content-list {
      height: 50vh;
      overflow-y: auto;
      .item {
        height: 42px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        .item-title {
          flex: 1;
        }
        .icon-arrow {
          margin-left: 6px;
        }
        .item-success {
          background-color: white;
          border: white;
          color: #1989fa;
        }
      }
    }
  }
}
</style>
