<script setup>
import { inject, watch } from "vue";
import SelectSingle from "@/component/SelectSingle/index";

const form = inject("form");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const isDetail = inject("isDetail");

const showPreview = inject("showPreview");

const options = inject("options");

const handleAddPerson = () => {
  form.value.investForce.fireDispatchZfList.push({
    name: "",
    duty: "",
    level: undefined,
  });
};

const handleDeletePerson = (index) => {
  const { fireDispatchZfList } = form.value.investForce;
  form.value.investForce.fireDispatchZfList = fireDispatchZfList.filter(
    (item, i) => i !== index
  );
};

watch(
  () => form.value.investForce.isCommand.value,
  () => {
    if (
      form.value.investForce.isCommand.value === "1" &&
      form.value.investForce.fireDispatchZfList.length <= 0
    ) {
      handleAddPerson();
    } else if (form.value.investForce.isCommand.value === "2") {
      form.value.investForce.fireDispatchZfList = [];
    }
  }
);

const onIsCommand = (e) => {
  if (e === "2") {
    form.value.investForce.fireDispatchZfList = [
      {
        name: "",
        duty: "",
        level: undefined,
      },
    ];
  }
};
</script>

<template>
  <van-cell-group>
    <van-field 
      name="investForce.isCommand.value" 
      label="政府到场指挥情况："
      label-width="144px"
      :rules="form.investForce.isCommand.rules"
      required
      class="field-radio"
    >
      <template #input>
        <van-radio-group
          v-model="form.investForce.isCommand.value"
          v-preview-text="showPreview"
          icon-size="16px"
          direction="horizontal"
          @change="onIsCommand"
        >
          <van-radio name="1">有</van-radio>
          <van-radio name="2">无</van-radio>
        </van-radio-group>
      </template>
      <template v-slot:label="">
        <FieldAnnotation
          label="政府到场指挥情况："
          remark-field="isCommand"
          field-module="investForce"
          :exist-data="fieldExist?.isCommand"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
    <div v-if="form.investForce.isCommand.value === '1'" class="block-dynamic">
      <div v-for="(item, index) in form.investForce.fireDispatchZfList" :key="index" class="block-dynamic-item">
        <div class="title">人员{{ index + 1}}<van-icon name="cross" v-if="!isDetail && index !== 0" @click="handleDeletePerson(index)" /></div>
        <van-field
          v-model="item.name"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="50"
          :name="`investForce.fireDispatchZfList.${index}.name`" 
          label="姓名："
          placeholder="请输入姓名"
          :rules="form.investForce.name.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="姓名："
              remark-field="fireDispatchZfList"
              remark-field2="name"
              :remark-field2-id="index"
              field-module="investForce"
              :exist-data="fieldExist?.fireDispatchZfList?.[index]?.name"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field> 
        <van-field
          v-model="item.duty"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="50"
          :name="`investForce.fireDispatchZfList.${index}.duty`" 
          label="职务："
          placeholder="请输入职务"
          :rules="form.investForce.duty.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="职务："
              remark-field="fireDispatchZfList"
              remark-field2="duty"
              :remark-field2-id="index"
              field-module="investForce"
              :exist-data="fieldExist?.fireDispatchZfList?.[index]?.duty"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field> 
        <SelectSingle
          v-model:value="item.level"
          :showPreview="showPreview"
          :name="`investForce.fireDispatchZfList.${index}.level`" 
          required
          :options="options.level"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择所属级别"
          label="所属级别："
          placeholder="请选择所属级别"
          :rules="form.investForce.level.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="所属级别："
              remark-field="fireDispatchZfList"
              remark-field2="level"
              :remark-field2-id="index"
              field-module="investForce"
              :exist-data="fieldExist?.fireDispatchZfList?.[index]?.level"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle> 
      </div>
      <template v-if="!isDetail">
        <van-button type="default" icon="plus" size="small" style="margin: 0 20px" @click="handleAddPerson">
          新增人员
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
