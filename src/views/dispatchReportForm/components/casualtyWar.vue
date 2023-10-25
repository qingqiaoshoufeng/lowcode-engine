<script setup>
import { inject, onMounted, watch } from "vue";
import dayjs from "dayjs";
import { validIdCode } from "@/utils/validate.js";
import { getInfoByCard } from "@/utils/tools.js";

const form = inject("form");

const isDetail = inject("isDetail");

const showPreview = inject("showPreview");

const showMainGroup = inject("showMainGroup");

const showReinforce = inject("showReinforce");

const showHeadquarter = inject("showHeadquarter");

const options = inject("options");

const handleAddInjury = () => {
  form.value.casualtyWar.injuredList.push({
    // injuryType: '1',
    name: "", // 人员姓名
    identity: undefined, // 人员身份
    nation: undefined, // 民族
    personCode: "", // 消防证件号
    politicalOutlook: undefined, // 政治面貌
    idNumber: "", // 身份证号码
    gender: "", // 人员性别
    age: "", // 年龄
    nativePlace: [], // 户籍
    rescueRank: undefined, // 消防救援衔
    titleRank: "", // 衔级
    bridgingRank: undefined, // 职级
    duty: "", // 职务
    injuryPart: undefined, // 受伤部位
    teamEntryTime: undefined, // 入队时间（进入消防系统）
    period: undefined, // 事发阶段
    injuryReason: undefined, // 受伤原因
    protectDevice: undefined, // 防护装备情况
  });
};

const handleAddDead = () => {
  form.value.casualtyWar.deadList.push({
    // injuryType: '2',
    name: "", // 人员姓名
    identity: undefined, // 人员身份
    personCode: "", // 消防证件号
    nation: undefined, // 民族
    politicalOutlook: undefined, // 政治面貌
    idNumber: "", // 身份证号码
    gender: "", // 人员性别
    age: "", // 年龄
    nativePlace: [], // 户籍
    rescueRank: undefined, // 消防救援衔
    titleRank: "", // 衔级
    bridgingRank: undefined, // 职级
    duty: "", // 职务
    deathDate: undefined,
    injuryPart: undefined, // 致命伤部位
    teamEntryTime: undefined, // 入队时间（进入消防系统）
    period: undefined, // 事发阶段
    injuryReason: undefined, // 死亡原因
    protectDevice: undefined, // 防护装备情况
    isInstantDeath: "2", // 是否当场死亡
  });
};

const disabledDate = (current) => {
  return current && current > Date.now();
};

const handleDeleteInjury = (index) => {
  form.value.casualtyWar.injuredList =
    form.value.casualtyWar.injuredList.filter((item, i) => i !== index);
};

const handleDeleteDead = (index) => {
  form.value.casualtyWar.deadList = form.value.casualtyWar.deadList.filter(
    (item, i) => i !== index
  );
};

const validateCard = (rule, value, callback) => {
  if (!value) {
    if (form.value.casualtyWar.idNumber?.rules[0]?.required) {
      callback(new Error("请输入身份证号码"));
    } else {
      callback();
    }
  } else if (!validIdCode(value)) {
    callback(new Error("请输入正确身份证号码"));
  } else {
    callback();
  }
};

watch(
  () => form.value.casualtyWar.injuredList,
  () => {
    const { injuredList } = form.value.casualtyWar;
    injuredList.forEach((item) => {
      if (item.idNumber && validIdCode(item.idNumber)) {
        const { age, sex } = getInfoByCard(item.idNumber);
        item.gender = sex;
        item.age = age;
      } else {
        item.gender = "";
        item.age = "";
      }
    });
  },
  { deep: true }
);

watch(
  () => form.value.casualtyWar.deadList,
  () => {
    const { deadList } = form.value.casualtyWar;
    deadList.forEach((item) => {
      if (item.idNumber && validIdCode(item.idNumber)) {
        const { age, sex } = getInfoByCard(item.idNumber);
        item.gender = sex;
        item.age = age;
      } else {
        item.gender = "";
        item.age = "";
      }
    });
  },
  { deep: true }
);

watch(
  () => form.value.casualtyWar.isInjured.value,
  () => {
    if (
      form.value.casualtyWar.isInjured.value === "1" &&
      form.value.casualtyWar.injuredList.length <= 0
    ) {
      handleAddInjury();
    } else if (form.value.casualtyWar.isInjured.value === "2") {
      form.value.casualtyWar.injuredList = [];
    }
  }
);

watch(
  () => form.value.casualtyWar.isDead.value,
  () => {
    if (
      form.value.casualtyWar.isDead.value === "1" &&
      form.value.casualtyWar.deadList.length <= 0
    ) {
      handleAddDead();
    } else if (form.value.casualtyWar.isDead.value === "2") {
      form.value.casualtyWar.deadList = [];
    }
  }
);
</script>

<template>
  <van-cell-group>
    <div class="injured-message">
      共受伤 {{ form.casualtyWar.injuredList?.length }} 人，死亡
      {{ form.casualtyWar.deadList?.length }} 人
    </div>
    <van-cell title="是否有人员受伤：" class="field-radio-label">
      <template #default>
        <van-radio-group
          v-model="form.casualtyWar.isInjured.value"
          v-preview-text="showPreview"
          icon-size="16px"
          direction="horizontal"
        >
          <van-radio name="1">是</van-radio>
          <van-radio name="2">否</van-radio>
        </van-radio-group>
      </template>
    </van-cell>
    <!-- 受伤人员 -->
    <div v-if="form.casualtyWar.isInjured.value === '1'" class="block-dynamic">
      <div
        v-for="(item, index) in form.casualtyWar.injuredList"
        :key="index"
        class="block-dynamic-item"
      >
        <div class="title">
          受伤人员{{ index + 1
          }}<van-icon
            name="cross"
            v-if="!isDetail && index !== 0"
            @click="handleDeleteInjury(index)"
          />
        </div>
        <van-field
          v-model="item.name"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="20"
          name="name"
          label="人员姓名："
          placeholder="请输入人员姓名"
          :rules="form.casualtyWar.name.rules"
        />
        <SelectSingle
          v-if="showMainGroup || showReinforce"
          v-model:value="item.nation"
          :showPreview="showPreview"
          :readonly="true"
          name="nation"
          required
          :options="options.nation"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择民族"
          label="民族："
          placeholder="请选择民族"
          :rules="form.casualtyWar.nation.rules"
        />
        <SelectSingle
          v-model:value="item.identity"
          :showPreview="showPreview"
          :readonly="true"
          name="identity"
          required
          :options="options.identity"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择人员身份"
          label="人员身份："
          placeholder="请选择人员身份"
          :rules="form.casualtyWar.identity.rules"
        />
        <SelectSingle
          v-if="showMainGroup || showReinforce"
          v-model:value="item.politicalOutlook"
          :showPreview="showPreview"
          :readonly="true"
          name="politicalOutlook"
          required
          :options="options.politicalOutlook"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择政治面貌"
          label="政治面貌："
          placeholder="请选择政治面貌"
          :rules="form.casualtyWar.politicalOutlook.rules"
        />
        <SelectDateTime
          v-if="showMainGroup || showReinforce"
          v-model:value="item.teamEntryTime"
          :show-preview="showPreview"
          :readonly="showPreview"
          is-link
          required
          name="teamEntryTime"
          title="请选择入队时间"
          label="入队时间(进入消防系统)："
          label-width="130px"
          placeholder="请选择入队时间"
          :rules="form.casualtyWar.teamEntryTime.rules"
        />
        <van-field
          v-model="item.personCode"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="20"
          name="personCode"
          label="消防证件号："
          label-width="112px"
          placeholder="请输入消防证件号"
          :rules="form.casualtyWar.personCode.rules"
        />
        <van-field
          v-model="item.idNumber"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          type="number"
          maxlength="50"
          name="idNumber"
          label="身份证号码："
          label-width="110px"
          placeholder="请输入身份证号码"
          :rules="[{ validator: validateCard, trigger: 'blur' }, { required: form.casualtyWar.idNumber.rules[0].required, message: '' }]"
        />
        <SelectSingle
          v-model:value="item.gender"
          :showPreview="showPreview"
          :readonly="true"
          name="gender"
          required
          :options="options.gender"
          :field-names="{ value: 'value', label: 'label' }"
          title="请选择人员性别"
          label="人员性别："
          placeholder="请选择人员性别"
          :rules="form.casualtyWar.gender.rules"
          disabled
        />
        <van-field
          v-model="item.age"
          v-preview-text="showPreview"
          :readonly="true"
          required
          type="number"
          maxlength="50"
          name="age"
          label="年龄："
          placeholder="请输入年龄"
          :rules="form.casualtyWar.age.rules"
          disabled
        />
        <AreaCascader
          name="nativePlace"
          v-model:value="item.nativePlace"
          :showPreview="showPreview"
          :readonly="showPreview"
          :show-all-area="!!showPreview"
          :required="!showPreview"
          :rules="form.casualtyWar.nativePlace.rules"
        />
        <CascaderSingle
          v-if="showMainGroup || showReinforce"
          v-model:value="item.rescueRank"
          :showPreview="showPreview"
          :readonly="showPreview"
          name="rescueRank"
          :options="options.rescueRank"
          :required="true"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          label="消防救援衔"
          placeholder="请选择消防救援衔"
          :rules="form.casualtyWar.rescueRank.rules"
        />
        <van-field
          v-model="item.bridgingRank"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="50"
          name="bridgingRank"
          label="职级："
          placeholder="请输入职级"
          :rules="form.casualtyWar.bridgingRank.rules"
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
          :rules="form.casualtyWar.duty.rules"
        />
        <SelectSingle
          v-model:value="item.injuryPart"
          :showPreview="showPreview"
          :readonly="true"
          name="injuryPart"
          required
          :options="options.injuryPart"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择受伤部位"
          label="受伤部位："
          placeholder="请选择受伤部位"
          :rules="form.casualtyWar.injuryPart.rules"
        />
        <SelectSingle
          v-model:value="item.period"
          :showPreview="showPreview"
          :readonly="true"
          name="period"
          required
          :options="options.period"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择事发阶段"
          label="事发阶段："
          placeholder="请选择事发阶段"
          :rules="form.casualtyWar.period.rules"
        />
        <SelectSingle
          v-model:value="item.injuryReason"
          :showPreview="showPreview"
          :readonly="true"
          name="injuryReason"
          required
          :options="options.injuryReason"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择受伤原因"
          label="受伤原因："
          placeholder="请选择受伤原因"
          :rules="form.casualtyWar.injuryReason.rules"
        />
        <SelectSingle
          v-model:value="item.protectDevice"
          :showPreview="showPreview"
          :readonly="true"
          name="protectDevice"
          required
          :options="options.protectDevice"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择防护装备情况"
          label="防护装备情况："
          label-width="118px"
          placeholder="请选择防护装备情况"
          :rules="form.casualtyWar.protectDevice.rules"
        />
      </div>
      <template v-if="!isDetail">
        <van-button
          type="default"
          icon="plus"
          size="small"
          style="margin: 0 20px"
          @click="handleAddInjury"
        >
          新增受伤人员
        </van-button>
      </template>
    </div>
    <van-cell title="是否有人员死亡：" class="field-radio-label">
      <template #default>
        <van-radio-group
          v-model="form.casualtyWar.isDead.value"
          v-preview-text="showPreview"
          icon-size="16px"
          direction="horizontal"
        >
          <van-radio name="1">是</van-radio>
          <van-radio name="2">否</van-radio>
        </van-radio-group>
      </template>
    </van-cell>
    <!-- 死亡人员 -->
    <div v-if="form.casualtyWar.isDead.value === '1'" class="block-dynamic">
      <div v-for="(item, index) in form.casualtyWar.deadList" :key="index" class="block-dynamic-item">
        <div class="title">死亡人员{{ index + 1}}<van-icon name="cross" v-if="!isDetail && index !== 0" @click="handleDeleteDead(index)" /></div>
        <van-field
          v-model="item.name"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="20"
          name="name"
          label="姓名："
          placeholder="请输入姓名"
          :rules="form.investForce.name.rules"
        />
        <SelectSingle
          v-if="showMainGroup || showReinforce"
          v-model:value="item.nation"
          :showPreview="showPreview"
          :readonly="true"
          name="nation"
          required
          :options="options.nation"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择民族"
          label="民族："
          placeholder="请选择民族"
          :rules="form.casualtyWar.nation.rules"
        />
        <SelectSingle
          v-model:value="item.identity"
          :showPreview="showPreview"
          :readonly="true"
          name="identity"
          required
          :options="options.identity"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择人员身份"
          label="人员身份："
          placeholder="请选择人员身份"
          :rules="form.casualtyWar.identity.rules"
        />
        <SelectSingle
          v-if="showMainGroup || showReinforce"
          v-model:value="item.politicalOutlook"
          :showPreview="showPreview"
          :readonly="true"
          name="politicalOutlook"
          required
          :options="options.politicalOutlook"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择政治面貌"
          label="政治面貌："
          placeholder="请选择政治面貌"
          :rules="form.casualtyWar.politicalOutlook.rules"
        />
        <SelectDateTime
          v-if="showMainGroup || showReinforce"
          v-model:value="item.teamEntryTime"
          :show-preview="showPreview"
          :readonly="showPreview"
          is-link
          required
          name="teamEntryTime"
          title="请选择入队时间"
          label="入队时间(进入消防系统)："
          label-width="130px"
          placeholder="请选择入队时间"
          :rules="form.casualtyWar.teamEntryTime.rules"
        />
        <van-field
          v-model="item.personCode"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="20"
          name="personCode"
          label="消防证件号："
          label-width="112px"
          placeholder="请输入消防证件号"
          :rules="form.casualtyWar.personCode.rules"
        />
        <van-field
          v-model="item.idNumber"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          type="number"
          maxlength="50"
          name="idNumber"
          label="身份证号码："
          label-width="110px"
          placeholder="请输入身份证号码"
          :rules="[{ validator: validateCard, trigger: 'blur' }, { required: form.casualtyWar.idNumber.rules[0].required, message: '' }]"
        />
        <SelectSingle
          v-model:value="item.gender"
          :showPreview="showPreview"
          :readonly="true"
          name="gender"
          required
          :options="options.gender"
          :field-names="{ value: 'value', label: 'label' }"
          title="请选择人员性别"
          label="人员性别："
          placeholder="请选择人员性别"
          :rules="form.casualtyWar.gender.rules"
          disabled
        />
        <van-field
          v-model="item.age"
          v-preview-text="showPreview"
          :readonly="true"
          required
          type="number"
          maxlength="50"
          name="age"
          label="年龄："
          placeholder="请输入年龄"
          :rules="form.casualtyWar.age.rules"
          disabled
        />
        <AreaCascader
          name="nativePlace"
          v-model:value="item.nativePlace"
          :showPreview="showPreview"
          :readonly="showPreview"
          :show-all-area="!!showPreview"
          :required="!showPreview"
          :rules="form.casualtyWar.nativePlace.rules"
        />
        <CascaderSingle
          v-if="showMainGroup || showReinforce"
          v-model:value="item.rescueRank"
          :showPreview="showPreview"
          :readonly="showPreview"
          name="rescueRank"
          :options="options.rescueRank"
          :required="true"
          :field-names="{ value: 'boDictId', text: 'dictName' }"
          label="消防救援衔"
          placeholder="请选择消防救援衔"
          :rules="form.casualtyWar.rescueRank.rules"
        />
        <van-field
          v-model="item.bridgingRank"
          v-preview-text="showPreview"
          :readonly="showPreview"
          required
          maxlength="50"
          name="bridgingRank"
          label="职级："
          placeholder="请输入职级"
          :rules="form.casualtyWar.bridgingRank.rules"
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
          :rules="form.casualtyWar.duty.rules"
        />
        <SelectSingle
          v-model:value="item.injuryPart"
          :showPreview="showPreview"
          :readonly="true"
          name="injuryPart"
          required
          :options="options.injuryPart"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择致命伤部位"
          label="致命伤部位："
          label-width="112px"
          placeholder="请选择致命伤部位"
          :rules="form.casualtyWar.injuryPart.rules"
        />
        <SelectSingle
          v-model:value="item.period"
          :showPreview="showPreview"
          :readonly="true"
          name="period"
          required
          :options="options.period"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择事发阶段"
          label="事发阶段："
          placeholder="请选择事发阶段"
          :rules="form.casualtyWar.period.rules"
        />
        <SelectSingle
          v-model:value="item.injuryReason"
          :showPreview="showPreview"
          :readonly="true"
          name="injuryReason"
          required
          :options="options.injuryReason"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择死亡原因"
          label="死亡原因："
          placeholder="请选择死亡原因"
          :rules="form.casualtyWar.injuryReason.rules"
        />
        <SelectDateTime
          v-model:value="item.deathDate"
          :show-preview="showPreview"
          :readonly="showPreview"
          is-link
          required
          name="deathDate"
          title="请选择死亡日期"
          label="死亡日期："
          label-width="130px"
          placeholder="请选择死亡日期"
          :rules="form.casualtyWar.deathDate.rules"
        />
        <SelectSingle
          v-model:value="item.protectDevice"
          :showPreview="showPreview"
          :readonly="true"
          name="protectDevice"
          required
          :options="options.protectDevice"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          title="请选择防护装备情况"
          label="防护装备情况："
          label-width="118px"
          placeholder="请选择防护装备情况"
          :rules="form.casualtyWar.protectDevice.rules"
        />
        <van-cell title="是否当场死亡：" required class="field-radio-label">
          <template #default>
            <van-radio-group
              v-model="form.casualtyWar.isInstantDeath.value"
              v-preview-text="showPreview"
              icon-size="16px"
              direction="horizontal"
            >
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-cell>
      </div>
      <template v-if="!isDetail">
        <van-button type="default" icon="plus" size="small" style="margin: 0 20px" @click="handleAddDead">
          新增死亡人员
        </van-button>
      </template>
    </div>
  </van-cell-group>
</template>

<style lang="scss" scoped>
.injured-message {
  color: red;
  padding: 12px 0 0 20px;
}
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
.field-radio-label {
  :deep(.van-cell__title) {
    flex: unset;
    margin-right: 10px;
  }
}
</style>
