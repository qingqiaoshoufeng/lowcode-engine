<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { getDispatchGroup, searchDispatchGroup } from "@/apis/index.js";
import { Toast } from "vant";

const props = defineProps({
  value: {
    type: String,
    default: "",
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
  required: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "选择单位",
  },
  placeholder: {
    type: String,
    default: "请选择单位",
  },
  rule: {
    type: Array,
    default: () => [],
  },
  fieldNames: {
    type: Object,
    default: () => ({ value: "boDictId", label: "dictName" }),
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

const emit = defineEmits(["update:value", "change"]);

const selectVisible = ref(false);

const tabs = ref([{ name: "请选择", organizationid: 0 }]);

const tabsActive = ref(0);

const treeData = ref([]);

const selectValue = ref("");

const selectText = ref("");

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
    title: item[props.fieldNames.title],
    key: item[props.fieldNames.key],
  };
};

onMounted(() => {
  getDispatchGroup({
    ...props.params,
    disabledKey: props.disabledKey,
    disabledValue: props.disabledValue,
  }).then((res) => {
    treeData.value = [res?.items?.map(getItem)];
  });
});

const handleShow = () => {
  selectVisible.value = true;
};

const handleCancel = () => {
  selectVisible.value = false;
};

const handleOk = () => {
  // emit("update:value", selectValue.value);
  // emit("change", selectValue.value, selectItem.value);
  selectVisible.value = false;
};

const handleEnter = (item) => {
  if (item.hasChildren) {
    Toast.loading();
    getDispatchGroup({
      ...props.params,
      parentOrganizationId: item.organizationid,
      disabledKey: props.disabledKey,
      disabledValue: props.disabledValue,
    }).then((res) => {
      Toast.clear();
      tabs.value = tabs.value.filter((tab) => tab.organizationid !== 0);
      tabs.value.push(item);
      tabs.value.push({ name: "请选择", organizationid: 0 });
      tabsActive.value = 0;
      treeData.value.push(res.items.map(getItem));
    });
  }
};

const handleCheck = (item) => {};

defineOptions({
  name: "SelectOrg",
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
    @click="handleShow"
  />
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="select-org">
      <div class="header">
        <van-button type="default" size="small" @click="handleCancel">
          取消
        </van-button>
        <div class="modal-title">{{ title }}</div>
        <van-button type="primary" size="small" @click="handleOk"
          >确定</van-button
        >
      </div>
      <div class="content-wrapper">
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
                  <van-checkbox v-model="item.checked" />
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
    .modal-title {
      color: #242424;
      font-size: 16px;
      flex: 1;
      text-align: center;
    }
  }
  .content-wrapper {
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