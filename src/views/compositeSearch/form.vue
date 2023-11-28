<script setup>
import { computed, inject, nextTick, onBeforeMount, onMounted, provide, ref } from 'vue';
import { getFireWarningTag } from '@/apis/index.js';
import FormItem from './formItem.vue'
import {
  dispatchInjuryType,
  dispatchType,
  fireHeadLevel,
  gender,
  injuryType,
  isNot,
  isResearch,
  networking,
  regulation,
  warningDealStatus,
  seasonRange,
  statisticRange,
} from '@/utils/constants.js';
import { useStore } from "vuex";
import { useIntersection } from '@/hooks/useIntersection.js';

const store = useStore();

const form = inject('form');

const searchType = inject('searchType');

const options = inject('options');

onMounted(() => {
  // 获取字典
  options.value.isNot = isNot
  options.value.isResearch = isResearch
  options.value.regulation = regulation
  options.value.networking = networking
  options.value.injuryType = injuryType
  options.value.dispatchInjuryType = dispatchInjuryType
  options.value.gender = gender
  options.value.dispatchType = dispatchType
  options.value.statisticRange = statisticRange
  options.value.seasonRange = seasonRange
  options.value.fireHeadLevel = fireHeadLevel // 指挥部层级
  options.value.dispatchFireHeadLvl = fireHeadLevel
  options.value.warningDealStatus = warningDealStatus // 警情处置情况
  options.value.monthRange = [...Array(12)].map((i, index) => ({ dictName: index + 1, boDictId: `${index + 1}` }))
  options.value.dayRange = [...Array(31)].map((i, index) => ({ dictName: index + 1, boDictId: `${index + 1}` }))
  const res = store.getters?.["dict/filterDicts"](['JQ_TYPE', 'HZ_INFO_QY', 'HZ_QHCS', 'HZ_QHYY', 'HZ_INFO_HZDJ', 'HZ_QHWZ_CS', 'HZ_QHXT_SGXT', 'HZ_INFO_BGSY',
    'HZ_INFO', 'HZ_QHJZ_JZBQ', 'HZ_INFO_JZLB', 'HZ_INFO_NHDJ', 'HZ_INFO_JZJG', 'HZ_QHJZ_JZYT', 'HZ_JTGJ', 'HZ_INFO_CDZT', 'HZ_INFO_DCLX',
    'HZ_INFO_XSZT', 'HZ_INFO_DCFS', 'HZ_INFO_SSLY', 'HZ_SW_STWZ', 'HZ_INFO_STZY', 'CD_CZRY_SSBW', 'HZ_INFO_SZ', 'CD_CZRY_SSYY', 'HZ_INFO_JKZK',
    'HZ_INFO_ZY', 'HZ_INFO_LY', 'HZ_SW_ZJLX', 'HZ_SW_MZ', 'HZ_INFO_JJLX', 'HZ_INFO_SGBM', 'HZ_INFO_BXLX', 'HZ_INFO_JCQK', 'HZ_INFO_SJY', 'JQ_TYPE', 'NATURAL_DISASTER_TYPE',
    'JQ_LEVEL', 'CD_JYQK_CZ', 'CD_DC_HZQK', 'CD_BACK', 'TQ_TYPE_FL', 'TQ_TYPE_FX', 'TQ_TYPE_TQ', 'USER_JOB', 'CD_JBXX_GG', 'CD_JBXX_BSY', 'CD_OTHER_ZY',
    'DEAD_TIME', 'HZ_INFO_JZXS', 'CD_STATUS', 'HZ_STATUS', 'CD_RANK', 'CD_CZRY_FHZB', 'CD_CZRY_SSBW', 'CD_CZRY_SFSD', 'CD_HYZG', 'STA_TIME', 'RANK_TYPE', 'CD_QQHEAD_TYPE',
    'CAR_TYPE', 'JQ_STATUS', 'CD_LOOK', 'HZ_QHW_TYPE', 'HZ_YHY', 'HZ_INFO_RWYS', 'HZ_INFO_SSBW', 'HZ_INFO_YY', 'DEPT_NATURE', 'HZ_QHWZ_JTGJ', 'USER_JOB'], null, false)
  options.value.warningType = res.JQ_TYPE
  // 火灾信息
  options.value.area = res.HZ_INFO_QY // 区域
  options.value.firePlace = res.HZ_QHCS // 起火场所类型
  options.value.fireCause = res.HZ_QHYY // 起火原因
  options.value.fireLevel = res.HZ_INFO_HZDJ // 火灾等级
  options.value.fireSite = res.HZ_QHWZ_JTGJ // 请选择起火位置
  options.value.firePattern = res.HZ_QHXT_SGXT // 事故形态
  options.value.useType = res.HZ_INFO_BGSY // 变更后使用性质
  options.value.industry = res.HZ_INFO // 所属行业
  options.value.buildTag = res.HZ_QHJZ_JZBQ // 建筑标签
  options.value.buildType = res.HZ_INFO_JZLB // 建筑类别
  options.value.fireResistanceRating = res.HZ_INFO_NHDJ // 耐火等级
  options.value.buildStructure = res.HZ_INFO_JZJG // 建筑结构
  options.value.buildUse = res.HZ_QHJZ_JZYT // 建筑使用用途
  options.value.vehicleType = res.HZ_JTGJ // 交通工具类型
  options.value.chargeState = res.HZ_INFO_CDZT // 起火时充电状态
  options.value.batteryType = res.HZ_INFO_DCLX // 电池类型
  options.value.driveState = res.HZ_INFO_XSZT // 行驶状态
  options.value.inspectMethod = res.HZ_INFO_DCFS // 调查方式
  options.value.costSource = res.HZ_INFO_SSLY // 损失来源
  options.value.bodyLocation = res.HZ_SW_STWZ// 发现尸体位置
  options.value.mainSymptoms = res.HZ_INFO_STZY // 身体主要症状
  options.value.injuryPart = res.CD_CZRY_SSBW // 受伤部位
  options.value.injuryPartFire = res.HZ_INFO_SSBW // 受伤部位
  options.value.injuryBehavior = res.HZ_INFO_SZ // 受伤时行为
  options.value.injuryCause = res.CD_CZRY_SSYY // 受伤/致伤原因
  options.value.injuryCauseFire = res.HZ_INFO_YY // 受伤/致伤原因
  options.value.injuryReason = res.CD_CZRY_SSYY
  options.value.schooling = res.HZ_INFO_SJY // 受教育程度
  options.value.health = res.HZ_INFO_JKZK // 健康状况
  options.value.job = res.HZ_INFO_ZY // 职业
  options.value.injurySource = res.HZ_INFO_LY // 人员来源
  options.value.idType = res.HZ_SW_ZJLX // 证件类型
  options.value.nation = res.HZ_SW_MZ // 民族
  options.value.economicType = res.HZ_INFO_JJLX // 经济类型
  options.value.leadInspectionOrg = res.HZ_INFO_SGBM // 事故调查牵头部门
  options.value.insuranceInfo = res.HZ_INFO_BXLX // 保险类型
  options.value.fireInspection = res.HZ_INFO_JCQK // 检查监督情况
  options.value.warningType = res.JQ_TYPE // 警情类型
  options.value.naturalDisasterType = res.NATURAL_DISASTER_TYPE // 自然灾害类型
  options.value.warningLevel = res.JQ_LEVEL // 警情等级
  options.value.dealSituation = res.CD_JYQK_CZ // 处置情况
  options.value.fireSituation = res.CD_DC_HZQK
  options.value.returnLateReason = res.CD_BACK // 到场时速异常原因
  options.value.industryDepartment = res.CD_HYZG // 行业主管部门
  options.value.wind = res.TQ_TYPE_FL
  options.value.windDirection = res.TQ_TYPE_FX
  options.value.weather = res.TQ_TYPE_TQ
  options.value.headPersonType = res.USER_JOB
  options.value.fireHydrantSituation = res.CD_JBXX_GG
  options.value.notUseFireHydrantReason = res.CD_JBXX_BSY
  options.value.groupType = res.CD_OTHER_ZY
  options.value.deathDate = res.DEAD_TIME // 死亡时间
  options.value.liveType = res.HZ_INFO_JZXS // 居住形式
  options.value.warningStatus = res.JQ_STATUS
  options.value.fireStatus = res.HZ_STATUS
  options.value.dispatchStatus = res.CD_STATUS
  options.value.rescueRank = res.CD_RANK
  options.value.protectDevice = res.CD_CZRY_FHZB
  options.value.injuryPart = res.CD_CZRY_SSBW
  options.value.period = res.CD_CZRY_SFSD
  options.value.statisticTime = res.STA_TIME
  options.value.teamNature = res.RANK_TYPE
  // options.value.dispatchFireHeadLvl = res.CD_QQHEAD_TYPE
  options.value.truckType = res.CAR_TYPE
  options.value.politicalOutlook = res.CD_LOOK
  options.value.initialFuelsType = res.HZ_QHW_TYPE // 起火物类型
  options.value.igniteSourceType = res.HZ_YHY // 引火源类型
  options.value.humanCause = res.HZ_INFO_RWYS // 人为因素
  options.value.deptNature = res.DEPT_NATURE // 队伍性质
  options.value.duty = res.USER_JOB // 职务
  options.value.buildTag = options.value.buildTag?.map((item) => {
    return {
      ...item,
      label: item.dictName,
      value: item.boDictId,
    }
  })
  const key = 'HZ_QHCS_JGZW,HZ_QHCS_SWSB,HZ_QHCS_LTCS,HZ_QHCS_HWZB,HZ_QHCS_LJFQ'
  const res1 = store.getters?.["dict/filterDicts"](key.split(','), null, false)
  if (res1) {
    options.value.firePlace = []
    key.split(',').forEach((item) => {
      options.value.firePlace.push(...res1[item])
    })
  }
  const sites = 'HZ_QHWZ_CS,HZ_QHWZ_LTCS,HZ_QHWZ_SWSS,HZ_QHWZ_JTGJ'
  const res2 = store.getters?.["dict/filterDicts"](sites.split(','), null, false)
  if (res2) {
    options.value.fireSite = []
    sites.split(',').forEach((item) => {
      options.value.fireSite.push(...res2[item])
    })
  }
  // 获取警情标签
  getFireWarningTag({ tagType: 1 }).then((res) => {
    if (res?.data) {
      options.value.warningTag = res.data
    }
  })
})

const sections = computed(() => {
  const keys = Object.keys(form.value)
  const list = [{
    title: '警情信息',
    link: 'policeMessage',
    display: true,
    children: keys?.filter(val => val.includes('police'))?.map((ele) => {
      return {
        title: form.value[ele].title,
        link: ele,
      }
    }),
  }, {
    title: '出动信息（队站）',
    link: 'dispatchStationMessage',
    display: searchType.value !== 3,
    children: [
      {
        title: '警情信息',
        link: 'dispatchStationPolice',
      },
      ...keys?.filter(val => val.includes('dispatch') && !val.includes('dispatchHeader'))?.map((ele) => {
        return {
          title: form.value[ele].title,
          link: ele,
        }
      })],
  }, {
    title: '出动信息（指挥）',
    link: 'dispatchMessage',
    display: searchType.value !== 2,
    children: [
      {
        title: '警情信息',
        link: 'dispatchHeaderPolice',
      },
      ...keys?.filter(val => val.includes('dispatchHeader'))?.map((ele) => {
        return {
          title: form.value[ele].title,
          link: ele,
        }
      })],
  }, {
    title: '火灾信息',
    link: 'fireMessage',
    display: true,
    children: [
      {
        title: '警情信息',
        link: 'firePolice',
      },
      ...keys?.filter(val => val.includes('fire'))?.map((ele) => {
        return {
          title: form.value[ele].title,
          link: ele,
          children: form.value[ele],
        }
      })],
  }]
  return list.filter(val => val.display)
})

const { sideBarActive } = useIntersection([], '.composite-search-form', 50);

const onSideBarChange = (e, k) => {
  const targetElement = document.getElementById(k);
  if (targetElement) {
    targetElement.scrollIntoView({
      block: 'start',
      // behavior: 'smooth', // 会影响左侧点击
    });
  }
}
</script>

<template>
  <div class="composite-search-wrapper">
    <div class="composite-search-anchor">
        <van-sidebar v-model="sideBarActive">
        <template v-for="(item, k) in sections" :key="k">
          <van-sidebar-item @click="onSideBarChange(item, k)" class="anchor-item">
            <template #title>{{ item?.title }}</template>
          </van-sidebar-item>
          <van-sidebar-item
            v-for="(temp, i) in item.children"
            :key="temp.title"
            @click="onSideBarChange(temp, i)"
            class="anchor-children"
          >
            <template #title>{{ temp?.title }}</template>
          </van-sidebar-item>
        </template>
      </van-sidebar>
    </div>
    <div class="composite-search-form">
      <div v-for="(item, k) in sections" :key="k">
        <div v-for="(temp) in item.children" :key="temp.title">
          {{ temp.title }}
          <div v-for="(i, j) in temp?.children" :key="j">
            <template v-if="(typeof i === 'object')">
              <FormItem :fieldObj="i" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.composite-search-wrapper {
  height: calc(100% - 110px);
  display: flex;
  background-color: #F6F8FC;
  .composite-search-anchor {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    :deep(.van-sidebar) {
      width: 104px;
      .van-sidebar-item {
        background-color: #F6F8FC;
      }
      .van-sidebar-item--select {
        background: #E4E4E4;
        border-radius: 0px 100px 100px 0px;
      }
    }
    .anchor-item {
      font-size: 12px;
      padding: 8px 10px;
      :deep(.van-sidebar-item__text) {
        color: #353A45;
        white-space: nowrap;
      }
    }
    .anchor-children {
      font-size: 12px;
      padding: 8px 10px;
      :deep(.van-sidebar-item__text) {
        color: #565D6F;
      }
    }
  }
  .composite-search-form {
    flex: 1;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
