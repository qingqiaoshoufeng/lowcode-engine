<script setup>
import { inject } from 'vue'
import { gutter } from '@/utils/constants.js'
// import FieldAnnotation from '@/components/field-annotation/index.vue'

const form = inject('form')

const showPreview = inject('showPreview')

const isRequired = inject('isRequired')

const isDetail = inject('isDetail')

const options = inject('options')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const onHandleTwoCase = (e) => {
  if (e === '2') {
    form.value.caseHandling.penaltyNum.value = ''
    form.value.caseHandling.suggestDealNum.value = ''
  }
}

const onFirePenalty = (e) => {
  if (e === '2') {
    form.value.caseHandling.fireInfoOrgList = []
    form.value.caseHandling.fireInfoPersonList = []
  }
}

const handleAddUnit = () => {
  form.value.caseHandling.fireInfoOrgList.push({
    orgName: '',
    legalPerson: '',
    penalty: undefined,
  })
}

const handleDeleteUnit = (index) => {
  const { fireInfoOrgList } = form.value.caseHandling
  form.value.caseHandling.fireInfoOrgList = fireInfoOrgList.filter((item, i) => i !== index)
}

const handleAddPerson = () => {
  form.value.caseHandling.fireInfoPersonList.push({
    name: '',
    gender: undefined,
    adminSanction: undefined,
  })
}

const handleDeletePerson = (index) => {
  const { fireInfoPersonList } = form.value.caseHandling
  form.value.caseHandling.fireInfoPersonList = fireInfoPersonList.filter((item, i) => i !== index)
}
</script>

<template>
  <van-cell-group class="rootform1">
    <div :gutter="gutter">
      <div :span="8">
        <van-field 
          name="caseHandling.handleTwoCase.value"
          label="两案处理情况-是否立案："
          label-width="130"
          :required="isRequired"
          class="field-radio"
          :rules="form.caseHandling.handleTwoCase.rules"
        >
          <template #input>
            <van-radio-group 
              class="field-radio"
              id="handleTwoCase"
              v-model="form.caseHandling.handleTwoCase.value"
              v-preview-text="showPreview"
              @change="onHandleTwoCase"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="两案处理情况-是否立案："
              remark-field="handleTwoCase"
              field-module="caseHandling"
              :exist-data="fieldExist?.handleTwoCase"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="form.caseHandling.handleTwoCase.value === '1'" :span="8">
        <van-field 
          name="caseHandling.penaltyNum.value"
          label="追究人数（人）："
          :rules="form.caseHandling.penaltyNum.rules"
          id="penaltyNum"
          v-model="form.caseHandling.penaltyNum.value"
          v-preview-text="showPreview"
          :maxlength="10"
          style="width: 100%"
          allow-clear
          aria-autocomplete="none"
          placeholder="请输入追究人数"
          type="number" 
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="追究人数（人）："
              remark-field="penaltyNum"
              field-module="caseHandling"
              :exist-data="fieldExist?.penaltyNum"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="form.caseHandling.handleTwoCase.value === '1'" :span="8">
        <van-field 
          name="caseHandling.suggestDealNum.value"
          label="建议处理人数（人）："
          :rules="form.caseHandling.suggestDealNum.rules"
          id="suggestDealNum"
          v-model="form.caseHandling.suggestDealNum.value"
          v-preview-text="showPreview"
          style="width: 100%"
          :maxlength="10"
          allow-clear
          aria-autocomplete="none"
          placeholder="请输入处理人数"
          type="number" 
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="建议处理人数（人）："
              remark-field="suggestDealNum"
              field-module="caseHandling"
              :exist-data="fieldExist?.suggestDealNum"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
    </div>
    <div :gutter="gutter">
      <div :span="8">
        <van-field 
          name="caseHandling.firePenalty.value"
          label="火灾处罚情况-是否立案："
          label-width="130"
          :rules="form.caseHandling.firePenalty.rules"
          :required="isRequired"
          class="field-radio"
        >
          <template #input>
            <van-radio-group 
              id="firePenalty"
              class="field-radio"
              v-model="form.caseHandling.firePenalty.value"
              v-preview-text="showPreview"
              @change="onFirePenalty"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="火灾处罚情况-是否立案："
              remark-field="firePenalty"
              field-module="caseHandling"
              :exist-data="fieldExist?.firePenalty"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
    </div>
    <template v-if="form.caseHandling.firePenalty.value === '1'">
      <div class="list-title" style="border-color: #A4A4A4" dashed>
        处罚单位列表
      </div>
      <div class="dead-item" v-for="(item, index) in form.caseHandling.fireInfoOrgList" :key="index" :gutter="gutter">
        <div class="flex-wrapper">
            <div class="border-minus1 border-mius1" v-if="!isDetail" >
              <van-icon 
                class="form-col-delete"
                title="删除该处罚单位"
                name="minus"
                type="default"
                size="12"
                color="#444"
                style="margin: 0 20px"
                @click="handleDeleteUnit(index)"
              />
            </div>
          </div>
        <div :span="8">
          <van-field 
            :name="`caseHandling.fireInfoOrgList.${index},orgName`"
            label="单位名称："
            :rules="form.caseHandling.orgName.rules"
            id="orgName"
            v-model="item.orgName"
            v-preview-text="showPreview"
            :maxlength="50"
            allow-clear
            aria-autocomplete="none"
            placeholder="请输入单位名称"
            required
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="单位名称："
                remark-field="fireInfoOrgList"
                remark-field2="orgName"
                :remark-field2-id="index"
                field-module="caseHandling"
                :exist-data="fieldExist?.fireInfoOrgList?.[index]?.orgName"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </div>
        <div :span="8">
          <van-field 
            :name="`caseHandling.fireInfoOrgList.${index}.legalPerson`"
            label="法人代表："
            :rules="form.caseHandling.legalPerson.rules"
            id="legalPerson"
            v-model="item.legalPerson"
            v-preview-text="showPreview"
            :maxlength="50"
            allow-clear
            aria-autocomplete="none"
            placeholder="请输入法人代表"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="法人代表："
                remark-field="fireInfoOrgList"
                remark-field2="legalPerson"
                :remark-field2-id="index"
                field-module="caseHandling"
                :exist-data="fieldExist?.fireInfoOrgList?.[index]?.legalPerson"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`caseHandling.fireInfoOrgList.${index}.penalty`"
            label="行政处罚："
            :rules="form.caseHandling.penalty.rules"
            id="penalty"
            v-model:value="item.penalty"
            :showPreview="showPreview"
            :options="options.penalty"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            allow-clear
            placeholder="请选择行政处罚"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="行政处罚："
                remark-field="fireInfoOrgList"
                remark-field2="penalty"
                :remark-field2-id="index"
                field-module="caseHandling"
                :exist-data="fieldExist?.fireInfoOrgList?.[index]?.penalty"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
      </div>
  
      <van-button 
        v-if="!isDetail"
        @click="handleAddUnit"
        title="新增处罚单位"
        icon="plus" 
        type="default" 
        handleAddUnit
        size="small"
        style="margin: 0 20px"
        class="add"
      >
        新增处罚单位
      </van-button >
    </template>

    <template v-if="form.caseHandling.firePenalty.value === '1'">
      <div class="list-title" style="border-color: #A4A4A4" dashed>
        处罚个人列表
      </div>
      <div class="dead-item" v-for="(item, index) in form.caseHandling.fireInfoPersonList" :key="index" :gutter="gutter">
        <div class="flex-wrapper">
            <div class="border-minus1 border-mius1" v-if="!isDetail" >
              <van-icon 
                class="form-col-delete"
                title="删除该处罚个人"
                name="minus"
                type="default"
                size="12"
                color="#444"
                style="margin: 0 20px"
                @click="handleDeletePerson(index)"
              />
            </div>
          </div>
        <div :span="8">
          <van-field 
            :name="`caseHandling,fireInfoPersonList,${index},name`"
            label="姓名："
            :rules="form.caseHandling.name.rules"
            id="name"
            v-model="item.name"
            v-preview-text="showPreview"
            :maxlength="50"
            allow-clear
            aria-autocomplete="none"
            placeholder="请输入姓名"
            required
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="姓名："
                remark-field="fireInfoPersonList"
                remark-field2="name"
                :remark-field2-id="index"
                field-module="caseHandling"
                :exist-data="fieldExist?.fireInfoPersonList?.[index]?.name"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field >
        </div>
        <div :span="8">
          <SelectSingle
            :name="`caseHandling.fireInfoPersonList.${index}.gender`"
            label="性别："
            :rules="form.caseHandling.gender.rules"
            id="gender"
            v-model:value="item.gender"
            :showPreview="showPreview"
            :options="options.gender"
            allow-clear
            placeholder="请选择性别"
            :field-names="{ value: 'value', label: 'label' }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="性别："
                remark-field="fireInfoPersonList"
                remark-field2="gender"
                :remark-field2-id="index"
                field-module="caseHandling"
                :exist-data="fieldExist?.fireInfoPersonList?.[index]?.gender"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <SelectSingle
            :name="`caseHandling.fireInfoPersonList.${index}.adminSanction`"
            label="行政处罚："
            :rules="form.caseHandling.adminSanction.rules"
            id="adminSanction"
            v-model:value="item.adminSanction"
            v-preview-text="showPreview"
            :options="options.penalty"
            allow-clear
            placeholder="请选择行政处罚"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="行政处罚："
                remark-field="fireInfoPersonList"
                remark-field2="adminSanction"
                :remark-field2-id="index"
                field-module="caseHandling"
                :exist-data="fieldExist?.fireInfoPersonList?.[index]?.adminSanction"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
      </div>
      <van-button 
        v-if="!isDetail"
        @click="handleAddPerson"
        title="新增处罚个人"
        class="add"
        icon="plus" 
        type="default" 
        size="small"
        style="margin: 0 20px"
        >
          新增处罚个人
        </van-button>
    </template>
  </van-cell-group>
</template>
<style lang="scss" scoped>
  .dead-item {
    // padding-right: 0px;
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
  .add{
    width: calc(100% - 40px);
    &::after{
      display: none;
    }
  }
  .list-title{
    padding: 5px 10px;
    &::after{
      display: none;
    }
  }
  .flex-wrapper{
    margin-left:auto;
    padding-top: 10px;
    padding-right: 16px;
    &::after{
      display: none;
    }
  }
  .border-minus1 {
    margin-left: auto;
    border-radius: 50% !important;
    border: 2px solid #444 !important;
    width: 16px !important;
    height: 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
</style>
