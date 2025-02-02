<script setup>
import { onMounted, ref, watch, computed, useAttrs, nextTick } from "vue";
import { getCarList } from "@/apis/index.js";

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
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
  extraParams: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:value", "change"]);

const attrs = useAttrs();

const proListRef = ref(null);

const selectVisible = ref(false);

const selectValue = ref([]);

const selectText = ref("");

const defaultFilterValue = {
  overQueryFlag: '1',
  status: '1',
  isSelfOrg: ['1'],
  queryLoanFlag: '1', // 借调车辆
  ...props.extraParams,
};

watch(() => props.value, (val) => {
  nextTick(() => {
    if (props.value) {
      selectValue.value = props.value;
      selectText.value = selectValue.value?.map((item) => item.truckNumber)?.join(",");
    } else {
      selectValue.value = [];
      selectText.value = "";
    }
  });
}, { immediate: true });

const checkSelect = (item) => {
  return selectValue.value?.map(item => item.boFireTruckId).includes(item.boFireTruckId)
}

const handleItem = (item) => {
  const filter = selectValue.value?.filter((it) => it.boFireTruckId === item.boFireTruckId);
  if (filter?.length <= 0) {
    selectValue.value.push(item);
  } else {
    selectValue.value = selectValue.value?.filter((it) => it.boFireTruckId !== item.boFireTruckId);
  }
  selectText.value = selectValue.value?.map((item) => item.truckNumber)?.join(",");
  emit("update:value", selectValue.value);
  emit("change", selectValue.value, item);
};

const handleDelete = (item) => {
  selectValue.value = selectValue.value?.filter((it) => it.boFireTruckId !== item.boFireTruckId);
  selectText.value = selectValue.value?.map((item) => item.truckNumber)?.join(",");
  emit("update:value", selectValue.value);
  emit("change", selectValue.value, selectText.value);
};

const handleOk = () => {
  emit("update:value", selectValue.value);
  emit("change", selectValue.value, selectText.value);
  selectVisible.value = false;
};

const handleShow = () => {
  if (attrs?.disabled || props.showPreview) {
    return;
  }
  selectVisible.value = true;
  nextTick(() => {
    if (proListRef.value.list?.length <= 0) {
      proListRef.value.filter();
    }
  });
};

const handleCancel = () => {
  selectVisible.value = false;
};

const onSelfChange = () => {
  proListRef.value.filter();
}

defineOptions({
  name: "SelectCar",
});
</script>

<template>
  <van-field
    class="select-car-field"
    :class="{
      'van-field--disabled': $attrs.disabled,
    }"
    v-model="selectText"
    v-preview-text="showPreview"
    is-link
    v-bind="$attrs"
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
    <div class="select-car">
      <div class="header">
        <div class="cancel" @click="handleCancel">取消</div>
        <div class="modal-title">{{ placeholder }}</div>
        <div class="confirm" @click="handleOk">确定</div>
      </div>
      <div class="content-selects">
        <van-tag
          v-for="item in selectValue"
          :key="item.boFireTruckId"
          closeable
          plain
          size="medium"
          type="primary"
          @close="handleDelete(item)"
        >
          {{ item.truckNumber }}
        </van-tag>
      </div>
      <div class="single-wrapper">
        <ProList
          ref="proListRef"
          title="车辆列表"
          :defaultFilterValue="defaultFilterValue"
          :getListFn="getCarList"
          rowKey="boFireTruckId"
          :showLoad="false"
          :showBack="false"
        >
          <template #search="{ filterFormState }">
            <div class="list-tabs">
              <van-checkbox-group
                v-model="filterFormState.isSelfOrg"
                shape="square"
                style="padding: 10px 10px;"
                @change="onSelfChange"
              >
                <van-checkbox name="1">仅查看本单位</van-checkbox>
              </van-checkbox-group>
            </div>
          </template>
          <template #list="{ record }">
            <div class="pro-list-item" @click="handleItem(record)">
              <div class="car-item">
                <div class="code">{{ record.truckNumber }}</div>
                <div class="org">{{ record.organizationName }}</div>
                <van-icon v-if="checkSelect(record)" name="success" class="icon" />
              </div>
            </div>
          </template>
        </ProList>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.van-field--disabled {
  pointer-events: none;
}
.select-car {
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    height: 44px;
    padding: 0 10px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .cancel {
      color: #969799;
    }
    .confirm {
      color: var(--van-primary-color);
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
  .single-wrapper {
    height: 50vh;
    overflow-y: hidden;
    .selected-icon {
      background-color: white;
      border: white;
      color: var(--van-primary-color);
    }
  }
  :deep(.pro-list-item) {
    .car-item {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 10px;
      .code {
        width: 50%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .org {
        width: calc(50% - 20px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .icon {
        color: var(--van-primary-color);
      }
    }
    .car-item::after {
      content: "";
      width: 100%;
      height: 1px;
      background-color: #dcdee0;
      position: absolute;
      left: 0;
      bottom: -10px;
    }
  }
}
</style>
