<script setup>
import { onMounted, ref, computed, watch, useAttrs, nextTick } from "vue";
import { getSystemArea } from "@/apis/index.js";
import { showLoadingToast, closeToast } from "vant";
import { cloneDeep } from 'lodash-es';

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

const selectText = ref([]);

const showText = computed(() => {
  return selectText.value?.map(item => item?.join('/'))?.join(',')
})

watch(() => props.value, (newVal, oldVal) => {
  if (props.value?.length > 0) {
    selectValue.value = props.value
    selectText.value = props.text
    selectItem.value = selectValue.value.map((item, index) => {
      return item.map((temp, i) => {
        return {
          value: temp,
          label: selectText.value[index][i],
          boAreaId: temp,
          areaName: selectText.value[index][i]
        }
      })
    })
    const ids = selectValue.value.map(item => item[item.length - 1])?.join(',')
    treeData.value?.forEach(arr => {
      arr.forEach(i => {
        if (ids?.includes(i.boAreaId)) {
          i.checked = true
        } else {
          i.checked = false
        }
      })
    })
  } else {
    selectItem.value = [];
    selectValue.value = [];
    selectText.value = [];
  }
}, { immediate: true })

const getItem = (item) => {
  if (props.selectLevel > 0 && props.selectLevel === item.areaLvl) {
    item.isLeaf = true;
  } else {
    item.isLeaf = !item.hasChild;
  }
  let checked = false
  const ids = selectValue.value?.map(item => item[item.length - 1])?.join(',')
  if (ids?.indexOf(item.boAreaId) > -1) {
    checked = true
  }
  return {
    ...item,
    checked,
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
  if (attrs?.disabled) {
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

const handleCheck = (item) => {
  // 单选
  if (props.single && item.checked) {
    selectValue.value = []
    selectText.value = []
    selectItem.value = []
    // 已经选中的要重置
    treeData.value.forEach((arr) => {
      arr.forEach((i) => {
        if (i.boAreaId !== item.boAreaId && i.checked) {
          i.checked = false
        }
      })
    })
    nextTick(() => {
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
      selectValue.value = [selectValue.value.reverse()];
      selectItem.value = [selectItem.value.reverse()];
      selectText.value = selectItem.value?.map(item => {
        return item.map(temp => temp.areaName)
      });
      emit("update:value", selectValue.value);
      emit("update:text", selectText.value);
      emit("change", selectValue.value, selectItem.value, selectText.value);
    })
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

const handleDelete = (item) => {
  // 已经选中的要重置
  treeData.value.forEach(arr => {
    arr.forEach(i => {
      if (i.boAreaId === item?.[item?.length - 1]?.boAreaId && i.checked) {
        i.checked = false
      }
    })
  })
  selectValue.value = selectValue.value?.filter(temp => {
    return temp.map(i => i).join('/') !== item.map(i => i.boAreaId).join('/')
  });
  selectText.value = selectText.value?.filter(temp => {
    return temp.map(i => i).join('/') !== item.map(i => i.areaName).join('/')
  });
  selectItem.value = selectItem.value?.filter(temp => {
    return temp.map(i => i.boAreaId).join('/') !== item.map(i => i.boAreaId).join('/')
  });
}

onMounted(() => {
  getSystemArea({
    reportName: props.reportName,
    showAllArea: props.showAllArea,
    ...props.params,
  }).then((res) => {
    if (res) {
      treeData.value = [res.map(getItem)];
    }
  });
});

defineOptions({
  name: "AreaCascader",
});
</script>

<template>
  <van-field
    v-model="showText"
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
        <div class="field-annotation">{{ label }}</div>
      </slot>
    </template>
  </van-field>
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="area-cascader">
      <div class="header">
        <div class="cancel" @click="handleCancel">取消</div>
        <div class="modal-title">{{ title || placeholder }}</div>
        <div class="confirm" @click="handleOk">确定</div>
      </div>
      <div class="content-wrapper">
        <div class="content-selects">
          <van-tag
            v-for="(item, index) in selectItem"
            :key="index"
            closeable
            plain
            size="medium"
            type="primary"
            @close="handleDelete(item)"
          >
            {{ item?.map(temp => (temp.title || temp.areaName))?.join('/') }}
          </van-tag>
        </div>
        <div class="content-tabs">
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
                    @click="handleCheck(item)"
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
