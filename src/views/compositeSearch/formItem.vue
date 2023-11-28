<script setup>
import { inject } from 'vue'
import InputNumberRange from "@/component/InputNumberRange/index.vue";
import SelectMultiple from '@/component/SelectMultiple/index.vue';

const props = defineProps({
  fieldObj: {
    type: Object,
    default: () => {},
  },
});

const options = inject('options');
</script>

<template>
  <div class="search-form-item">
    <template v-if="fieldObj?.type === 'select-multiple'">
      <SelectMultiple
        v-model:value="fieldObj.value"
        :readonly="true"
        :options="options[fieldObj.options]"
        :field-names="fieldObj.fieldNames ? fieldObj.fieldNames : { value: 'value', label: 'label' }"
        :label="`${fieldObj.label}：`"
        :placeholder="`请选择${fieldObj.label}`"
        :title="`请选择${fieldObj.label}`"
      />
    </template>
    <template v-else-if="fieldObj?.type === 'select-single'"> ... </template>
    <template v-else-if="fieldObj?.type === 'radio-is'">
      <van-cell :title="`${fieldObj?.label}：`" class="field-radio">
        <template #default>
          <van-radio-group
            v-model="fieldObj.value"
            icon-size="14px"
            direction="horizontal"
            class="item-is-radio"
          >
            <van-radio name="1">有</van-radio>
            <van-radio name="2">无</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
    </template>
    <template v-else-if="fieldObj?.type === 'input'">
      <van-field
        v-model="fieldObj.value"
        :label="`${fieldObj?.label}：`"
        :placeholder="`请输入${fieldObj?.label}`"
      />
    </template>
    <template v-else-if="fieldObj?.type === 'input-range'">
      <InputNumberRange
        v-model:value="fieldObj.value"
        :label="`${fieldObj?.label}：`"
        :placeholder="fieldObj?.placeholder"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.search-form-item {
  .item-is-radio {
    :deep(.van-radio):last-child {
      margin-right: 0;
    }
  }
}
</style>
