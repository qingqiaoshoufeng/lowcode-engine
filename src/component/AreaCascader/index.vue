<script setup>
import { onMounted, ref, watch, useAttrs } from "vue";
import { getSystemArea } from "@/apis/index.js";
import { showLoadingToast, closeToast } from "vant";
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  value: {
    type: Array,
    default: () => [],
  },
  text: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "",
  },
  reportName: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: true,
  },
  rules: {
    type: Array,
    default: () => [],
  },
  showPreview: {
    type: Boolean,
    default: false,
  },
  previewText: {
    type: String,
    default: '',
  },
  single: {
    type: Boolean,
    default: true,
  },
  selectLeaf: {
    // 是否只选择叶子节点
    type: Boolean,
    default: true,
  },
  showAllArea: {
    type: Boolean,
    default: false,
  },
  selectLevel: {
    type: Number,
    default: -1,
  },
  placeholder: {
    type: String,
    default: "请选择行政区域",
  },
  params: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:value", "update:text", "change"]);

const attrs = useAttrs();

const selectVisible = ref(false);

const tabs = ref([{ areaName: "请选择", boAreaId: 0 }]);

const tabsActive = ref(0);

const treeData = ref([]);

const selectValue = ref([]);

const selectItem = ref([]);

const selectText = ref('');

watch(() => props.value, (newVal, oldVal) => {
  if (props.value?.length <= 0) {
    selectItem.value = [];
    selectValue.value = [];
    selectText.value = '';
  }
}, { immediate: true })

const getItem = (item) => {
  if (props.selectLevel > 0 && props.selectLevel === item.areaLvl) {
    item.isLeaf = true;
  } else {
    item.isLeaf = !item.hasChild;
  }
  return {
    ...item,
    checked: false,
    title: item.areaName,
    key: item.boAreaId,
  };
};

const showCheck = (item) => {
  if (props.selectLeaf) {
    return item.isLeaf;
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
  emit("update:value", selectValue.value);
  emit("update:text", selectText.value);
  emit("change", selectValue.value, selectItem.value, selectText.value);
  selectVisible.value = false;
};

const initValue = () => {
  // 已经选中的要重置
  const boAreaId = props.value?.pop()
  treeData.value.forEach(arr => {
    arr.forEach(i => {
      if (i.boAreaId === boAreaId) {
        i.checked = true
      }
    })
  })
  cloneDeep(treeData.value).reverse().forEach(arr => {
    arr.forEach(i => {
      if (i.boAreaId === boAreaId && i.checked) {
        selectValue.value.push(i.boAreaId)
        selectItem.value.push(i)
      }
      const parentIds = selectItem.value?.map(i => i.parentAreaId)?.join(',')
      if (parentIds.indexOf(i.boAreaId) > -1) {
        selectValue.value.push(i.boAreaId)
        selectItem.value.push(i)
      }
    })
  })
  selectValue.value = selectValue.value.reverse();
  selectItem.value = selectItem.value.reverse();
  selectText.value = selectItem.value?.map(item => item.areaName)?.join('/');
}

const handleCheck = (item) => {
  // 单选
  if (props.single && item.checked) {
    selectValue.value = []
    selectText.value = ''
    selectItem.value = []
    // 已经选中的要重置
    treeData.value.forEach(arr => {
      arr.forEach(i => {
        if (i.boAreaId !== item.boAreaId && i.checked) {
          i.checked = false
        }
      })
    })
    cloneDeep(treeData.value).reverse().forEach(arr => {
      arr.forEach(i => {
        if (i.boAreaId === item.boAreaId && i.checked) {
          selectValue.value.push(i.boAreaId)
          selectItem.value.push(i)
        }
        const parentIds = selectItem.value?.map(item => item.parentAreaId)?.join(',')
        if (parentIds.indexOf(i.boAreaId) > -1) {
          selectValue.value.push(i.boAreaId)
          selectItem.value.push(i)
        }
      })
    })
    selectValue.value = selectValue.value.reverse();
    selectItem.value = selectItem.value.reverse();
    selectText.value = selectItem.value?.map(item => item.areaName)?.join('/');
    emit("update:value", selectItem.value);
    emit("update:text", selectText.value);
    emit("change", selectValue.value, selectItem.value, selectText.value);
    return
  } else if (props.single && !item.checked) {
    selectValue.value = [];
    selectItem.value = [];
    selectText.value = [];
    return
  }
};

const handleEnter = (item) => {
  if (item.hasChild) {
    showLoadingToast();
    getSystemArea({
      parentAreaId: item.boAreaId,
      reportName: props.reportName,
      showAllArea: props.showAllArea,
      ...props.params,
    }).then((res) => {
      closeToast();
      const currentIndex = tabs.value.findIndex(
        (node) => node.areaLvl === item.areaLvl
      );
      if (currentIndex > -1) {
        treeData.value = treeData.value.slice(0, currentIndex + 1);
        tabs.value = tabs.value.slice(0, currentIndex);
        tabs.value.push(item);
        tabs.value.push({ areaName: "请选择", boAreaId: 0 });
        tabsActive.value = 0;
      } else {
        tabs.value = tabs.value.filter((tab) => tab.boAreaId !== 0);
        tabs.value.push(item);
        tabs.value.push({ areaName: "请选择", boAreaId: 0 });
        tabsActive.value = 0;
      }
      treeData.value.push(res?.map(getItem));
    });
  }
};

const handleDelete = () => {
  // 已经选中的要重置
  treeData.value.forEach(arr => {
    arr.forEach(i => {
      if (i.boAreaId === selectItem.value?.[selectItem.value?.length - 1]?.boAreaId && i.checked) {
        i.checked = false
      }
    })
  })
  selectValue.value = [];
  selectText.value = '';
  selectItem.value = [];
}

onMounted(() => {
  if (props.value?.length > 1 && (!props.showPreview || !props.previewText)) {
    Promise.all([
      getSystemArea({
        reportName: props.reportName,
        showAllArea: props.showAllArea,
        ...props.params,
      }),
      getSystemArea({
        parentAreaId: props.value[0],
        reportName: props.reportName,
        showAllArea: props.showAllArea,
        ...props.params,
      }),
      getSystemArea({
        parentAreaId: props.value[1],
        reportName: props.reportName,
        showAllArea: props.showAllArea,
        ...props.params,
      }),
      getSystemArea({
        parentAreaId: props.value[2],
        reportName: props.reportName,
        showAllArea: props.showAllArea,
        ...props.params,
      }),
    ]).then((res) => {
      if (res[3] && res[3].length > 0) {
        treeData.value.unshift(res[3].map(getItem))
      }
      if (res[2] && res[2].length > 0) {
        treeData.value.unshift(res[2].map(getItem))
      }
      if (res[1]) {
        treeData.value.unshift(res[1].map(getItem))
      }
      treeData.value.unshift(res[0].map(getItem))
      initValue()
    });
  } else if (props.showPreview && props.previewText) {
    selectText.value = props.previewText
  } else {
    getSystemArea({
      reportName: props.reportName,
      showAllArea: props.showAllArea,
      ...props.params,
    }).then((res) => {
      if (res) {
        treeData.value = [res.map(getItem)];
      }
    });
  }
});

defineOptions({
  name: "AreaCascader",
});
</script>

<template>
  <van-field
    v-model="selectText"
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
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="area-cascader">
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
            v-if="selectItem?.length > 0"
            closeable
            plain
            size="medium"
            type="primary"
            @close="handleDelete()"
          >
            {{ selectItem?.map(temp => (temp.title || temp.areaName))?.join('/') }}
          </van-tag>
        </div>
        <div class="content-tabs">
          {{ tabs.value }}
          <van-tabs v-model:active="tabsActive" swipe-threshold="1" shrink>
            <van-tab
              v-for="(temp, index) in tabs"
              :title="temp.areaName"
              :key="temp.boAreaId"
              :name="temp.boAreaId"
            >
              <div class="content-list">
                <div
                  v-for="item in treeData[index]"
                  :key="item.boAreaId"
                  class="item"
                  @click="handleEnter(item)"
                >
                  <div class="item-title">{{ item.areaName }}</div>
                  <van-checkbox
                    v-if="showCheck(item)"
                    v-model="item.checked"
                    @change="handleCheck(item)"
                    @click.stop
                  />
                  <van-icon v-if="item.hasChild" name="arrow" class="icon-arrow" />
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
.area-cascader {
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
      height: 7vh;
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
