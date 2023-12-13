<script setup>
import { inject, watch } from 'vue'
import SelectSingle from "@/component/SelectSingle/index";

const form = inject('form')

const isDetail = inject('isDetail')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const showPreview = inject('showPreview')

const options = inject('options')

const handleAddUnit = () => {
  form.value.investForce.fireDispatchLinkList.push({
    orgName: '',
    departmentName: undefined,
    orgLevel: undefined,
  })
}

const handleDeleteUnit = (index) => {
  const { fireDispatchLinkList } = form.value.investForce
  form.value.investForce.fireDispatchLinkList = fireDispatchLinkList.filter((item, i) => i !== index)
}

watch(() => form.value.investForce.haveLinkageUnit.value, () => {
  if (form.value.investForce.haveLinkageUnit.value === '1' && form.value.investForce.fireDispatchLinkList.length <= 0) {
    handleAddUnit()
  }
  else if (form.value.investForce.haveLinkageUnit.value === '2') {
    form.value.investForce.fireDispatchLinkList = []
  }
})

const onHaveLinkageUnit = (e) => {
  if (e === '2') {
    form.value.investForce.fireDispatchLinkList = [{
      orgName: '',
      departmentName: undefined,
      orgLevel: undefined,
    }]
  }
}
</script>

<template>
  <van-cell-group>
    <van-field 
      name="investForce.haveLinkageUnit.value" 
      label="是否有联动单位："
      label-width="124px"
      :rules="form.investForce.haveLinkageUnit.rules"
      required
      class="field-radio"
    >
      <template #input>
        <van-radio-group
          v-model="form.investForce.haveLinkageUnit.value"
          v-preview-text="showPreview"
          icon-size="16px"
          direction="horizontal"
          @change="onHaveLinkageUnit"
        >
          <van-radio name="1">有</van-radio>
          <van-radio name="2">无</van-radio>
        </van-radio-group>
      </template>
      <template v-slot:label="">
        <FieldAnnotation
          label="是否有联动单位："
          remark-field="haveLinkageUnit"
          field-module="investForce"
          :exist-data="fieldExist?.haveLinkageUnit"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
    <div v-if="form.investForce.haveLinkageUnit.value === '1'" class="block-dynamic">
      <div v-for="(item, index) in form.investForce.fireDispatchZfList" :key="index" class="block-dynamic-item">
        <div class="title">人员{{ index + 1}}<van-icon name="cross" v-if="!isDetail && index !== 0" @click="handleDeleteUnit(index)" /></div>
        <van-field
          v-model="item.orgName"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="50"
          name="orgName"
          label="单位名称："
          placeholder="请输入单位名称"
          :rules="form.investForce.orgName.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="单位名称："
              remark-field="fireDispatchLinkList"
              remark-field2="orgName"
              :remark-field2-id="index"
              field-module="investForce"
              :exist-data="fieldExist?.fireDispatchLinkList?.[index]?.orgName"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <SelectSingle
          v-model:value="item.departmentName"
          :showPreview="showPreview"
          name="departmentName"
          required
          :options="options.departmentName"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择所属行业部门"
          label="所属行业部门："
          label-width="118px"
          placeholder="请选择所属行业部门"
          :rules="form.investForce.departmentName.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="所属行业部门："
              remark-field="fireDispatchLinkList"
              remark-field2="departmentName"
              :remark-field2-id="index"
              field-module="investForce"
              :exist-data="fieldExist?.fireDispatchLinkList?.[index]?.departmentName"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
        <SelectSingle
          v-model:value="item.orgLevel"
          :showPreview="showPreview"
          name="orgLevel"
          required
          :options="options.orgLevel"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择所属级别"
          label="所属级别："
          placeholder="请选择所属级别"
          :rules="form.investForce.orgLevel.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="所属级别："
              remark-field="fireDispatchLinkList"
              remark-field2="orgLevel"
              :remark-field2-id="index"
              field-module="investForce"
              :exist-data="fieldExist?.fireDispatchLinkList?.[index]?.orgLevel"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <template v-if="!isDetail">
        <van-button type="default" icon="plus" size="small" style="margin: 0 20px" @click="handleAddUnit">
          新增联动单位
        </van-button>
      </template>
    </div>
  </van-cell-group>
</template>

<style lang="scss" scoped>
.block-dynamic {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 0 10px 0;
  .block-dynamic-item {
    border: 1px solid #ebebeb;
    margin: 10px 10px;
    .title {
      display: flex;
      align-items: center;
      margin: 10px 20px 0 20px;
    }
    .title i {
      margin-left: auto;
    }
  }
}
</style>
