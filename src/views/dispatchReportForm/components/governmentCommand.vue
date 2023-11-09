<script setup>
import { inject, watch } from "vue";
import SelectSingle from "@/component/SelectSingle/index";

const form = inject("form");

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
    <van-cell title="政府到场指挥情况：" required v-preview-text="showPreview" class="field-radio">
      <template #default>
        <van-radio-group
          v-model="form.investForce.isCommand.value"
          icon-size="16px"
          direction="horizontal"
          @change="onIsCommand"
        >
          <van-radio name="1">有</van-radio>
          <van-radio name="2">无</van-radio>
        </van-radio-group>
      </template>
    </van-cell>
    <div v-if="form.investForce.isCommand.value === '1'" class="block-dynamic">
      <div v-for="(item, index) in form.investForce.fireDispatchZfList" :key="index" class="block-dynamic-item">
        <div class="title">人员{{ index + 1}}<van-icon name="cross" v-if="!isDetail && index !== 0" @click="handleDeletePerson(index)" /></div>
        <van-field
          v-model="item.name"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="50"
          name="name"
          label="姓名："
          placeholder="请输入姓名"
          :rules="form.investForce.name.rules"
        />
        <van-field
          v-model="item.duty"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="50"
          name="duty"
          label="职务："
          placeholder="请输入职务"
          :rules="form.investForce.duty.rules"
        />
        <SelectSingle
          v-model:value="item.level"
          :showPreview="showPreview"
          :readonly="true"
          name="level"
          required
          :options="options.level"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择所属级别"
          label="所属级别："
          placeholder="请选择所属级别"
          :rules="form.investForce.level.rules"
        />
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
