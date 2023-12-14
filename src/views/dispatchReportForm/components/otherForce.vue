<script setup>
import { inject, onMounted, ref, watch } from "vue";
import SelectSingle from "@/component/SelectSingle/index";

const form = inject("form");

const isDetail = inject("isDetail");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const showPreview = inject("showPreview");

const options = inject("options");

const handleAddVolunteer = () => {
  form.value.investForce.volunteerList.push({
    // otherType: '1',
    groupType: undefined,
    orgName1: "",
    peopleNum: "",
    trunkNum: "",
    boatNum: "",
  });
};

const handleDeleteVolunteer = (index) => {
  form.value.investForce.volunteerList =
    form.value.investForce.volunteerList.filter((item, i) => i !== index);
};

watch(() => form.value.investForce.haveVolunteer.value, () => {
  if (
    form.value.investForce.haveVolunteer.value === "1" &&
      form.value.investForce.volunteerList.length <= 0
  ) {
    handleAddVolunteer();
  } else if (form.value.investForce.haveVolunteer.value === "2") {
    form.value.investForce.volunteerList = [];
  }
}
);

const onHaveVolunteer = (e) => {
  if (e === '2') {
    form.value.investForce.volunteerList = []
  }
}
</script>

<template>
  <van-cell-group>
    <van-field 
      name="investForce.haveVolunteer.value" 
      label="是否有志愿队力量：" 
      :rules="form.investForce.haveVolunteer.rules"
      required
      class="field-radio"
    >
      <template #input>
        <van-radio-group
          v-model="form.investForce.haveVolunteer.value"
          v-preview-text="showPreview"
          icon-size="16px"
          direction="horizontal"
          @change="onHaveVolunteer"
        >
          <van-radio name="1">有</van-radio>
          <van-radio name="2">无</van-radio>
        </van-radio-group>
      </template>
      <template v-slot:label="">
        <FieldAnnotation
          label="是否有志愿队力量："
          remark-field="haveVolunteer"
          field-module="investForce"
          :exist-data="fieldExist?.haveVolunteer"
          @refresh-callback="refreshField"
        />
      </template>
    </van-field>
    <div v-if="form.investForce.haveVolunteer.value === '1'" class="block-dynamic">
      <div v-for="(item, index) in form.investForce.volunteerList" :key="index" class="block-dynamic-item">
        <div class="title">志愿队{{ index + 1}}<van-icon name="cross" v-if="!isDetail && index !== 0" @click="handleDeleteVolunteer(index)" /></div>
        <SelectSingle
          v-model:value="item.groupType"
          :showPreview="showPreview"
          :readonly="true"
          :name="`investForce.volunteerList.${index}.groupType`"
          required
          :options="options.groupType"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择志愿队类型"
          label="志愿队类型："
          label-width="104px"
          placeholder="请选择志愿队类型"
          :rules="form.investForce.groupType.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="志愿队类型："
              remark-field="volunteerList"
              remark-field2="groupType"
              :remark-field2-id="index"
              field-module="investForce"
              :exist-data="fieldExist?.volunteerList?.[index]?.groupType"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
        <van-field
          v-model="item.orgName1"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="50"
          :name="`investForce.volunteerList.${index}.orgName1`"
          label="志愿队名称："
          label-width="104px"
          placeholder="请输入志愿队名称"
          :rules="form.investForce.orgName1.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="志愿队名称："
              remark-field="volunteerList"
              remark-field2="orgName1"
              :remark-field2-id="index"
              field-module="investForce"
              :exist-data="fieldExist?.volunteerList?.[index]?.orgName1"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="item.peopleNum"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          type="number"
          maxlength="10"
          :name="`investForce.volunteerList.${index}.peopleNum`"
          label="人数(人)："
          placeholder="请输入人数"
          :rules="form.investForce.peopleNum.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="人数(人)："
              remark-field="volunteerList"
              remark-field2="peopleNum"
              :remark-field2-id="index"
              field-module="investForce"
              :exist-data="fieldExist?.volunteerList?.[index]?.peopleNum"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="item.trunkNum"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          type="number"
          maxlength="10"
          :name="`investForce.volunteerList.${index}.trunkNum`"
          label="车数(辆)："
          placeholder="请输入车数"
          :rules="form.investForce.trunkNum.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="车数(辆)："
              remark-field="volunteerList"
              remark-field2="trunkNum"
              :remark-field2-id="index"
              field-module="investForce"
              :exist-data="fieldExist?.volunteerList?.[index]?.trunkNum"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
        <van-field
          v-model="item.boatNum"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          type="number"
          maxlength="10"
          :name="`investForce.volunteerList.${index}.boatNum`"
          label="艇(艘)："
          placeholder="请输入艇数"
          :rules="form.investForce.boatNum.rules"
        >
          <template v-slot:label="">
            <FieldAnnotation
              remark-field="volunteerList"
              remark-field2="boatNum"
              :remark-field2-id="index"
              field-module="investForce"
              :exist-data="fieldExist?.volunteerList?.[index]?.boatNum"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <template v-if="!isDetail">
        <van-button type="default" icon="plus" size="small" style="margin: 0 20px" @click="handleAddVolunteer">
          新增志愿队力量
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
