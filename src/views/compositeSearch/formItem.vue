<script setup>
import { inject } from 'vue'
import InputNumberRange from "@/component/InputNumberRange/index.vue";
import SelectMultiple from '@/component/SelectMultiple/index.vue';
import SelectSingle from '@/component/SelectSingle/index.vue';
import CascaderMultiple from '@/component/CascaderMultiple/index.vue';
import SelectOrg from "@/component/SelectOrg/index";
import SelectRangeTime from "@/component/SelectRangeTime/index";
import SelectCar from '@/component/SelectCar/index.vue';
import SelectPerson from '@/component/SelectPerson/index.vue';
import AreaCascader from "@/component/AreaCascader/index";

const props = defineProps({
  fieldObj: {
    type: Object,
    default: () => {},
  },
});

const searchDimension = inject('searchDimension')

const options = inject('options');
</script>

<template>
  <div class="search-form-item">
    <template v-if="fieldObj?.type === 'select-single'">
      <SelectSingle
        v-model:value="fieldObj.value"
        :readonly="true"
        :options="options[fieldObj.options]"
        :field-names="fieldObj.fieldNames ? fieldObj.fieldNames : { value: 'value', label: 'label' }"
        :label="`${fieldObj.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="`请选择${fieldObj.label}`"
        :title="`请选择${fieldObj.label}`"
      />
    </template>
    <template v-if="fieldObj?.type === 'select-nodes'">
      <SelectMultiple
        v-model:value="fieldObj.arr"
        v-model:nodes="fieldObj.value"
        :readonly="true"
        :options="options[fieldObj.options]"
        :field-names="fieldObj.fieldNames ? fieldObj.fieldNames : { value: 'value', label: 'label' }"
        :label="`${fieldObj.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="`请选择${fieldObj.label}`"
        :title="`请选择${fieldObj.label}`"
      />
    </template>
    <template v-if="fieldObj?.type === 'select-multiple'">
      <SelectMultiple
        v-model:value="fieldObj.value"
        :readonly="true"
        :options="options[fieldObj.options]"
        :field-names="fieldObj.fieldNames ? fieldObj.fieldNames : { value: 'value', label: 'label' }"
        :label="`${fieldObj.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="`请选择${fieldObj.label}`"
        :title="`请选择${fieldObj.label}`"
      />
    </template>
    <template v-else-if="fieldObj?.type === 'radio-is'">
      <van-field
        :label="`${fieldObj.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="`请选择${fieldObj.label}`"
        class="field-radio item-is-radio"
      >
        <template #input>
          <van-radio-group
            v-model="fieldObj.value"
            icon-size="14px"
            direction="horizontal"
          >
            <van-radio v-for="item in fieldObj.options" :key="item.label" :name="item.value">
              {{ item.label }}
            </van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </template>
    <template v-else-if="fieldObj?.type === 'input'">
      <van-field
        v-model="fieldObj.value"
        :label="`${fieldObj?.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="`请输入${fieldObj?.label}`"
      />
    </template>
    <template v-else-if="fieldObj?.type === 'input-range'">
      <InputNumberRange
        v-model:value="fieldObj.value"
        :label="`${fieldObj?.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="fieldObj?.placeholder"
      />
    </template>
    <template v-else-if="fieldObj?.type === 'select-org'">
      <SelectOrg
        v-model:value="fieldObj.value"
        :readonly="true"
        :field-names="{ value: 'organizationid', label: 'name' }"
        :label="`${fieldObj?.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="`请选择${fieldObj?.label}`"
        :title="`请选择${fieldObj?.label}`"
        :single="fieldObj.single"
        :select-leaf="fieldObj.selectLeaf"
        :headers-disabled="fieldObj.headersDisabled"
        :params="{ ...fieldObj.params, staticFlag: searchDimension }"
      />
    </template>
    <template v-else-if="fieldObj?.type === 'cascader-multiple'">
      <CascaderMultiple
        v-model:value="fieldObj.value"
        :readonly="true"
        :options="options[fieldObj.options]"
        :field-names="fieldObj.fieldNames ? fieldObj.fieldNames : { value: 'boDictId', label: 'dictName' }"
        :label="`${fieldObj.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :select-leaf="fieldObj.selectLeaf"
        :placeholder="`请选择${fieldObj.label}`"
        :title="`请选择${fieldObj.label}`"
      />
    </template>
    <template v-else-if="fieldObj?.type === 'select-range'">
      <SelectRangeTime
        v-model:value="fieldObj.value"
        :readonly="true"
        :label="`${fieldObj.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="`请选择${fieldObj.label}`"
      />
    </template>
    <template v-else-if="fieldObj?.type === 'select-car'">
      <SelectCar
        v-model:value="fieldObj.value"
        :readonly="true"
        :label="`${fieldObj.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="`请选择${fieldObj.label}`"
      />
    </template>
    <template v-else-if="fieldObj?.type === 'select-person'">
      <SelectPerson
        v-model:value="fieldObj.value"
        :readonly="true"
        :label="`${fieldObj.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="`请选择${fieldObj.label}`"
      />
    </template>
    <template v-if="fieldObj?.type === 'area-cascader'">
      <AreaCascader
        v-model:value="fieldObj.value"
        :readonly="true"
        :label="`${fieldObj.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="`请选择${fieldObj.label}`"
      />
    </template>
    <template v-else-if="fieldObj?.type === 'checkbox'">
      <van-field
        :label="`${fieldObj.label}：`"
        :label-width="`${fieldObj?.labelWidth}`"
        :placeholder="`请选择${fieldObj.label}`"
      >
        <template #input>
          <van-checkbox-group v-model="fieldObj.value" direction="horizontal">
            <van-checkbox
              v-for="item in options[fieldObj.options]"
              :key="item.boDictId"
              :name="item.boDictId"
              shape="square"
            >
              {{ item.dictName }}
            </van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.search-form-item {
  position: relative;
  :deep(.van-cell) {
    padding: 10px 10px;
  }
  :deep(.van-field__label) {
    margin-right: 0px;
  }
  :deep(.van-checkbox) {
    margin-bottom: 5px;
  }
  .item-is-radio {
    :deep(.van-radio):last-child {
      margin-right: 0px;
    }
    :deep(.van-cell__title) {
      margin-left: 0px !important;
    }
  }
}
.search-form-item::after {
  content: '';
  width: calc(100% - 10px);
  position: absolute;
  bottom: 0px;
  right: 0px;
  border: 1px solid #F6F6F6;
}
</style>
