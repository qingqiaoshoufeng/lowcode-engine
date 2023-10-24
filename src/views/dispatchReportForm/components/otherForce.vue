<script setup>
import { inject, onMounted, ref, watch } from "vue";
import SelectSingle from "@/component/SelectSingle/index";

const form = inject("form");

const isDetail = inject("isDetail");

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
    <van-cell title="是否有志愿队力量：" class="field-radio-label">
      <template #default>
        <van-radio-group
          v-model="form.investForce.haveVolunteer.value"
          v-preview-text="showPreview"
          icon-size="16px"
          direction="horizontal"
          @change="onHaveVolunteer"
        >
          <van-radio name="1">是</van-radio>
          <van-radio name="2">否</van-radio>
        </van-radio-group>
      </template>
    </van-cell>
    <div v-if="form.investForce.haveVolunteer.value === '1'" class="block-dynamic">
      <div v-for="(item, index) in form.investForce.volunteerList" :key="index" class="block-dynamic-item">
        <div class="title">志愿队{{ index + 1}}<van-icon name="cross" v-if="index !== 0" @click="handleDeleteVolunteer(index)" /></div>
        <SelectSingle
          v-model:value="item.groupType"
          :showPreview="showPreview"
          :readonly="true"
          name="groupType"
          required
          :options="options.groupType"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择志愿队类型"
          label="志愿队类型："
          label-width="104px"
          placeholder="请选择志愿队类型"
          :rules="form.investForce.groupType.rules"
        />
        <van-field
          v-model="item.orgName1"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="50"
          name="orgName1"
          label="志愿队名称："
          label-width="104px"
          placeholder="请输入志愿队名称"
          :rules="form.investForce.orgName1.rules"
        />
        <van-field
          v-model="item.peopleNum"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          type="number"
          maxlength="20"
          name="peopleNum"
          label="人数(人)："
          placeholder="请输入人数"
          :rules="form.investForce.peopleNum.rules"
        />
        <van-field
          v-model="item.trunkNum"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          type="number"
          maxlength="20"
          name="trunkNum"
          label="车数(辆)："
          placeholder="请输入车数"
          :rules="form.investForce.trunkNum.rules"
        />
        <van-field
          v-model="item.boatNum"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          type="number"
          maxlength="20"
          name="boatNum"
          label="艇(艘)："
          placeholder="请输入艇数"
          :rules="form.investForce.boatNum.rules"
        />
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
