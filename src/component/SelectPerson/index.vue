<script setup>
import { onMounted, ref, watch, computed, useAttrs, nextTick } from "vue";
import { getPersonList } from "@/apis/index.js";

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
});

const emit = defineEmits(["update:value", "change"]);

const attrs = useAttrs();

const proListRef = ref(null);

const selectVisible = ref(false);

const selectValue = ref([]);

const selectText = ref("");

watch(() => props.value, (val) => {
  nextTick(() => {
    if (props.value) {
      selectValue.value = props.value;
      selectText.value = selectValue.value?.map((item) => item.userName)?.join(",");
    } else {
      selectValue.value = [];
      selectText.value = "";
    }
  });
}, { immediate: true });

const checkSelect = (item) => {
  return selectValue.value?.map(item => item.boFireUserId).includes(item.boFireUserId)
}

const handleItem = (item) => {
  const filter = selectValue.value?.filter((it) => it.boFireUserId === item.boFireUserId);
  if (filter?.length <= 0) {
    selectValue.value.push(item);
  } else {
    selectValue.value = selectValue.value?.filter((it) => it.boFireUserId !== item.boFireUserId);
  }
  selectText.value = selectValue.value?.map((item) => item.userName)?.join(",");
  emit("update:value", selectValue.value);
  emit("change", selectValue.value, item);
};

const handleDelete = (item) => {
  selectValue.value = selectValue.value?.filter((it) => it.boFireUserId !== item.boFireUserId);
  selectText.value = selectValue.value?.map((item) => item.userName)?.join(",");
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
    proListRef.value.query.overQueryFlag = '1'
    proListRef.value.query.status = '1'
    if (proListRef.value.list?.length <= 0) {
      proListRef.value.filter();
    }
  });
};

const handleCancel = () => {
  selectVisible.value = false;
};

defineOptions({
  name: "SelectPerson",
});
</script>

<template>
  <van-field
    class="select-person-field"
    :class="{
      'van-field--disabled': $attrs.disabled,
    }"
    v-model="selectText"
    v-preview-text="showPreview"
    is-link
    v-bind="$attrs"
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
    <div class="select-person">
      <div class="header">
        <van-button type="default" size="small" @click="handleCancel">
          取消
        </van-button>
        <div class="modal-title">{{ placeholder }}</div>
        <van-button type="primary" size="small" @click="handleOk">
          确定
        </van-button>
      </div>
      <div class="content-selects">
        <van-tag
          v-for="item in selectValue"
          :key="item.boFireUserId"
          closeable
          plain
          size="medium"
          type="primary"
          @close="handleDelete(item)"
        >
          {{ item.userName }}
        </van-tag>
      </div>
      <div class="single-wrapper">
        <ProList
          ref="proListRef"
          title="人员列表"
          :getListFn="getPersonList"
          rowKey="boFireUserId"
          :showLoad="false"
          :showBack="false"
        >
          <template #list="{ record }">
            <div class="pro-list-item" @click="handleItem(record)">
              <div class="person-item">
                <div class="code">{{ record.userName }}</div>
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
.select-person {
  height: 62vh;
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
      color: #1989fa;
    }
  }
  :deep(.pro-list-item) {
    .person-item {
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
        color: green;
      }
    }
    .person-item::after {
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
