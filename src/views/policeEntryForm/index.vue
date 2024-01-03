<script setup>
import { ref, onMounted, computed, inject, nextTick ,provide } from "vue";
import dayjs from "dayjs";
import { cloneDeep } from 'lodash-es'
import { showDialog } from 'vant';
import { showToast, showLoadingToast, closeToast } from "vant";
import { useSubmit } from '@castle/castle-use';
import MapLatLng from "@/component/MapLatLng/index";
import AreaCascader from "@/component/AreaCascader/index";
import SelectOrg from "@/component/SelectOrg/index";
import PoliceTags from "@/component/PoliceTags/index";
import ProModal from "@/component/ProModal/index";
import SelectSingle from "@/component/SelectSingle/index";
import SelectMultiple from "@/component/SelectMultiple/index";
import CascaderSingle from "@/component/CascaderSingle/index";
import SelectDateTime from "@/component/SelectDateTime/index";
import ProSteps from "@/component/ProSteps/index.vue";
import PoliceConfirm from "@/views/policeConfirm/police-confirm.vue";
import { v4 as uuidv4 } from 'uuid'
import {
  confirmPolice,
  // deleteFormFieldAnnotation,
  getFieldAnnotationDetail,
  getFireWarningDetail,
  getFireWarningTag,
  getOtherProvince,
  saveFireWarning,
  getHeaderOrg,
  // updateFormFieldAnnotationIds,
} from "@/apis/index.js";
import { generateByKeyValue, getTypeText, scrollFormFailed, interceptUnix } from '@/utils/tools.js'
import { validateLatitude, validateLongitude, validateTelePhone } from '@/utils/validate.js'
import { useOptions } from "@/hooks/useOptions";
import { useModal } from "@/hooks/useModal";
import { useStore } from "vuex";

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
  closeModal: {
    type: Function,
  },
  showSteps: {
    type: Boolean,
    default: false,
  },
  showSurvey: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['finishCallback', 'updateField'])

const { show } = useModal();

const store = useStore();

const minInputTime = store.state.setting.minInputTime

console.log(store,'store');

const { options } = useOptions({
  otherCityOptions: [],
  otherProvinceOptions: [],
});

const fieldExist = ref({})

const formRef = ref(null);

const localFireWarningId = ref(props.currentRow?.boFireWarningId || uuidv4())

provide('localFireWarningId', localFireWarningId)
provide('dataType', 1)

provide('showPreview', ref(props.showPreview))

provide('isDetail',props.showPreview)

const loadDetail = ref(true);

const importantEdit = ref(true); // 重要信息更正

const labelWarningOrgname = ref("单位/户主/个体户/建筑名称");

let warningLevelOptions = []; // 警情等级

const userMessage = ref(null)

const detail = ref(null)

const form = ref({
  warningName: "", // 警情标题
  warningDate: undefined, // 接警时间
  warningCodeYyj: "", // 119警情编号
  warningOrgname: "", // 单位/户主/个体户/建筑名称
  warningArea: "", // 行政区域
  warningAreaText: "",
  warningAddr: "", // 警情地址
  warningLng: "", // 经度坐标
  warningLat: "", // 纬度坐标
  warningTel: "", // 报警人联系方式
  warningSource: undefined, // 报警来源
  warningType: [], // 警情类型
  vipSecurity: "2", // 要人安保
  isHappenFire: "2", // 是否发生火灾
  warningTypeText: "",
  warningTypeOther: "", // 其他说明
  warningLevel: undefined, // 警情等级
  typhoonType: undefined, // 台风类型
  isNaturalDisaster: "2", // 是否自然灾害引发
  naturalDisasterType: [], // 自然灾害类型
  naturalDisasterOther: "", // 自然灾害类型其他
  naturalDisasterTypeText: [],
  dispatchGroup: [], // 出动队伍
  mainGroup: undefined, // 主战队站
  firstGroup: undefined, // 首到队站
  isHeadquarters: "2", // 是否全勤指挥部参加
  headquarters: [], // 全勤指挥部
  areaDutyGroup: [], // 责任区大队
  dutyGroup: [], // 辖区队站
  isOtherProvince: "2", // 是否存在跨省增援
  otherProvince: [], // 增援总队
  isOtherCity: "2", // 是否跨市增援
  otherCity: [], // 增援支队（本省）
  warningTag: [], // 警情标签
  warningInfo: "", // 警情描述
  warningStatus: "", // 状态
  transferList: [], // 流程流转
});

// 警情标题生成功能-带有其他关键字，取上一级
const textFilter = (text, length) => {
  if (text?.[length]?.includes("其他")) {
    return textFilter(text, length - 1);
  }
  return text?.[length] || "";
};

form.value.warningName = computed(() => {
  if (props.showPreview) {
    return detail.value?.warningName;
  }
  const { warningDate, warningOrgname, warningAreaText, warningTypeText, naturalDisasterTypeText } = form.value;
  let result = warningDate
    ? `“${dayjs(warningDate).format("M")}· ${dayjs(warningDate).format("D")}”`
    : "";
  if (warningTypeText?.[0] === "虚假警") {
    if (warningTypeText?.[1] === "虚警（误报）") {
      result += `${userMessage.value?.USERMESSAGE?.orgName}接报一起虚警`;
      result += warningTypeText ? `（${textFilter(warningTypeText, 2)}）` : "";
    } else if (warningTypeText?.[1] === "假警（谎报、恶意报警）") {
      result += `${userMessage.value?.USERMESSAGE?.orgName}接报一起假警`;
      result += warningTypeText
        ? `（${textFilter(warningTypeText, warningTypeText.length - 1)}）`
        : "";
    } else {
      result += `${userMessage.value?.USERMESSAGE?.orgName}接报一起虚假警`;
    }
  } else {
    result += warningAreaText?.length > 0
      ? `${warningAreaText?.[1]}${warningAreaText?.[2]}`
      : "";
  }
  if (warningTypeText?.[0] === "火灾扑救") {
    result += warningTypeText?.[1] === "室外设备设施火灾" ? "一" : "";
    result += warningTypeText
      ? `${textFilter(warningTypeText, 1).replace("火灾", "")}火灾`
      : "";
  }
  if (warningTypeText?.[0] === "抢险救援") {
    result += warningTypeText
      ? `${textFilter(warningTypeText, warningTypeText.length - 1).replace(
        "抢险救援",
        ""
      )}抢险救援`
      : "";
    result += naturalDisasterTypeText
      ? `（${textFilter(
        naturalDisasterTypeText,
        naturalDisasterTypeText.length - 1
      )}）`
      : "";
  }
  if (warningTypeText?.[0] === "社会救助") {
    result += warningAreaText?.length > 0 ? `${`${warningAreaText?.[3]}`}` : "";
    result += warningTypeText
      ? `${textFilter(warningTypeText, warningTypeText.length - 1)}`
      : "";
    result += naturalDisasterTypeText
      ? `（${textFilter(
        naturalDisasterTypeText,
        naturalDisasterTypeText.length - 1
      )}）`
      : "";
  }
  if (warningTypeText?.[0] === "安保勤务") {
    result += warningOrgname ? `${warningOrgname}` : "";
    result += warningTypeText
      ? `${textFilter(warningTypeText, 2) || textFilter(warningTypeText, 1)}`
      : "";
    result += naturalDisasterTypeText
      ? `（${textFilter(
        naturalDisasterTypeText,
        naturalDisasterTypeText.length - 1
      )}）`
      : "";
  }
  return result;
});

const showAddTag = computed(() => {
  return !props.isApproval && props.showPreview;
});

const showWarningLevel = computed(() => {
  const types = form.value.warningTypeText || [];
  return types && (types[0] === "火灾扑救" || types[0] === "抢险救援");
});

const showAreaDutyGroup = computed(() => {
  const types = form.value.warningTypeText || [];
  return types && types[0] === "火灾扑救";
});

const showWarningTypeOther = computed(() => {
  const types = form.value.warningTypeText || [];
  if (types?.length) {
    return types[types.length - 1].includes("其他");
  }
  return false;
});

const showNaturalDisaster = computed(() => {
  const types = form.value.warningTypeText || [];
  return (
    types && ["社会救助", "抢险救援", "安保勤务", "虚假警"].includes(types[0])
  );
});

const showSecurityService = computed(() => {
  const types = form.value.warningTypeText || [];
  return types && types[0] === "安保勤务";
});

const showVipSecurity = computed(() => {
  const types = form.value.warningTypeText || [];
  return types && types[0] === "安保勤务" && types[1] === "日常勤务";
});

const showIsHappenFire = computed(() => {
  const types = form.value.warningTypeText || [];
  return types && types[0] === "抢险救援" && types[1] === "交通事故";
});

// 是否显示增援支队、增援总队
const showCityProvince = computed(() => {
  return props.isCrossRegion || form.value.isOtherCity === '1' || form.value.isOtherProvince === '1'
})

const showNaturalDisasterOther = computed(() => {
  const types = form.value.naturalDisasterTypeText || [];
  return types && types[1] === "其他";
});

const showTyphoonType = computed(() => {
  const types = form.value.naturalDisasterTypeText || [];
  return types && types[1] === "台风";
});

const warningAddrBefore = computed(() => {
  const { warningAreaText } = form.value;
  let result = warningAreaText?.[0];
  if (warningAreaText?.[1]) {
    result += `${warningAreaText?.[1]}`;
  }
  if (warningAreaText?.[2]) {
    result += `${warningAreaText?.[2]}`;
  }
  return result;
});

const minDate = computed(() => {
  if (props.currentRow?.boFireWarningId) { // 编辑不能修改年份
    return new Date(dayjs(detail.value?.warningDate).startOf('year').valueOf())
  }
  return minInputTime
})

const maxDate = computed(() => {
  if (props.currentRow?.boFireWarningId) { // 编辑不能修改年份
    return new Date(dayjs(detail.value?.warningDate).endOf('year').valueOf())
  }
  return new Date()
})

const initLevelOptions = () => {
  const filter = options.value?.warningTypeOptions?.map(
    (item) => item.boDictId === form.value.warningType[0]
  );
  if (filter && filter[0].dictName === "抢险救援") {
    options.value.warningLevelOptions = warningLevelOptions.slice(0, 4);
  } else {
    options.value.warningLevelOptions = warningLevelOptions;
  }
};

const initPermissionOptions = (res) => {
  if (res.otherProvince) {
    const provinces = generateByKeyValue(res.otherProvinceName, res.otherProvince, {
      key: 'name',
      value: 'organizationid',
    }, 'Number')
    options.value.otherProvinceOptions.push(...provinces)
  }
  if (res.otherCity) {
    const citys = generateByKeyValue(res.otherCityName, res.otherCity, {
      key: 'name',
      value: 'organizationid',
    }, 'Number')
    options.value.otherCityOptions.push(...citys)
  }
}

const warningTypeChange = (value, selectedOptions) => {
  form.value.warningLevel = undefined;
  form.value.typhoonType = undefined;
  form.value.warningTypeOther = "";
  if (selectedOptions) {
    form.value.warningTypeText =
      selectedOptions.map((item) => item.dictName) || [];
    if (selectedOptions && selectedOptions[0].dictName === "抢险救援") {
      options.value.warningLevelOptions = warningLevelOptions.slice(0, 4);
    } else {
      options.value.warningLevelOptions = warningLevelOptions;
    }
    if (selectedOptions && selectedOptions[0].dictName === "安保勤务") {
      labelWarningOrgname.value = "活动/任务名称";
      formRef.value.resetValidation(['warningOrgname'])
    } else {
      labelWarningOrgname.value = "单位/户主/个体户/建筑名称";
      formRef.value.resetValidation(['warningOrgname'])
    }
  } else {
    form.value.warningTypeText = [];
    form.value.areaDutyGroup = [];
    form.value.warningSource = undefined
    labelWarningOrgname.value = "单位/户主/个体户/建筑名称";
    formRef.value.resetValidation(['warningOrgname'])
    // deleteField(['warningTypeOther', 'warningLevel', 'typhoonType', 'areaDutyGroup'])
  }
};

const handleMain = () => {
  if (!form.value.dispatchGroup || form.value.dispatchGroup.length <= 0) {
    showToast('请先选择出动队伍')
    return true
  }
  return false
}

const onChangeDispatchGroup = (values, items, texts) => {
  form.value.dispatchGroup = items
  if (!items || items.length <= 0) {
    form.value.mainGroup = ''
    form.value.firstGroup =  ''
  }

  formRef.value.resetValidation(['dispatchGroup', 'mainGroup', 'firstGroup'])
}

const refreshField = () => {
  if (props.currentRow?.boFireWarningId || localFireWarningId.value) {
    getFieldAnnotationDetail({
      dataId: props.currentRow?.boFireWarningId || localFireWarningId.value,
      dataType: 1,
    }).then((res) => {
      fieldExist.value = res?.data
      if (res?.fieldModules?.policeWarning) {
        emits('updateField', true)
      }
      else {
        emits('updateField', false)
      }
    })
  }
}

const { loading, submit } = useSubmit((res) => {
  if (props.isConfirm) {
    showToast('警情确认成功')
    emits('finishCallback')
  }
  if (res.boFireWarningId) {
    // updateFormFieldAnnotationIds({ newId: res.boFireWarningId, oldId: localFireWarningId.value })
  }
  if (props.currentRow?.boFireWarningId) {
    emits('finishCallback')
  }
  else {
    showToast('发送成功！')
    emits('finishCallback')
  }
}, {
  submitFn: () => {
    const { boWarningYyjId } = props.currentRow
    const values = form.value
    const params = {
      ...values,
      new: !values.boFireWarningId,
      warningDate: interceptUnix(values.warningDate),
      warningArea: cloneDeep(values.warningArea)?.pop(), // 取最后一级
      warningAddr: warningAddrBefore.value + values.warningAddr,
      warningLnglat: `${values.warningLng},${values.warningLat}`,
      warningType: cloneDeep(values.warningType)?.pop(),
      dispatchGroup: values.dispatchGroup.map(item => item.organizationid).join(','),
      areaDutyGroup: values.areaDutyGroup.map(item => item.organizationid).join(','), // 取最后一级
      dutyGroup: values.dutyGroup ? values.dutyGroup.map(item => item.organizationid).join(',') : '',
      naturalDisasterType: values.naturalDisasterType ? cloneDeep(values.naturalDisasterType).pop() : '',
      headquarters: values.headquarters?.length > 0 ? values.headquarters.map(item => item.organizationid).join(',') : '',
      otherProvince: values.otherProvince?.length > 0 ? values.otherProvince.map(item => (item.organizationid || item.value)).join(',') : '',
      otherProvinceName: values.otherProvince?.length > 0 ? values.otherProvince.map(item => (item.name || item.label)).join(',') : '',
      otherCity: values.otherCity?.length > 0 ? values.otherCity.map(item => (item.organizationid || item.value)).join(',') : '',
      otherCityName: values.otherCity?.length > 0 ? values.otherCity.map(item => (item.name || item.label)).join(',') : '',
      warningTag: values.warningTag ? values.warningTag.map(item => (item.boFireTagId || item.value)).join(',') : '',
      warningTagName: values.warningTag ? values.warningTag.map(item => (item.tagName || item.label)).join(',') : '',
      warningExt1: values.warningTypeOther, // 警情类型其他
      warningExt2: values.naturalDisasterOther, // 自然灾害类型其他
      warningStatus: form.value.warningStatus ? form.value.warningStatus : undefined,
    }
    if (boWarningYyjId) {
      params.boWarningYyjId = boWarningYyjId
    }
    params.isOtherCity = params.otherCity?.length > 0 ? '1' : '2'
    params.isOtherProvince = params.otherProvince?.length > 0 ? '1' : '2'
    params.isHeadquarters = params.headquarters?.length > 0 ? '1' : '2'
    params.confirmFlag = props.isConfirm ? '1' : '2'
    return saveFireWarning(params)
  },
})

const initDetail = () => {
  // 警情详情
  const { boFireWarningId, boWarningYyjId, showPreview } = props.currentRow
  if (boWarningYyjId) {
    form.value.warningCodeYyj = props.currentRow.warningCodeYyj
    form.value.warningDate = dayjs(props.currentRow.warningCodeYyj)
    form.value.warningType = props.currentRow.warningType?.split(',')
    form.value.warningTypeText = props.currentRow.warningTypeValue?.split('/')
    form.value.warningArea = props.currentRow.warningArea?.split(',')
    form.value.warningAreaText = props.currentRow.warningAreaValue?.split(',')
    form.value.warningAddr = props.currentRow.warningAddr
    form.value.warningTel = props.currentRow.warningTel
    form.value.warningInfo = props.currentRow.warningInfo
    nextTick(() => {
      loadDetail.value = false
      initLevelOptions()
    })
    closeToast()
  }
  else if (boFireWarningId) {
    getFireWarningDetail(boFireWarningId).then((res) => {
      if (res) {
        detail.value = res
        form.value.warningSurvey = res.warningSurvey
        form.value.boFireWarningId = res.boFireWarningId
        form.value.warningDate = dayjs(res.warningDate)
        form.value.warningCodeYyj = res.warningCodeYyj
        form.value.warningOrgname = res.warningOrgname
        if (res.warningStreet) {
          form.value.warningArea = [res.warningProvince, res.warningCity, res.warningTown, res.warningStreet]
          form.value.warningAreaText = [res.warningProvinceValue, res.warningCityValue, res.warningTownValue, res.warningStreetValue]
        }
        else {
          form.value.warningArea = [res.warningProvince, res.warningCity, res.warningTown]
          form.value.warningAreaText = [res.warningProvinceValue, res.warningCityValue, res.warningTownValue]
        }
        if (!showPreview && form.value.warningAreaText?.length >= 3) {
          const attr = [res.warningProvinceValue, res.warningCityValue, res.warningTownValue].join('')
          form.value.warningAddr = res.warningAddr?.replace(attr, '')
        }
        else if (!showPreview && form.value.warningAreaText?.length === 2) {
          const attr = [res.warningProvinceValue, res.warningCityValue].join('')
          form.value.warningAddr = res.warningAddr?.replace(attr, '')
        }
        else {
          form.value.warningAddr = res.warningAddr
        }
        form.value.warningLng = res.warningLnglat?.split(',')?.[0]
        form.value.warningLat = res.warningLnglat?.split(',')?.[1]
        form.value.warningTel = res.warningTel
        form.value.warningSource = res.warningSource
        form.value.warningType = res.warningType?.split(',')
        if (form.value.warningType) {
          form.value.warningTypeText = getTypeText(form.value.warningType, options.value.warningTypeOptions)
        }
        form.value.vipSecurity = res.vipSecurity
        form.value.isHappenFire = res.isHappenFire
        form.value.warningTypeOther = res.warningExt1
        form.value.isNaturalDisaster = res.isNaturalDisaster
        form.value.naturalDisasterType = res.naturalDisasterType?.split(',')
        if (form.value.naturalDisasterType) {
          form.value.naturalDisasterTypeText = getTypeText(form.value.naturalDisasterType, options.value.naturalDisasterOptions)
        }
        form.value.naturalDisasterOther = res.warningExt2
        form.value.warningLevel = res.warningLevel
        form.value.typhoonType = res.typhoonType
        form.value.dispatchGroup = res.dispatchGroup
          ? generateByKeyValue(res.dispatchGroupName, res.dispatchGroup, {
            key: 'name',
            value: 'organizationid',
          }, 'Number')
          : []
        form.value.firstGroup = res.firstGroup ? Number(res.firstGroup) : undefined // TODO ?
        form.value.mainGroup = res.mainGroup ? Number(res.mainGroup) : undefined // TODO ?
        form.value.dutyGroup = res.dutyGroup
          ? generateByKeyValue(res.dutyGroupName, res.dutyGroup, {
            key: 'name',
            value: 'organizationid',
          }, 'Number')
          : []
        form.value.areaDutyGroup = res.areaDutyGroup
          ? generateByKeyValue(res.areaDutyGroupName, res.areaDutyGroup, {
            key: 'name',
            value: 'organizationid',
          }, 'Number')
          : []
        form.value.isHeadquarters = res.isHeadquarters
        form.value.headquarters = res.headquarters
          ? generateByKeyValue(res.headquartersName, res.headquarters, {
            key: 'name',
            value: 'organizationid',
          }, 'Number')
          : []
        form.value.isOtherProvince = res.isOtherProvince
        form.value.otherProvince = res.otherProvince
          ? generateByKeyValue(res.otherProvinceName, res.otherProvince, {
            key: 'name',
            value: 'organizationid',
          }, 'Number')
          : []
        form.value.isOtherCity = res.isOtherCity
        form.value.otherCity = res.otherCity
          ? generateByKeyValue(res.otherCityName, res.otherCity, {
            key: 'name',
            value: 'organizationid',
          }, 'Number')
          : []
        form.value.warningTag = res.warningTag
          ? generateByKeyValue(res.warningTagValue, res.warningTag, {
            key: 'tagName',
            value: 'boFireTagId',
          })
          : []
        form.value.warningInfo = res.warningInfo
        form.value.warningStatus = res.warningStatus
        form.value.transferList = res.transferList
        form.value.dispatchGroup?.forEach((item) => {
          if (item.organizationid === form.value.dutyGroup?.[0]?.organizationid) {
            item.duty = true
          }
          else {
            item.duty = false
          }
        })
        // 警情等级
        initLevelOptions()
        // 详情特殊处理options
        if (showPreview) {
          initPermissionOptions(res)
        }

        importantEdit.value = res.importantInfoRecheck
      }

      // refreshField()
    }).finally(() => {
      loadDetail.value = false
      closeToast()
    })
  } else {
    loadDetail.value = false
    closeToast()
  }
}

const handleSubmit = () => {
  formRef.value.submit()
}

const onSubmit = () => {
  if ((props.isEdit || props.isConfirm) && (detail.value?.isOtherProvince === '1' && form.value.otherProvince?.length <= 0)) { // 修改跨省警情
    showToast('跨省警情必须录入【增援总队】，有误可申请作废后重新创建警情！')
  }
  else if ((props.isEdit || props.isConfirm) && (detail.value?.isOtherProvince !== '1' && form.value.otherProvince?.length > 0)) { // 修改跨市警情、普通警情
    showToast('跨市警情、普通警情不允许修改【增援总队】，有误可申请作废后重新创建警情！')
  }
  else if (props.isConfirm) { // 警情确认
    show.value.confirmVisible = true
  }
  else {
    submit()
  }
}

const onFailed = (errorInfo) => {
  if (errorInfo?.errors?.length > 0) {
    showToast('信息填写不完整，请检查填写内容！')
    scrollFormFailed()
  }
};

onMounted(() => {
  showLoadingToast()
  const res = store.getters?.["dict/filterDicts"](["JQ_TYPE", "NATURAL_DISASTER_TYPE", "JQ_LEVEL", "JQ_LY", "TP_TYPE"], null, props.showPreview);
  options.value.warningTypeOptions = res.JQ_TYPE;
  options.value.naturalDisasterOptions = res.NATURAL_DISASTER_TYPE;
  warningLevelOptions = res.JQ_LEVEL;
  options.value.warningSource = res.JQ_LY;
  options.value.typhoonType = res.TP_TYPE;
  // 获取全勤指挥部
  getHeaderOrg().then((res) => {
    if (res) {
      options.value.headquarters = res
    }
  })
  // 获取增援总队
  getOtherProvince({ deptType: 1, deptLevel: 2 }).then((res) => {
    if (res.items) {
      options.value.otherProvinceOptions.push(...res.items);
    }
  });
  // 获取增援支队（本省）
  getOtherProvince({ deptType: 1, deptLevel: 3 }).then((res) => {
    if (res.items) {
      options.value.otherCityOptions.push(...res.items);
    }
  });
  // 获取警情标签
  getFireWarningTag({ tagType: 1 }).then((res) => {
    options.value.warningTagOptions = res.data;

    initDetail()
  });
  // 获取用户单位
  if (store.getters?.["userInfo/userInfo"]) {
    userMessage.value = store.getters?.["userInfo/userInfo"]
  }
});

const confirmCallback = async (params) => {
  show.value.confirmVisible = false
  confirmPolice(params).then(async (res) => {
    submit()
  })
}

const handleLngLat = () => {
  if (props.isConfirm) {
    return
  }
  if (!form.value.warningArea) {
    showToast("请先选择行政区域");
    return;
  }
  if (!form.value.warningAddr) {
    showToast("请先输入警情地址");
    return;
  }
  show.value.lngLatVisible = true;
};

const onAreaChange = (value, selectedOptions) => {
  if (selectedOptions) {
    form.value.warningAreaText = selectedOptions.map((item) => item.areaName);
  } else {
    form.value.warningAreaText = "";
  }
};

const lngLatCallback = (lat, lng) => {
  form.value.warningLng = lng;
  form.value.warningLat = lat;
  formRef.value.resetValidation(['warningLng', 'warningLat'])
};

const validateFireTel = (value, rule) => {
  const { warningSource } = form.value;
  const filter = options.value.warningSource?.filter(
    (item) => item.boDictId === warningSource
  );
  if (!value) {
    return '';
  } else if (filter?.[0]?.dictName === "电话报警" && !validateTelePhone(value)) {
    return "请输入正确格式，注意：固定电话请在区号后加“-”隔开";
  } else {
    return '';
  }
};

const validateLng = (value, rule) => {
  if (!value) {
    return "请输入经度坐标";
  } else if (!validateLongitude(value)) {
    return "请输入正确经度坐标";
  } else {
    return ''
  }
};

const validateLat = (value, rule) => {
  if (!value) {
    return "请输入纬度坐标";
  } else if (!validateLatitude(value)) {
    return "请输入正确纬度坐标";
  } else {
    return ''
  }
};

const validateWarningAddr = (value, rule) => {
  if (!value) {
    return "请补充详情地址";
  } else {
    return '';
  }
};

const validateOtherCity = (value, rule) => {
  return "";
};

const validateOtherProvince = (value, rule) => {
  return "";
};

const validateHeadquarters = (value, rule) => {
  return "";
};

const onWarningOrgname = () => {
  showDialog({ message: `如果该警情无主，请输入“无明确产权”` });
}
</script>

<template>
  <div class="police-entry-form">
    <van-form ref="formRef" @failed="onFailed" @submit="onSubmit">
      <van-field
        v-if="showSurvey"
        v-model="form.warningSurvey"
        v-preview-text="true"
        :readonly="true"
        required
        name="warningSurvey"
        rows="4"
        autosize
        label="警情概况："
        type="textarea"
        placeholder="请输入警情概况"
        show-word-limit
        :class="{ 'form-textarea': !showPreview }"
      >
    </van-field>
      <van-field
        v-model="form.warningName"
        v-preview-text="showPreview"
        :readonly="showPreview"
        :disabled="!showPreview"
        required
        name="warningName"
        label="警情标题："
        placeholder="请输入警情标题"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="警情标题："
            :id="currentRow?.boFireWarningId"
            remark-field="warningName"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningName"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <SelectDateTime
        v-model:value="form.warningDate"
        :showPreview="showPreview"
        is-link
        required
        name="warningDate"
        title="请选择接警时间"
        label="接警时间："
        placeholder="请选择接警时间"
        :minDate="minDate"
        :maxDate="maxDate"
        :disabled="isConfirm"
        :rules="[{ required: true, message: '请选择接警时间' }]"
      > 
        <template v-slot:label="">
          <FieldAnnotation
            label="接警时间："
            :id="currentRow?.boFireWarningId"
            remark-field="warningDate"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningDate"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectDateTime>
      <AreaCascader
        v-if="!loadDetail"
        name="warningArea"
        v-model:value="form.warningArea"
        label="行政区域："
        :showPreview="showPreview"
        :preview-text="form.warningAreaText?.length > 0 ? form.warningAreaText?.join('/') : form.warningAreaText"
        :show-all-area="showPreview"
        :required="true"
        :rules="[{ required: true, message: '请选择行政区域' }]"
        :disabled="isConfirm"
        @change="onAreaChange"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="行政区域："
            :id="currentRow?.boFireWarningId"
            remark-field="warningArea"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningArea"
            @refresh-callback="refreshField"
          />
        </template>
      </AreaCascader>
      <van-field
        v-model="form.warningAddr"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        maxlength="50"
        name="warningAddr"
        label="警情地址："
        placeholder="请输入警情地址"
        :disabled="isConfirm"
        :rules="[{ validator: validateWarningAddr, trigger: 'onBlur' }]"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="警情地址："
            :id="currentRow?.boFireWarningId"
            remark-field="warningAddr"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningAddr"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-model="form.warningLng"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        name="warningLng"
        center
        required
        clearable
        maxlength="20"
        label="经度坐标："
        placeholder="请输入经度坐标"
        :rules="[
          { required: true, message: '请输入经度坐标' },
          { validator: validateLng, trigger: 'onBlur' },
        ]"
        :disabled="isConfirm"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="经度坐标："
            :id="currentRow?.boFireWarningId"
            remark-field="warningLng"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningLng"
            @refresh-callback="refreshField"
          />
        </template>
        <template v-if="!isConfirm" #button>
          <van-button size="small" type="primary" @click="handleLngLat"
            >自动获取</van-button
          >
        </template>
      </van-field>
      <van-field
        v-model="form.warningLat"
        v-preview-text="showPreview"
        :readonly="showPreview"
        type="number"
        name="warningLat"
        center
        required
        clearable
        maxlength="20"
        label="纬度坐标："
        placeholder="请输入纬度坐标"
        :rules="[
          { required: true, message: '请输入纬度坐标' },
          { validator: validateLat, trigger: 'onBlur' },
        ]"
        :disabled="isConfirm"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="纬度坐标："
            :id="currentRow?.boFireWarningId"
            remark-field="warningType"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningType"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <CascaderSingle
        v-model:value="form.warningType"
        v-model:text="form.warningTypeText"
        :showPreview="showPreview"
        :readonly="true"
        name="warningType"
        :options="options.warningTypeOptions"
        :required="true"
        :field-names="{ value: 'boDictId', text: 'dictName' }"
        :disabled="showPreview ? false : !importantEdit"
        label="警情类型："
        placeholder="请选择警情类型"
        :rules="[{ required: true, message: '请选择警情类型' }]"
        @change="warningTypeChange"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="警情类型："
            :id="currentRow?.boFireWarningId"
            remark-field="warningType"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningType"
            @refresh-callback="refreshField"
          />
        </template>
      </CascaderSingle>
      <van-field
        v-if="showVipSecurity"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        name="switch"
        label="要人安保："
        label-width="100px"
        class="switch-wrapper"
        :disabled="isConfirm"
      >
        <template #input>
          <van-switch
            v-model="form.vipSecurity"
            size="20"
            active-value="1"
            inactive-value="2"
          />
        </template>
        <template v-slot:label="">
          <FieldAnnotation
            label="要人安保："
            :id="currentRow?.boFireWarningId"
            remark-field="vipSecurity"
            field-module="policeWarning"
            :exist-data="fieldExist?.vipSecurity"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-if="showIsHappenFire"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        name="switch"
        label="是否发生火灾："
        label-width="120px"
        class="switch-wrapper"
        :disabled="isConfirm"
      >
        <template #input>
          <van-switch
            v-model="form.isHappenFire"
            size="20"
            active-value="1"
            inactive-value="2"
          />
        </template>
        <template v-slot:label="">
          <FieldAnnotation
            label="是否发生火灾："
            :id="currentRow?.boFireWarningId"
            remark-field="isHappenFire"
            field-module="policeWarning"
            :exist-data="fieldExist?.isHappenFire"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-if="showWarningTypeOther || form.warningTypeOther"
        v-model="form.warningTypeOther"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        maxlength="50"
        name="warningTypeOther"
        label="其他说明："
        placeholder="请输入其他说明"
        :disabled="isConfirm"
        :rules="[{ required: true, message: '请输入其他说明' }]"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="其他说明："
            :id="currentRow?.boFireWarningId"
            remark-field="warningTypeOther"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningTypeOther"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <SelectSingle
        v-if="showWarningLevel || form.warningLevel"
        v-model:value="form.warningLevel"
        :showPreview="showPreview"
        name="warningLevel"
        required
        :options="options.warningLevelOptions"
        :field-names="{ value: 'boDictId', label: 'dictName' }"
        title="请选择警情等级"
        label="警情等级："
        placeholder="请选择警情等级"
        :disabled="isConfirm"
        :rules="[{ required: true, message: '请选择警情等级' }]"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="警情等级："
            :id="currentRow?.boFireWarningId"
            remark-field="warningLevel"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningLevel"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectSingle>
      <van-field
        v-model="form.warningOrgname"
        v-preview-text="showPreview"
        :readonly="showPreview"
        maxlength="50"
        required
        name="warningOrgname"
        label-width="204px"
        :label="`${labelWarningOrgname}：`"
        :placeholder="`请输入${labelWarningOrgname}`"
        :rules="[{ required: true, message: `请输入${labelWarningOrgname}` }]"
        :disabled="isConfirm"
        right-icon="question-o"
        @click-right-icon.stop="onWarningOrgname"
      >
        <template v-slot:label="">
          <FieldAnnotation
            :label="`${labelWarningOrgname}：`"
            :id="currentRow?.boFireWarningId"
            remark-field="warningOrgname"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningOrgname"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <SelectSingle
        v-if="!showSecurityService"
        v-model:value="form.warningSource"
        :showPreview="showPreview"
        name="warningSource"
        required
        :options="options.warningSource"
        :field-names="{ value: 'boDictId', label: 'dictName' }"
        label="报警来源："
        placeholder="请选择报警来源"
        title="请选择报警来源"
        :disabled="isConfirm"
        :rules="[{ required: true, message: '请选择报警来源' }]"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="报警来源："
            :id="currentRow?.boFireWarningId"
            remark-field="warningSource"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningSource"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectSingle>
      <van-field
        v-if="!showSecurityService"
        v-model="form.warningTel"
        v-preview-text="showPreview"
        :readonly="showPreview"
        name="warningTel"
        label="报警人联系方式："
        placeholder="请输入报警人联系方式"
        maxlength="13"
        :required="false"
        :disabled="isConfirm"
        :rules="[{ validator: validateFireTel, trigger: 'onBlur' }, { required: false, message: '' }]"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="联系方式："
            :id="currentRow?.boFireWarningId"
            remark-field="warningTel"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningTel"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-if="showNaturalDisaster || form.isNaturalDisaster"
        :readonly="showPreview"
        required
        name="isNaturalDisaster"
        label="是否自然灾害引发："
        label-width="150px"
        class="switch-wrapper"
        :disabled="isConfirm"
      >
        <template #input>
          <template v-if="showPreview">
            <div style="width: 100%;text-align: left;">{{ form.isNaturalDisaster === '1' ? '是' : '否'}}</div>
          </template>
          <template v-else>
            <van-switch
              v-model="form.isNaturalDisaster"
              size="20"
              active-value="1"
              inactive-value="2"
              :disabled="isConfirm"
            />
          </template>
        </template>
        <template v-slot:label="">
          <FieldAnnotation
            label="是否自然灾害引发："
            :id="currentRow?.boFireWarningId"
            remark-field="isNaturalDisaster"
            field-module="policeWarning"
            :exist-data="fieldExist?.isNaturalDisaster"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <CascaderSingle
        v-if="form.isNaturalDisaster === '1'"
        v-model:value="form.naturalDisasterType"
        v-model:text="form.naturalDisasterTypeText"
        :showPreview="showPreview"
        :readonly="true"
        name="naturalDisasterType"
        :options="options.naturalDisasterOptions"
        :required="true"
        :field-names="{ value: 'boDictId', text: 'dictName' }"
        label="自然灾害类型："
        label-width="118px"
        placeholder="请选择自然灾害类型"
        :disabled="isConfirm"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="自然灾害类型："
            :id="currentRow?.boFireWarningId"
            remark-field="isNaturalDisaster"
            field-module="policeWarning"
            :exist-data="fieldExist?.isNaturalDisaster"
            @refresh-callback="refreshField"
          />
        </template>
      </CascaderSingle>
      <van-field
        v-if="showNaturalDisasterOther || form.naturalDisasterOther"
        v-model="form.naturalDisasterOther"
        v-preview-text="showPreview"
        :readonly="showPreview"
        required
        :maxlength="100"
        name="naturalDisasterOther"
        label="其他说明："
        placeholder="请输入其他说明"
        :disabled="isConfirm"
        :rules="[{ required: true, message: '请输入其他说明' }]"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="其他说明："
            :id="currentRow?.boFireWarningId"
            remark-field="naturalDisasterOther"
            field-module="policeWarning"
            :exist-data="fieldExist?.naturalDisasterOther"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <SelectSingle
        v-if="showTyphoonType"
        v-model:value="form.typhoonType"
        :showPreview="showPreview"
        name="typhoonType"
        :options="options.typhoonType"
        :field-names="{ value: 'boDictId', label: 'dictName' }"
        label="台风编号："
        placeholder="请选择台风编号"
        :disabled="isConfirm"
        :rules="[{ required: true, message: '请选择台风编号' }]"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="台风编号："
            :id="currentRow?.boFireWarningId"
            remark-field="typhoonType"
            field-module="policeWarning"
            :exist-data="fieldExist?.typhoonType"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectSingle>
      <van-field
        v-model="form.warningCodeYyj"
        v-preview-text="showPreview"
        :readonly="showPreview"
        name="warningCodeYyj"
        label="119警情编号："
        label-width="112px"
        placeholder="请输入119警情编号"
        maxlength="50"
        :required="false"
        :rules="[
          { pattern: /^[A-Za-z0-9]*$/, message: '请输入正确119警情编号' },
        ]"
        :disabled="isConfirm"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="119警情编号："
            :id="currentRow?.boFireWarningId"
            remark-field="warningCodeYyj"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningCodeYyj"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <SelectMultiple
        :value="form.warningTag?.map(item => item.boFireTagId) || []"
        v-model:nodes="form.warningTag"
        :showPreview="showPreview"
        name="warningTag"
        :options="options.warningTagOptions"
        :field-names="{ value: 'boFireTagId', label: 'tagName' }"
        :rules="[{ required: false, message: '请选择警情标签' }]"
        :required="false"
        label="警情标签："
        placeholder="请选择警情标签"
        title="请选择警情标签"
        :disabled="isConfirm"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="警情标签："
            :id="currentRow?.boFireWarningId"
            remark-field="warningCodeYyj"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningCodeYyj"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectMultiple>
      <SelectOrg
        v-model:value="form.dispatchGroup"
        :showPreview="showPreview"
        :readonly="showPreview"
        name="dispatchGroup"
        :field-names="{ value: 'organizationid', label: 'name' }"
        :required="true"
        label="出动队伍："
        placeholder="请选择出动队伍"
        title="请选择出动队伍"
        :rules="[{ required: true, message: '请选择出动队伍' }]"
        :params="{ deptType: 1 }"
        :disabled="isConfirm"
        @change="onChangeDispatchGroup"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="出动队伍："
            :id="currentRow?.boFireWarningId"
            remark-field="dispatchGroup"
            field-module="policeWarning"
            :exist-data="fieldExist?.dispatchGroup"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectOrg>
      <SelectOrg
        v-model:value="form.dutyGroup"
        :showPreview="showPreview"
        :readonly="true"
        name="dutyGroup"
        :field-names="{ value: 'organizationid', label: 'name' }"
        :required="true"
        label="辖区队站："
        placeholder="请选择辖区队站"
        title="请选择辖区队站"
        :single="true"
        :rules="[{ required: true, message: '请选择辖区队站' }]"
        :params="{ deptType: 1 }"
        :disabled="isConfirm"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="辖区队站："
            :id="currentRow?.boFireWarningId"
            remark-field="dutyGroup"
            field-module="policeWarning"
            :exist-data="fieldExist?.dutyGroup"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectOrg>
      <SelectSingle
        v-model:value="form.firstGroup"
        :showPreview="showPreview"
        name="firstGroup"
        :options="form.dispatchGroup"
        :field-names="{ value: 'organizationid', label: 'name' }"
        :required="true"
        label="首到队站："
        title="请选择首到队站"
        placeholder="请选择首到队站"
        :rules="[{ required: true, message: '请选择首到队站' }]"
        :checkShowFn="handleMain"
        :disabled="isConfirm"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="首到队站："
            :id="currentRow?.boFireWarningId"
            remark-field="firstGroup"
            field-module="policeWarning"
            :exist-data="fieldExist?.firstGroup"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectSingle>
      <SelectSingle
        v-model:value="form.mainGroup"
        :showPreview="showPreview"
        name="mainGroup"
        :options="form.dispatchGroup"
        :field-names="{ value: 'organizationid', label: 'name' }"
        :required="true"
        label="主战队站："
        title="请选择主战队站"
        placeholder="请选择主战队站"
        :rules="[{ required: true, message: '请选择主战队站' }]"
        :checkShowFn="handleMain"
        :disabled="isConfirm"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="主战队站："
            :id="currentRow?.boFireWarningId"
            remark-field="mainGroup"
            field-module="policeWarning"
            :exist-data="fieldExist?.mainGroup"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectSingle>
      <SelectOrg
        v-if="showAreaDutyGroup"
        v-model:value="form.areaDutyGroup"
        :showPreview="showPreview"
        :readonly="true"
        name="areaDutyGroup"
        :field-names="{ value: 'organizationid', label: 'name' }"
        :required="true"
        label="责任区大队："
        label-width="102px"
        placeholder="请选择责任区大队"
        title="请选择责任区大队"
        :single="true"
        :rules="[{ required: true, message: '请选择责任区大队' }]"
        :params="{ deptType: 1, deptLevel: 4 }"
        :disabled="isConfirm"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="责任区大队："
            :id="currentRow?.boFireWarningId"
            remark-field="areaDutyGroup"
            field-module="policeWarning"
            :exist-data="fieldExist?.areaDutyGroup"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectOrg>
      <SelectMultiple
        v-model:value="form.headquarters"
        :showPreview="showPreview"
        name="headquarters"
        :options="options.headquarters"
        :field-names="{ value: 'organizationid', label: 'name' }"
        label="全勤指挥部："
        placeholder="未出动"
        title="请选择全勤指挥部"
        :rules="[{ required: false, validator: validateHeadquarters, message: '请选择全勤指挥部'}]"
        class="special-place"
        :class="{'special-header-data': showPreview && form.headquarters?.length <= 0}"
        :disabled="isConfirm"
        :required="true"
        label-width="105"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="全勤指挥部："
            :id="currentRow?.boFireWarningId"
            remark-field="areaDutyGroup"
            field-module="policeWarning"
            :exist-data="fieldExist?.areaDutyGroup"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectMultiple>
      <SelectMultiple
        v-if="showCityProvince && !userMessage?.ISMUNICIPALORG"
        :value="form.otherCity?.map(item => item.organizationid) || []"
        v-model:nodes="form.otherCity"
        :showPreview="showPreview"
        name="otherCity"
        :options="options.otherCityOptions"
        :field-names="{ value: 'organizationid', label: 'name' }"
        :rules="[{ required: false, validator: validateOtherCity, message: '请选择增援支队（本省）'}]"
        :required="true"
        label="增援支队（本省）："
        label-width="142px"
        placeholder="无"
        title="请选择增援支队（本省）"
        class="special-place"
        :class="{'special-no-data': showPreview && form.otherCity?.length <= 0}"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="增援支队（本省）："
            :id="currentRow?.boFireWarningId"
            remark-field="otherCity"
            field-module="policeWarning"
            :exist-data="fieldExist?.otherCity"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectMultiple>
      <SelectMultiple
        v-if="showCityProvince"
        :value="form.otherProvince?.map(item => item.organizationid) || []"
        v-model:nodes="form.otherProvince"
        :showPreview="showPreview"
        name="otherProvince"
        :options="options.otherProvinceOptions"
        :field-names="{ value: 'organizationid', label: 'name' }"
        :rules="[{ required: false, validator: validateOtherProvince, message: '请选择增援总队'}]"
        :required="true"
        label="增援总队："
        placeholder="无"
        title="请选择增援总队"
        class="special-place"
        :class="{'special-no-data': showPreview && form.otherProvince?.length <= 0}"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="增援总队："
            :id="currentRow?.boFireWarningId"
            remark-field="otherProvince"
            field-module="policeWarning"
            :exist-data="fieldExist?.otherProvince"
            @refresh-callback="refreshField"
          />
        </template>
      </SelectMultiple>
      <van-field
        v-model="form.warningInfo"
        v-preview-text="showPreview"
        :readonly="showPreview"
        :required="true"
        name="warningInfo"
        rows="4"
        autosize
        label="警情描述："
        type="textarea"
        maxlength="300"
        placeholder="请输入警情描述"
        show-word-limit
        :rules="[{ required: true, message: '请输入警情描述'}]"
        :class="{'form-textarea': !showPreview}"
        :disabled="isConfirm"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="警情描述："
            :id="currentRow?.boFireWarningId"
            remark-field="warningInfo"
            field-module="policeWarning"
            :exist-data="fieldExist?.warningInfo"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
    </van-form>

    <!-- 操作记录 -->
    <ProSteps
      v-if="showSteps"
      class="steps-box"
      :data="form?.transferList"
      :detail="detail"
    />

    <div class="form-footer" v-if="!showPreview && !isConfirm">
      <van-button round block type="primary" size="large" :loading="loading" @click="handleSubmit">
        派发
      </van-button>
    </div>
    <div class="form-footer" v-if="!showPreview && isConfirm">
      <van-button round block type="primary" size="large" :loading="loading" @click="handleSubmit">
        跨省警情确认
      </van-button>
    </div>

    <ProModal v-model:visible="show.lngLatVisible" title="选择地图">
      <template #default="{ setHandleOk }">
        <MapLatLng
          :select-area="form.warningAreaText"
          :select-addr="form.warningAddr"
          :select-lat="form.warningLat"
          :select-lng="form.warningLng"
          :set-handle-ok="setHandleOk"
          @finish-callback="lngLatCallback"
        />
      </template>
    </ProModal>
    <!-- 警情确认说明 -->
    <ProModal v-model:visible="show.confirmVisible" title="警情确认说明">
      <template #default="{ setHandleOk }">
        <PoliceConfirm
          :current-row="currentRow"
          :set-handle-ok="setHandleOk"
          @finish-callback="confirmCallback"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.police-entry-form {
  height: 100%;
  overflow-y: auto;
  background-color: white;
  .police-entry-title {
    display: flex;
    flex-direction: column;
    padding: 10px 0 10px 16px;
    .title-header {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #0e203c;
      line-height: 22px;
    }
    .title-real {
      font-size: 14px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #0e203c;
      line-height: 20px;
    }
    .title-placeholder {
      font-size: 14px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #9398a7;
      line-height: 20px;
    }
  }
  .switch-wrapper {
    :deep(.van-field__control.van-field__control--custom) {
      justify-content: right;
    }
  }
  .form-textarea {
    flex-direction: column;
    :deep(.van-field__body) {
      border: 1px solid #f6f6f6;
      padding: 5px 5px;
      margin-top: 5px;
    }
  }

  .form-footer {
    padding: 0 33px 30px 33px;
  }
  :deep(.special-place) {
    .van-field__control::placeholder {
      color: rgba(0, 0, 0, 0.85) !important;
    }
  }
  :deep(.special-header-data) {
    .van-field__value::after {
      content: '未出动';
      color: #323233;
    }
  }
  :deep(.special-no-data) {
    .van-field__value::after {
      content: '无';
      color: #323233;
    }
  }
}
</style>
