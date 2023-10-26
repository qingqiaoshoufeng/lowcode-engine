<script setup>
import { onMounted, ref, watch, inject } from "vue";
import SelectSingle from "@/component/SelectSingle/index";
import SelectMultiple from "@/component/SelectMultiple/index";
import CascaderSingle from "@/component/CascaderSingle/index";
import SelectOrg from "@/component/SelectOrg/index";
import SelectRange from "@/component/SelectRange/index";
import AreaCascader from "@/component/AreaCascader/index";

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  resetFn: {
    type: Function,
  }
});

const emit = defineEmits(["update:value", "confirmCallback"]);

const query = inject("query");

const selectVisible = ref(false);

const handleMore = () => {
  selectVisible.value = true;
};

const handleReset = () => {
  props.resetFn()
}

const handleConfirm = () => {
  emit('confirmCallback')
  selectVisible.value = false;
}

defineOptions({
  name: "SelectMore",
});
</script>

<template>
  <van-cell
    title="选择更多条件"
    @click="handleMore"
    style="margin-left: 10px"
    is-link
  />
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="select-wrapper">
      <div class="select-more">
        <div v-for="item in options" :key="item.title" class="more-item">
          <div class="more-title">{{ item.title }}</div>
          <template v-if="item.type === 'input'">
            <van-field
              v-model="query[item.value]"
              label=""
              :placeholder="item.placeholder"
            />
          </template>
          <template v-else-if="item.type === 'select'">
            <SelectMultiple
              v-model:value="query[item.value]"
              :options="item.options"
              :field-names="item.fieldNames"
              :rule="[{ required: true, message: item.placeholder }]"
              :required="false"
              :placeholder="item.placeholder"
              :title="item.placeholder"
            />
          </template>
          <template v-else-if="item.type === 'select-single'">
            <SelectSingle
              v-model:value="query[item.value]"
              :options="item.options"
              :field-names="item.fieldNames"
              :rule="[{ required: true, message: item.placeholder }]"
              :required="false"
              :placeholder="item.placeholder"
              :title="item.placeholder"
            />
          </template>
          <template v-else-if="item.type === 'select-org'">
            <SelectOrg
              v-model:value="query[item.value]"
              :field-names="{ value: 'organizationid', label: 'name' }"
              :required="false"
              :placeholder="item.placeholder"
              :title="item.placeholder"
              :params="item.params"
              :single="item.single"
              :select-leaf="item.selectLeaf"
              :headers-disabled="item.headersDisabled"
            />
          </template>
          <template v-else-if="item.type === 'cascader'">
            <CascaderSingle
              v-model:value="query[item.value]"
              v-model:text="item.text"
              :options="item.options"
              :required="false"
              :field-names="item.fieldNames"
              label=""
              :placeholder="item.placeholder"
            />
          </template>
          <template v-else-if="item.type === 'select-area'">
            <AreaCascader
              v-model:value="query[item.value]"
              :required="false"
              label=""
            />
          </template>
          <template v-else-if="item.type === 'select-range'">
            <SelectRange 
              v-model:value="query[item.value]"
              :required="false"
              label=""
              :placeholder="item.placeholder"
            />
          </template>
        </div>
      </div>
      <div class="select-footer">
        <van-button type="primary" size="small" style="margin-right: 20px;" @click="handleReset">
          重置
        </van-button>
        <van-button type="success" size="small" @click="handleConfirm">
          确定
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.select-wrapper {
  height: 100vh;
  .select-more {
    height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    padding: 10px 16px;
    overflow-y: auto;
    .more-item {
      .more-title {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .select-footer {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
  }
}
</style>