<script setup>
import { inject, watch, computed, ref } from "vue";
import dayjs from "dayjs";
import ProCard from "@/component/ProCard/index.vue";
import { cloneDeep } from 'lodash-es';
import { showToast } from "vant";
import { validIdCode } from "@/utils/validate.js";
import { getInfoByCard } from "@/utils/tools.js";
import { getPersonDetail } from '@/apis/index.js';

const form = inject("form");

const fieldExist = inject("fieldExist");

const refreshField = inject("refreshField");

const isDetail = inject("isDetail");

const showPreview = inject("showPreview");

const showMainGroup = inject("showMainGroup");

const showReinforce = inject("showReinforce");

const showHeadquarter = inject("showHeadquarter");

const options = inject("options");

const diyValidateMap = inject("diyValidateMap");

const showNationTeam = inject('showNationTeam')

const isOpen = ref(((form.value.casualtyWar.injuredList.length || form.value.casualtyWar.deadList.length) || !isDetail))

const haveData = ref(((form.value.casualtyWar.injuredList.length || form.value.casualtyWar.deadList.length) || !isDetail))

const nameOptions = computed(() => {
  if (showHeadquarter.value) {
    const result = []
    let ids = ''
    form.value.personInfo.commandLeader?.forEach((item) => {
      if (item.headerName?.[0] && !ids.includes(item.headerName?.[0]?.boFireUserId)) {
        ids += `${item.headerName?.[0]?.boFireUserId},`
        result.push({
          ...item.headerName?.[0],
          label: item.headerName?.[0]?.userName,
          value: item.headerName?.[0]?.boFireUserId,
        })
      }
    })
    return result
  }
  if (form.value.investForce.commander?.value || form.value.investForce.firemen?.value) {
    const ids = form.value.investForce.commander?.value?.map(item => item.boFireUserId)?.join(',') || ''
    const result = cloneDeep(form.value.investForce.commander?.value) || []
    form.value.investForce.firemen.value?.forEach((item) => {
      if (!ids.includes(item.boFireUserId)) {
        result.push(item)
      }
    })
    return result
  }
  return []
})

const handleAddInjury = () => {
  form.value.casualtyWar.injuredList.push({
    // injuryType: '1',
    nameIds: undefined,
    name: undefined, // 人员姓名
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
    duty: undefined, // 职务
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
    nameIds: undefined,
    name: undefined, // 人员姓名
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
    duty: undefined, // 职务
    deathDate: undefined,
    injuryPart: undefined, // 致命伤部位
    teamEntryTime: undefined, // 入队时间（进入消防系统）
    period: undefined, // 事发阶段
    injuryReason: undefined, // 死亡原因
    protectDevice: undefined, // 防护装备情况
    isInstantDeath: "2", // 是否当场死亡
  });
};

const handleDeleteInjury = (index) => {
  form.value.casualtyWar.injuredList = form.value.casualtyWar.injuredList.filter((item, i) => i !== index);
};

const handleDeleteDead = (index) => {
  form.value.casualtyWar.deadList = form.value.casualtyWar.deadList.filter((item, i) => i !== index);
};

const validateCard = (value, rule) => {
  if (!value) {
    if (form.value.casualtyWar.idNumber?.rules[0]?.required) {
      return "请输入身份证号码";
    } else {
      return '';
    }
  } else if (!validIdCode(value)) {
    return "请输入正确身份证号码";
  } else {
    return '';
  }
};

const idNumberChange = (index) => {
  diyValidateMap.value.defaultKey.push(`casualtyWar.injuredList.${index}.idNumber`)
}

watch(() => form.value.casualtyWar.injuredList, () => {
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
}, { deep: true });

watch(() => form.value.casualtyWar.deadList, () => {
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
}, { deep: true });

watch(() => form.value.casualtyWar.isInjured.value, () => {
  if (
    form.value.casualtyWar.isInjured.value === "1" &&
    form.value.casualtyWar.injuredList.length <= 0
  ) {
    handleAddInjury();
  } else if (form.value.casualtyWar.isInjured.value === "2") {
    form.value.casualtyWar.injuredList = [];
  }
});

watch(() => form.value.casualtyWar.isDead.value, () => {
  if (
    form.value.casualtyWar.isDead.value === "1" &&
    form.value.casualtyWar.deadList.length <= 0
  ) {
    handleAddDead();
  } else if (form.value.casualtyWar.isDead.value === "2") {
    form.value.casualtyWar.deadList = [];
  }
});

const onChangeName = (item, index) => {
  if (form.value.casualtyWar.injuredList || form.value.casualtyWar.deadList) {
    const ids = []
    form.value.casualtyWar.injuredList?.forEach((i, idx) => {
      ids.push(i.nameIds)
    })
    form.value.casualtyWar.deadList?.forEach((i, idx) => {
      ids.push(i.nameIds)
    })
    if (ids.length !== Array.from(new Set(ids)).length) {
      item.name = undefined
      showToast('该人员已选择，请重新选择！')
      return
    } else {
      item.name = nameOptions.value.filter(i => (i.value === item.nameIds || i.boFireUserId === item.nameIds))?.[0]
    }
  }
  getPersonDetail(item.name?.boFireUserId || item.name?.value).then((res) => {
    if (res) {
      item.teamEntryTime = res.teamEntryTime ? dayjs(res.teamEntryTime) : undefined
      item.identity = res.userNature
      item.rescueRank = res.userLevel?.split(',')
      item.duty = res.userJob?.split(',')
    }
  })
}
</script>

<template>
  <ProCard :title="haveData ? '参战伤亡' : `参战伤亡（无数据）`" id="casualtyWar" :state="isOpen">
    <van-cell-group>
      <div class="injured-message">
        共受伤 {{ form.casualtyWar.injuredList?.length }} 人，死亡 {{ form.casualtyWar.deadList?.length }} 人
      </div>
      <van-field
        name="casualtyWar.isInjured.value"
        label="是否有人员受伤："
        label-width="130px"
        :rules="form.casualtyWar.isInjured.rules"
        required
        class="field-radio"
      >
        <template #input>
          <van-radio-group
            v-model="form.casualtyWar.isInjured.value"
            v-preview-text="showPreview"
            icon-size="16px"
            direction="horizontal"
          >
            <van-radio name="1">有</van-radio>
            <van-radio name="2">无</van-radio>
          </van-radio-group>
        </template>
        <template v-slot:label="">
          <FieldAnnotation
            label="是否有人员受伤："
            remark-field="isInjured"
            field-module="casualtyWar"
            :exist-data="fieldExist?.isInjured"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <!-- 受伤人员 -->
      <div v-if="form.casualtyWar.isInjured.value === '1'" class="block-dynamic">
        <div v-for="(item, index) in form.casualtyWar.injuredList" :key="index" class="block-dynamic-item">
          <div class="title">
            受伤人员{{ index + 1}}<van-icon name="cross" v-if="!isDetail && index !== 0" @click="handleDeleteInjury(index)" />
          </div>
          <SelectSingle
            v-if="showNationTeam"
            v-model:value="item.nameIds"
            :showPreview="showPreview"
            :name="`casualtyWar.injuredList.${index}.name`"
            required
            :options="nameOptions"
            :field-names="{ value: 'boFireUserId', label: 'userName' }"
            title="请选择人员姓名"
            label="人员姓名："
            placeholder="请选择人员姓名"
            :rules="form.casualtyWar.name.rules"
            @change="onChangeName(item, index)"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员姓名："
                remark-field="injuredList"
                remark-field2="name"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.name"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <van-field
            v-else
            v-model="item.name"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            maxlength="20"
            :name="`casualtyWar.injuredList.${index}.name`"
            label="人员姓名："
            label-width="110px"
            placeholder="请输入人员姓名"
            :rules="form.casualtyWar.name.rules"
          >
           <template v-slot:label="">
              <FieldAnnotation
                label="人员姓名："
                remark-field="injuredList"
                remark-field2="name"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.name"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
          <SelectSingle
            v-if="showMainGroup || showReinforce"
            v-model:value="item.nation"
            :showPreview="showPreview"
            :name="`casualtyWar.injuredList.${index}.nation`"
            required
            :options="options.nation"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择民族"
            label="民族："
            placeholder="请选择民族"
            :rules="form.casualtyWar.nation.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="民族："
                remark-field="injuredList"
                remark-field2="name"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.name"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectSingle
            v-model:value="item.identity"
            :showPreview="showPreview"
            :name="`casualtyWar.injuredList.${index}.identity`"
            required
            :options="options.identity"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择人员性质"
            label="人员性质："
            placeholder="请选择人员性质"
            :disabled="showNationTeam"
            :rules="form.casualtyWar.identity.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员性质："
                remark-field="injuredList"
                remark-field2="identity"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.identity"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectSingle
            v-if="showMainGroup || showReinforce"
            v-model:value="item.politicalOutlook"
            :showPreview="showPreview"
            :name="`casualtyWar.injuredList.${index}.politicalOutlook`"
            required
            :options="options.politicalOutlook"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择政治面貌"
            label="政治面貌："
            placeholder="请选择政治面貌"
            :rules="form.casualtyWar.politicalOutlook.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="政治面貌："
                remark-field="injuredList"
                remark-field2="politicalOutlook"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.politicalOutlook"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectDateTime
            v-if="showMainGroup || showReinforce"
            v-model:value="item.teamEntryTime"
            :show-preview="showPreview"
            is-link
            required
            :name="`casualtyWar.injuredList.${index}.teamEntryTime`"
            title="请选择入队时间"
            label="入队时间(进入消防系统)："
            label-width="172px"
            placeholder="请选择入队时间"
            :rules="form.casualtyWar.teamEntryTime.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="入队时间(进入消防系统)："
                remark-field="injuredList"
                remark-field2="teamEntryTime"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.teamEntryTime"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectDateTime>
          <van-field
            v-model="item.personCode"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            maxlength="20"
            :name="`casualtyWar.injuredList.${index}.personCode`"
            label="消防证件号："
            label-width="112px"
            placeholder="请输入消防证件号"
            :rules="form.casualtyWar.personCode.rules"
          >
           <template v-slot:label="">
              <FieldAnnotation
                label="消防证件号："
                remark-field="injuredList"
                remark-field2="personCode"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.personCode"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
          <van-field
            v-model="item.idNumber"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            maxlength="18"
            :name="`casualtyWar.injuredList.${index}.idNumber`"
            label="身份证号码："
            label-width="110px"
            placeholder="请输入身份证号码"
            :rules="[{ validator: validateCard, trigger: 'blur' }, { required: form.casualtyWar.idNumber.rules[0].required, message: '' }]"
            @change="idNumberChange(index)"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="身份证号码："
                remark-field="injuredList"
                remark-field2="idNumber"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.idNumber"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
          <SelectSingle
            v-model:value="item.gender"
            :showPreview="showPreview"
            :name="`casualtyWar.injuredList.${index}.gender`"
            required
            :options="options.gender"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择人员性别"
            label="人员性别："
            placeholder="请选择人员性别"
            :rules="form.casualtyWar.gender.rules"
            disabled
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员性别："
                remark-field="injuredList"
                remark-field2="gender"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.gender"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <van-field
            v-model="item.age"
            v-preview-text="showPreview"
            :readonly="true"
            required
            type="number"
            maxlength="3"
            :name="`casualtyWar.injuredList.${index}.age`"
            label="年龄："
            placeholder="请输入年龄"
            :rules="form.casualtyWar.age.rules"
            disabled
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="年龄："
                remark-field="injuredList"
                remark-field2="age"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.age"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
          <AreaCascader
            :name="`casualtyWar.injuredList.${index}.nativePlace`"
            v-model:value="item.nativePlace"
            :showPreview="showPreview"
            :preview-text="item.nativePlaceValue ? item.nativePlaceValue : ''"
            :show-all-area="!!showPreview"
            :required="!showPreview"
            :rules="form.casualtyWar.nativePlace.rules"
            label="户籍："
            placeholder="请选择户籍"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="户籍："
                remark-field="injuredList"
                remark-field2="nativePlace"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.nativePlace"
                @refresh-callback="refreshField"
              />
            </template>
          </AreaCascader> 
          <CascaderSingle
            v-if="showMainGroup || showReinforce"
            v-model:value="item.rescueRank"
            :showPreview="showPreview"
            :readonly="showPreview"
            :name="`casualtyWar.injuredList.${index}.showReinforce`"
            :options="options.rescueRank"
            :required="true"
            :field-names="{ value: 'boDictId', text: 'dictName' }"
            label="消防救援衔："
            label-width="108px"
            placeholder="请选择消防救援衔"
            :rules="form.casualtyWar.rescueRank.rules"
            :disabled="showNationTeam"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="消防救援衔："
                remark-field="injuredList"
                remark-field2="rescueRank"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.rescueRank"
                @refresh-callback="refreshField"
              />
            </template>
          </CascaderSingle> 
          <van-field
            v-if="showHeadquarter"
            v-model="item.bridgingRank"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            maxlength="50"
            :name="`casualtyWar.injuredList.${index}.bridgingRank`"
            label="职级："
            placeholder="请输入职级"
            :rules="form.casualtyWar.bridgingRank.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="职级："
                remark-field="injuredList"
                remark-field2="bridgingRank"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.bridgingRank"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
          <CascaderSingle
            v-model:value="item.duty"
            :showPreview="showPreview"
            :name="`casualtyWar.injuredList.${index}.duty`"
            required
            :options="options.duty"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择职务"
            label="职务："
            placeholder="请选择职务"
            :rules="form.casualtyWar.duty.rules"
            :disabled="showNationTeam"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="职务："
                remark-field="injuredList"
                remark-field2="duty"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.duty"
                @refresh-callback="refreshField"
              />
            </template>
          </CascaderSingle>
          <SelectSingle
            v-model:value="item.injuryPart"
            :showPreview="showPreview"
            :name="`casualtyWar.injuredList.${index}.injuryPart`"
            required
            :options="options.injuryPart"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择受伤部位"
            label="受伤部位："
            placeholder="请选择受伤部位"
            :rules="form.casualtyWar.injuryPart.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="受伤部位："
                remark-field="injuredList"
                remark-field2="injuryPart"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.injuryPart"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectSingle
            v-model:value="item.period"
            :showPreview="showPreview"
            :name="`casualtyWar.injuredList.${index}.period`"
            required
            :options="options.period"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择事发阶段"
            label="事发阶段："
            placeholder="请选择事发阶段"
            :rules="form.casualtyWar.period.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="事发阶段："
                remark-field="injuredList"
                remark-field2="period"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.period"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectSingle
            v-model:value="item.injuryReason"
            :showPreview="showPreview"
            :name="`casualtyWar.injuredList.${index}.injuryReason`"
            required
            :options="options.injuryReason"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择受伤原因"
            label="受伤原因："
            placeholder="请选择受伤原因"
            :rules="form.casualtyWar.injuryReason.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="受伤原因："
                remark-field="injuredList"
                remark-field2="injuryReason"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.injuredList?.[index]?.injuryReason"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectSingle
            v-model:value="item.protectDevice"
            :showPreview="showPreview"
            :name="`casualtyWar.injuredList.${index}.protectDevice`"
            required
            :options="options.protectDevice"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择防护装备情况"
            label="防护装备情况："
            label-width="118px"
            placeholder="请选择防护装备情况"
            :rules="form.casualtyWar.protectDevice.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="防护装备情况："
                remark-field="deadList"
                remark-field2="deathDate"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.deathDate"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
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
      <van-field
        name="casualtyWar.isDead.value"
        label="是否有人员死亡："
        label-width="130px"
        :rules="form.casualtyWar.isDead.rules"
        required
        class="field-radio"
      >
        <template #input>
          <van-radio-group
            v-model="form.casualtyWar.isDead.value"
            v-preview-text="showPreview"
            icon-size="16px"
            direction="horizontal"
          >
            <van-radio name="1">有</van-radio>
            <van-radio name="2">无</van-radio>
          </van-radio-group>
        </template>
        <template v-slot:label="">
          <FieldAnnotation
            label="是否有人员死亡："
            remark-field="isDead"
            field-module="casualtyWar"
            :exist-data="fieldExist?.isDead"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <!-- 死亡人员 -->
      <div v-if="form.casualtyWar.isDead.value === '1'" class="block-dynamic">
        <div v-for="(item, index) in form.casualtyWar.deadList" :key="index" class="block-dynamic-item">
          <div class="title">死亡人员{{ index + 1}}<van-icon name="cross" v-if="!isDetail && index !== 0" @click="handleDeleteDead(index)" /></div>
          <SelectSingle
            v-if="showNationTeam"
            v-model:value="item.nameIds"
            :showPreview="showPreview"
            :name="`casualtyWar.deadList.${index}.name`"
            required
            :options="nameOptions"
            :field-names="{ value: 'boFireUserId', label: 'userName' }"
            title="请选择人员姓名"
            label="人员姓名："
            placeholder="请选择人员姓名"
            :rules="form.casualtyWar.name.rules"
            @change="onChangeName(item, index)"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="姓名："
                remark-field="deadList"
                remark-field2="name"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.name"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <van-field
            v-else
            v-model="item.name"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            maxlength="20"
            :name="`casualtyWar.deadList.${index}.name`"
            label="人员姓名："
            label-width="110px"
            placeholder="请输入人员姓名"
            :rules="form.casualtyWar.name.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员姓名："
                remark-field="deadList"
                remark-field2="name"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.name"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
          <SelectSingle
            v-if="showMainGroup || showReinforce"
            v-model:value="item.nation"
            :showPreview="showPreview"
            :name="`casualtyWar.deadList.${index}.nation`"
            :options="options.nation"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择民族"
            label="民族："
            placeholder="请选择民族"
            :rules="form.casualtyWar.nation.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="民族："
                remark-field="deadList"
                remark-field2="nation"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.nation"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectSingle
            v-model:value="item.identity"
            :showPreview="showPreview"
            :name="`casualtyWar.deadList.${index}.identity`"
            required
            :options="options.identity"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择人员性质"
            label="人员性质："
            placeholder="请选择人员性质"
            :rules="form.casualtyWar.identity.rules"
            :disabled="showNationTeam"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员性质："
                remark-field="deadList"
                remark-field2="identity"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.identity"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectSingle
            v-if="showMainGroup || showReinforce"
            v-model:value="item.politicalOutlook"
            :showPreview="showPreview"
            :name="`casualtyWar.deadList.${index}.politicalOutlook`"
            required
            :options="options.politicalOutlook"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择政治面貌"
            label="政治面貌："
            placeholder="请选择政治面貌"
            :rules="form.casualtyWar.politicalOutlook.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="政治面貌："
                remark-field="deadList"
                remark-field2="politicalOutlook"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.politicalOutlook"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectDateTime
            v-if="showMainGroup || showReinforce"
            v-model:value="item.teamEntryTime"
            :show-preview="showPreview"
            is-link
            required
            :name="`casualtyWar.deadList.${index}.teamEntryTime`"
            title="请选择入队时间"
            label="入队时间(进入消防系统)："
            label-width="172px"
            placeholder="请选择入队时间"
            :rules="form.casualtyWar.teamEntryTime.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="入队时间(进入消防系统)："
                remark-field="deadList"
                remark-field2="teamEntryTime"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.teamEntryTime"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectDateTime>
          <van-field
            v-model="item.personCode"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            maxlength="20"
            :name="`casualtyWar.deadList.${index}.personCode`"
            label="消防证件号："
            label-width="112px"
            placeholder="请输入消防证件号"
            :rules="form.casualtyWar.personCode.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="消防证件号："
                remark-field="deadList"
                remark-field2="personCode"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.personCode"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
          <van-field
            v-model="item.idNumber"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            maxlength="18"
            :name="`casualtyWar.deadList.${index}.idNumber`"
            label="身份证号码："
            label-width="110px"
            placeholder="请输入身份证号码"
            :rules="[{ validator: validateCard, trigger: 'blur' }, { required: form.casualtyWar.idNumber.rules[0].required, message: '' }]"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="身份证号码："
                remark-field="deadList"
                remark-field2="idNumber"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.idNumber"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
          <SelectSingle
            v-model:value="item.gender"
            :showPreview="showPreview"
            :name="`casualtyWar.deadList.${index}.gender`"
            required
            :options="options.gender"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择人员性别"
            label="人员性别："
            placeholder="请选择人员性别"
            :rules="form.casualtyWar.gender.rules"
            disabled
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="人员性别："
                remark-field="deadList"
                remark-field2="gender"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.gender"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <van-field
            v-model="item.age"
            v-preview-text="showPreview"
            :readonly="true"
            required
            type="number"
            maxlength="3"
            :name="`casualtyWar.deadList.${index}.age`"
            label="年龄："
            placeholder="请输入年龄"
            :rules="form.casualtyWar.age.rules"
            disabled
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="年龄："
                remark-field="deadList"
                remark-field2="age"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.age"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
          <AreaCascader
            :name="`casualtyWar.deadList.${index}.nativePlace`"
            v-model:value="item.nativePlace"
            :showPreview="showPreview"
            :preview-text="item.nativePlaceValue ? item.nativePlaceValue : ''"
            :show-all-area="!!showPreview"
            :required="!showPreview"
            :rules="form.casualtyWar.nativePlace.rules"
            label="户籍："
            placeholder="请选择户籍"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="户籍："
                remark-field="deadList"
                remark-field2="age"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.age"
                @refresh-callback="refreshField"
              />
            </template>
          </AreaCascader>
          <CascaderSingle
            v-if="showMainGroup || showReinforce"
            v-model:value="item.rescueRank"
            :showPreview="showPreview"
            :readonly="showPreview"
            :name="`casualtyWar.deadList.${index}.rescueRank`"
            :options="options.rescueRank"
            :required="true"
            :field-names="{ value: 'boDictId', text: 'dictName' }"
            label="消防救援衔："
            label-width="108px"
            placeholder="请选择消防救援衔"
            :rules="form.casualtyWar.rescueRank.rules"
            :disabled="showNationTeam"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="消防救援衔："
                remark-field="deadList"
                remark-field2="rescueRank"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.rescueRank"
                @refresh-callback="refreshField"
              />
            </template>
          </CascaderSingle>
          <van-field
            v-if="showHeadquarter"
            v-model="item.bridgingRank"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            maxlength="50"
            :name="`casualtyWar.deadList.${index}.bridgingRank`"
            label="职级："
            placeholder="请输入职级"
            :rules="form.casualtyWar.bridgingRank.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="职级："
                remark-field="deadList"
                remark-field2="bridgingRank"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.bridgingRank"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
          <CascaderSingle
            v-model:value="item.duty"
            :showPreview="showPreview"
            :name="`casualtyWar.deadList.${index}.duty`"
            required
            :options="options.duty"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择职务"
            label="职务："
            placeholder="请选择职务"
            :rules="form.casualtyWar.duty.rules"
            :disabled="showNationTeam"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="职务："
                remark-field="deadList"
                remark-field2="duty"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.duty"
                @refresh-callback="refreshField"
              />
            </template>
          </CascaderSingle>
          <SelectSingle
            v-model:value="item.injuryPart"
            :showPreview="showPreview"
            :name="`casualtyWar.deadList.${index}.injuryPart`"
            required
            :options="options.injuryPart"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择致命伤部位"
            label="致命伤部位："
            label-width="112px"
            placeholder="请选择致命伤部位"
            :rules="form.casualtyWar.injuryPart.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="致命伤部位："
                remark-field="deadList"
                remark-field2="injuryPart"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.injuryPart"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectSingle
            v-model:value="item.period"
            :showPreview="showPreview"
            :name="`casualtyWar.deadList.${index}.period`"
            required
            :options="options.period"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择事发阶段"
            label="事发阶段："
            placeholder="请选择事发阶段"
            :rules="form.casualtyWar.period.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="事发阶段："
                remark-field="deadList"
                remark-field2="period"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.period"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectSingle
            v-model:value="item.injuryReason"
            :showPreview="showPreview"
            :name="`casualtyWar.deadList.${index}.injuryReason`"
            required
            :options="options.injuryReason"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择死亡原因"
            label="死亡原因："
            placeholder="请选择死亡原因"
            :rules="form.casualtyWar.injuryReason.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="死亡原因："
                remark-field="deadList"
                remark-field2="injuryReason"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.injuryReason"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <SelectDateTime
            v-model:value="item.deathDate"
            :show-preview="showPreview"
            is-link
            required
            :name="`casualtyWar.deadList.${index}.deathDate`"
            title="请选择死亡日期"
            label="死亡日期："
            label-width="130px"
            placeholder="请选择死亡日期"
            :rules="form.casualtyWar.deathDate.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="死亡日期："
                remark-field="deadList"
                remark-field2="deathDate"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.deathDate"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectDateTime>
          <SelectSingle
            v-model:value="item.protectDevice"
            :showPreview="showPreview"
            :name="`casualtyWar.deadList.${index}.protectDevice`"
            required
            :options="options.protectDevice"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择防护装备情况"
            label="防护装备情况："
            label-width="118px"
            placeholder="请选择防护装备情况"
            :rules="form.casualtyWar.protectDevice.rules"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="防护装备情况："
                remark-field="deadList"
                remark-field2="protectDevice"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.protectDevice"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
          <van-field
            :name="`casualtyWar.deadList.${index}.isInstantDeath`"
            label="是否当场死亡："
            label-width="124px"
            :rules="form.casualtyWar.isInstantDeath.rules"
            required
            class="field-radio"
          >
            <template #input>
              <van-radio-group
                v-model="item.isInstantDeath"
                v-preview-text="showPreview"
                icon-size="16px"
                direction="horizontal"
              >
                <van-radio name="1">是</van-radio>
                <van-radio name="2">否</van-radio>
              </van-radio-group>
            </template>
            <template v-slot:label="">
              <FieldAnnotation
                label="是否当场死亡："
                remark-field="deadList"
                remark-field2="isInstantDeath"
                :remark-field2-id="index"
                field-module="casualtyWar"
                :exist-data="fieldExist?.deadList?.[index]?.isInstantDeath"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </div>
        <template v-if="!isDetail">
          <van-button type="default" icon="plus" size="small" style="margin: 0 20px" @click="handleAddDead">
            新增死亡人员
          </van-button>
        </template>
      </div>
    </van-cell-group>
  </ProCard>
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
