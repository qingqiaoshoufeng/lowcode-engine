<script setup>
import { onMounted, ref, watch, computed, nextTick, useAttrs } from "vue";
import { getDispatchGroup } from "@/apis/index.js";
import { showLoadingToast, closeToast } from "vant";
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  title: {
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
  selectLevelEqual: { // 是否只能选择同级单位
    type: Boolean,
    default: false,
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
    default: () => ({ value: "organizationid", label: "name" }),
  },
  headersDisabled: {
    // 全勤指挥部是否能选择
    type: Boolean,
    default: true,
  },
  params: {
    type: Object,
    default: () => {},
  },
  disabledKey: {
    type: String,
  },
  disabledValue: {
    type: Array,
  },
});

const emit = defineEmits(["update:value", "update:text", "change"]);

const attrs = useAttrs();

const selectVisible = ref(false);

const tabs = ref([{ name: "请选择", organizationid: 0 }]);

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
      selectItem.value = props.value;
      selectValue.value = props.value.map((item) => item[props.fieldNames.value]);
      selectText.value = props.value.map((item) => item[props.fieldNames.label]);
    } else {
      // 已经选中的要重置
      treeData.value.forEach(arr => {
        arr.forEach(i => {
          i.checked = false
        })
      })
      selectItem.value = [];
      selectValue.value = [];
      selectText.value = [];
    }
  })
}, { immediate: true, deep: true })

const renderChecked = (item) => {
  return selectValue.value?.indexOf(item.organizationid) > -1;
}

const getItem = (item) => {
  if (item.hasChildren && props.single && props.selectLeaf) {
    item.selectable = false;
  } else if (item.hasChildren && !props.single && props.selectLeaf) {
    item.selectable = false;
    item.checkable = false;
  } else if (!props.single) {
    item.selectable = false;
    item.checkable = true;
  } else {
    item.selectable = true;
  }
  if (!props.headersDisabled) {
    item.disabled = item.isheadquarters !== 1;
  }
  if (props.selectLevel > 0 && props.selectLevel === item.orgLevel) {
    item.isLeaf = true;
  } else {
    item.isLeaf = !item.hasChildren;
  }
  return {
    ...item,
    checked: renderChecked(item),
    title: item[props.fieldNames.title],
    key: item[props.fieldNames.key],
  };
};

const showCheck = (item) => {
  if (props.selectLeaf) {
    return item.isLeaf;
  }
  if (!props.headersDisabled && Number(item.isheadquarters) === 1) {
    return true;
  }
  if (!props.single) {
    return true
  }
  return true;
};

onMounted(() => {
  nextTick(() => {
    getDispatchGroup({
      ...props.params,
      disabledKey: props.disabledKey,
      disabledValue: props.disabledValue,
    }).then((res) => {
      treeData.value = [res?.items?.map(getItem)];
    });
  })
});

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
  if (props.single && item.checked) {
    selectValue.value = [];
    selectText.value = [];
    selectItem.value = [];
    // 已经选中的要重置
    treeData.value.forEach(arr => {
      arr.forEach(i => {
        if (i.organizationid !== item.organizationid && i.checked) {
          i.checked = false
        }
      })
    })
    selectValue.value = [item.organizationid];
    selectText.value = [item.name];
    selectItem.value = [item];
    emit("update:value", selectItem.value);
    emit("update:text", selectText.value);
    emit("change", selectValue.value, selectItem.value, selectText.value);
    selectVisible.value = false;
    return
  }
  else if (props.selectLevelEqual && item.checked) {
    const origin = cloneDeep(selectItem.value)
    selectItem.value = []
    origin.forEach(temp => {
      if (temp.orgLevel === item.orgLevel && temp.organizationid !== item.organizationid) {
        selectItem.value.push(cloneDeep(temp))
      }
    });
    selectItem.value.push(cloneDeep(item));
    selectValue.value = selectItem.value.map((temp) => temp.organizationid);
    selectText.value = selectItem.value.map((temp) => temp.name);
    treeData.value.forEach(arr => {
      arr.forEach(i => {
        if (selectValue.value.indexOf(i.organizationid) < 0 && i.checked) {
          i.checked = false
        }
      })
    })
    emit("update:value", selectItem.value);
    emit("update:text", selectText.value);
    emit("change", selectValue.value, selectItem.value, selectText.value);
    return
  }
  else if (item.checked) {
    selectValue.value.push(item.organizationid);
    selectText.value.push(item.name);
    selectItem.value.push(item);
    emit("update:value", selectItem.value);
    emit("update:text", selectText.value);
    emit("change", selectValue.value, selectItem.value, selectText.value);
  } else {
    selectValue.value = selectValue.value.filter((temp) => temp !== item.organizationid);
    selectText.value = selectText.value.filter((temp) => temp !== item.name);
    selectItem.value = selectItem.value.filter((temp) => temp.organizationid !== item.organizationid);
    emit("update:value", selectItem.value);
    emit("update:text", selectText.value);
    emit("change", selectValue.value, selectItem.value, selectText.value);
  }
};

const handleEnter = (item) => {
  if (item.hasChildren) {
    showLoadingToast();
    getDispatchGroup({
      ...props.params,
      parentOrganizationId: item.organizationid,
      disabledKey: props.disabledKey,
      disabledValue: props.disabledValue,
    }).then((res) => {
      closeToast();
      const currentIndex = tabs.value.findIndex(
        (node) => node.orgLevel === item.orgLevel
      );
      if (currentIndex > -1) {
        treeData.value = treeData.value.slice(0, currentIndex + 1);
        tabs.value = tabs.value.slice(0, currentIndex);
        tabs.value.push(item);
        tabs.value.push({ name: "请选择", organizationid: 0 });
        tabsActive.value = 0;
      } else {
        tabs.value = tabs.value.filter((tab) => tab.organizationid !== 0);
        tabs.value.push(item);
        tabs.value.push({ name: "请选择", organizationid: 0 });
        tabsActive.value = 0;
      }
      treeData.value.push(res.items.map(getItem));
    });
  }
};

const handleDelete = (item) => {
  // 已经选中的要重置
  treeData.value.forEach(arr => {
    arr.forEach(i => {
      if (i.organizationid === item.organizationid) {
        i.checked = false
      }
    })
  })
  selectValue.value = selectValue.value.filter((temp) => temp !== item.organizationid);
  selectText.value = selectText.value.filter((temp) => temp !== item.name);
  selectItem.value = selectItem.value.filter((temp) => temp.organizationid !== item.organizationid);
}

defineOptions({
  name: "SelectOrg",
});
</script>
<template>
  <van-field
    v-model="selectTextValue"
    is-link
    v-preview-text="showPreview"
    v-bind="$attrs"
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
  <van-popup v-model:show="selectVisible" position="bottom" v-bind="$attrs">
    <div class="select-org">
      <div class="header">
        <div class="cancel" @click="handleCancel">取消</div>
        <div class="modal-title">{{ title }}</div>
        <div class="confirm" @click="handleOk">确定</div>
      </div>
      <div class="content-wrapper">
        <div class="content-selects">
          <van-tag
            v-for="item in selectItem"
            :key="item.organizationid"
            closeable
            plain
            size="medium"
            type="primary"
            @close="handleDelete(item)"
          >
            {{ item.name }}
          </van-tag>
        </div>
        <div class="content-tabs">
          <van-tabs v-model:active="tabsActive" swipe-threshold="1" shrink>
            <van-tab
              v-for="(temp, index) in tabs"
              :title="temp.name"
              :key="temp.organizationid"
              :name="temp.organizationid"
            >
              <div class="content-list">
                <div
                  v-for="item in treeData[index]"
                  :key="item.organizationid"
                  class="item"
                  @click="handleEnter(item)"
                >
                  <div class="item-title">{{ item.name }}</div>
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
.select-org {
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
      color: #1989fa;
    }
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