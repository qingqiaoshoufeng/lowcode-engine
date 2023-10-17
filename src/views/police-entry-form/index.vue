<script setup>
import { ref } from "vue";
import MapLatLng from '@/component/MapLatLng/index'
import AreaCascader from '@/component/AreaCascader/index'
import { useOptions } from '@/hooks/useOptions'
import { useModal } from '@/hooks/useModal'

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => { return {} },
  },
  showPreview: {
    type: Boolean,
    default: false,
  },
  isEdit: { // 警情修改
    type: Boolean,
    default: false,
  },
  isConfirm: { // 警情确认
    type: Boolean,
    default: false,
  },
  isApproval: { // 警情作废申请、警情修改申请
    type: Boolean,
    default: false,
  },
  showExportPdf: { // 显示导出按钮
    type: Boolean,
    default: false,
  },
  refreshCallback: {
    type: Function,
  },
  setHandleOk: {
    type: Function,
  },
  showSteps: {
    type: Boolean,
    default: false,
  },
})

const { show } = useModal()

const { options } = useOptions({ otherCityOptions: [], otherProvinceOptions: [] })

const formRef = ref(null)

const importantEdit = ref(true) // 重要信息更正

const form = ref({
  warningName: '', // 警情标题
  warningDate: null, // 接警时间
  warningCodeYyj: '', // 119警情编号
  warningOrgname: '', // 单位/户主/个体户名称
  warningArea: [], // 行政区划
  warningAreaText: [],
  warningAddr: '', // 警情地址
  warningLng: '', // 经度坐标
  warningLat: '', // 纬度坐标
  warningTel: '', // 报警人联系方式
  warningSource: undefined, // 报警来源
  warningType: [], // 警情类型
  vipSecurity: '2', // 要人安保
  isHappenFire: '2', // 是否发生火灾
  warningTypeText: '',
  warningTypeOther: '', // 其他说明
  warningLevel: undefined, // 警情等级
  typhoonType: undefined, // 台风类型
  isNaturalDisaster: '2', // 是否自然灾害引发
  naturalDisasterType: [], // 自然灾害类型
  naturalDisasterOther: '', // 自然灾害类型其他
  naturalDisasterTypeText: '',
  dispatchGroup: [], // 出动队伍
  mainGroup: undefined, // 主战队站
  firstGroup: undefined, // 首到队站
  isHeadquarters: '2', // 是否全勤指挥部参加
  headquarters: [], // 全勤指挥部
  areaDutyGroup: [], // 责任区大队
  dutyGroup: [], // 辖区队站
  isOtherProvince: '2', // 是否存在跨省增援
  otherProvince: [], // 增援总队
  isOtherCity: '2', // 是否跨市增援
  otherCity: [], // 增援支队
  warningTag: [], // 警情标签
  warningInfo: '', // 警情描述
  warningStatus: '', // 状态
  transferList: [], // 流程流转
})

const onAreaChange = (value, selectedOptions) => {
  if (selectedOptions) {
    form.value.warningAreaText = selectedOptions.map(item => item.areaName)
  }
  else {
    form.value.warningAreaText = ''
  }
}

const lngLatCallback = (lat, lng) => {
  form.value.warningLng = lng
  form.value.warningLat = lat
//   formRef.value.clearValidate(['warningLng', 'warningLat'])
}
</script>

<template>
    <div class="police-entry-form">
      ???
        <!-- <MapLatLng
          :select-area="form.warningAreaText"
          :select-addr="form.warningAddr"
          :select-lat="form.warningLat"
          :select-lng="form.warningLng"
          @finish-callback="lngLatCallback"
        /> -->
        <AreaCascader
          v-model:value="form.warningArea"
          :preview="showPreview"
          width="100%"
          :show-all-area="showPreview"
          @change="onAreaChange"
        />
    </div>
</template>

<style lang="scss" scoped>
.police-entry-form {
    background-color: white;
}
</style>