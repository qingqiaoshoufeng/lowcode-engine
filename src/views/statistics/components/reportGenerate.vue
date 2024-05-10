<script setup>
import { ref, onMounted, nextTick, inject, watch, onUnmounted } from "vue";
import dayjs from 'dayjs';
import { showToast, showLoadingToast, closeToast} from "vant";
import { cloneDeep } from 'lodash-es';
import { useOptions } from "@/hooks/useOptions.js";
import { useExcelConfig } from "./config.js";
import { getRangeByCode } from "@/utils/_xlsxspread.min.js";
import { reportStyle, statType } from "@/utils/constants.js";
import { getLastMonth } from "@/utils/tools.js";
import {
  getReportTemplateList,
  getSourceOption,
  getTemplateParams,
  searchReportByDefine,
  searchReportByTemplate,
} from "@/apis/index.js";
import SelectSingle from "@/component/SelectSingle/index";
import SelectMultiple from "@/component/SelectMultiple/index";
import SelectRangeTime from "@/component/SelectRangeTime/index";
import SelectOrg from "@/component/SelectOrg/index";
import AreaCascader from "@/component/AreaCascader/index";

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => {},
  },
  searchType: { // 1. 正常报表查询，2. 综合查询，3. 高级查询
    type: Number,
    default: 1,
  },
  queryParams: {
    type: Function,
  },
  setHandleOk: {
    type: Function,
  },
})

const { options } = useOptions({
  perTypes: [
    { label: '展示同期数据', value: 1 },
    { label: '展示同比变化', value: 2 },
    { label: '展示环期数据', value: 3 },
    { label: '展示环比变化', value: 4 },
  ],
  searchDimensionOptions: [
    {
      label: '数据石化口径',
      value: 1,
    },
    {
      label: '数据迁移口径',
      value: 2,
    },
  ],
  reportStyle,
  reportClass: statType,
})

const { luckyOption } = useExcelConfig();

const show = inject('show')

const form = ref({
  time: getLastMonth(),
  reportStyle: '1',
  reportClass: undefined,
  reportNick: undefined,
  deactivateFlag: false,
  searchDimension: 1,
  dataTimeSource: '',
})

const openState = ref(false)

const searchLoading = ref(false)

const reportName = ref('')

const reportType = ref('')

const reportContentRef = ref(null)

const reportDefineRef = ref(null)

const tableStream = ref(null)

const selectReport = ref(cloneDeep(props.currentRow))

watch(() => show.value.lookVisible, () => {
  if (show.value && !show.value.lookVisible && window.luckysheet) {
    window.luckysheet.destroy()
  }
})

const getExcelTitle = () => {
  if (tableStream.value?.excelTitle) {
    return tableStream.value?.excelTitle
  }
  let text = ''
  const time = form.value.time
  if (form.value.createUserOrg?.[0]) {
    text = `${form.value.createUserOrg?.[0]?.name}-`
  }
  text += selectReport.value?.templateName
  if (time?.[0] && time?.[1]) {
    text += `(${dayjs(time[0]).format('YYYY年MM月DD日')}-${dayjs(time[1]).format('YYYY年MM月DD日')})`
  }
  return text
}

const handleSearch = () => {
  const { queryType, reportNick } = form.value
  if (!reportNick) {
    showToast('请先选择报表名称')
    return
  }
  if (props.searchType !== 2 && props.searchType !== 3) {
    if (options.value.queryType?.length > 0) {
      if (!queryType) {
        showToast('请先选择维度')
        return
      }
    }
    if (!form.value.time || !form.value.time?.[0]) {
      showToast('请先选择时间')
      return
    }
  }
  else if (props.searchType === 2 || props.searchType === 3) {
    if (options.value.queryType?.length > 0) {
      if (!queryType) {
        showToast('请先选择维度')
        return
      }
    }
  }
  searchLoading.value = true
  showLoadingToast()
  const params = {
    queryType: form.value.queryType,
    boFireReportTypeId: form.value.queryType,
    excelTitle: getExcelTitle(),
    templateCode: selectReport.value?.templateCode,
    isDown: false,
    time: form.value.time,
    organizationId: form.value.createUserOrg?.[0]?.organizationid,
    areaId: form.value.areaId,
    perTypes: form.value.perTypes?.join(','),
    staticFlag: form.value.searchDimension,
    dataTimeSource: form.value.dataTimeSource === '1' ? '' : form.value.dataTimeSource,
    deactivateFlag: form.value.deactivateFlag ? 2 : 1,
  }
  if (props.searchType === 2 || props.searchType === 3) {
    params.type = props.searchType
    params.queryReq = props.queryParams()
  }
  searchReportByTemplate(params).then((res) => {
    searchLoading.value = false
    if (res?.data?.data) {
      openState.value = true
      const data = res?.data?.data
      tableStream.value = data

      const totalData = [...data?.head, ...data?.result]
      const luckysheetData = []
      for (let i = 0; i < totalData.length; i++) {
        const leftAlign = data.leftLine?.includes(i) // 判断某一行是否需要居左
        for (let j = 0; j < totalData[i].length; j++) {
          luckysheetData.push({
            r: i,
            c: j,
            v: {
              v: `${totalData[i][j]}`,
              m: `${totalData[i][j]}`,
              ht: leftAlign ? 1 : 0,
              vt: 0,
              ct: { fa: '@', t: 's' },
            },
          })
        }
      }

      luckyOption.value.container = 'my-table-box'

      nextTick(() => {
        window.luckysheet.create({
          ...luckyOption.value,
          data: [{
            index: 0,
            status: 1,
            order: 0,
            scrollLeft: 0,
            scrollTop: 0,
            defaultRowHeight: 32, // 自定义行高
            row: totalData.length, // 行数
            column: totalData[0].length, // 列数
            celldata: luckysheetData,
            luckysheet_select_save: [], // 选中的区域
          }],
          hook: {
            workbookCreateAfter: function() {
              window.luckysheet.setRangeShow({ row: [0, 0], column: [0, 0] }, { show: false, order: 0 })
            }
          }
        })
        window.luckysheet.setRangeMerge('all', {
          range: getRangeByCode(data?.mergeCells),
        })
        const widthObj = {}
        let passNumber = 3
        if (selectReport.value?.templateCode === 'GD_HZ202310160006') {
          passNumber = 4
        }
        for (let i = 0; i < totalData[0].length; i++) {
          const columnData = totalData.map((row) => {
            if (String(row[i])?.indexOf('备注：') > -1) {
              return 0
            }
            else {
              return String(row[i]).length
            }
          })
          for (let i = 0; i < passNumber; i++) {
            columnData.shift()
          }
          widthObj[i] = Math.max(...columnData) * 14 + 2
        }
        window.luckysheet.setColumnWidth(widthObj)
      })
    }
    else {
      showToast(res?.data?.msg || '报表生成出错，请重试')
    }
  }).catch((_error) => {
    searchLoading.value = false
  }).finally(() => {
    closeToast()
  })
};

const handleDefineSearch = () => {
  const { queryType } = form.value
  if (!form.value.reportNick) {
    showToast('请先选择报表名称')
    return
  }
  if (props.searchType !== 2 && props.searchType !== 3) {
    if (!form.value.time || !form.value.time?.[0]) {
      showToast('请先选择时间')
      return
    }
    if ((reportType.value === '1') && !form.value.areaId) {
      showToast('请先选择行政区域')
      return
    }
    if ((reportType.value === '2') && !form.value.createUserOrg) {
      showToast('请先选择所属队伍')
      return
    }
  }
  else if (props.searchType !== 2 && props.searchType !== 3) {
    if (options.value.queryType?.length > 0) {
      if (!queryType || !queryType.option?.reportType) {
        showToast('请先选择维度')
        return
      }
    }
  }
  searchLoading.value = true
  // eslint-disable-next-line no-console
  console.log('start：', new Date().getTime())
  const params = {
    templateCode: selectReport.value?.templateCode,
    excelTitle: getExcelTitle(),
    time: form.value.time,
    ancestors: form.value.createUserOrg?.[0]?.ancestors,
    areaId: form.value.areaId,
    perTypes: form.value.perTypes?.join(','),
    id: selectReport.value?.id,
    querytype: 1,
    staticFlag: form.value.searchDimension,
    dataTimeSource: form.value.dataTimeSource === '1' ? '' : form.value.dataTimeSource,
    deactivateFlag: form.value.deactivateFlag ? 2 : 1,
  }
  if (props.searchType === 2 || props.searchType === 3) {
    params.querytype = props.searchType
    params.queryData = props.queryParams()
  }
  showLoadingToast()
  searchReportByDefine(params).then((res) => {
    searchLoading.value = false
    if (res?.data?.data) {
      openState.value = true
      const data = res?.data?.data
      tableStream.value = data

      const totalData = [...data?.head, ...data?.result]
      const luckysheetData = []
      for (let i = 0; i < totalData.length; i++) {
        for (let j = 0; j < totalData[i].length; j++) {
          luckysheetData.push({
            r: i,
            c: j,
            v: {
              v: `${totalData[i][j]}`,
              m: `${totalData[i][j]}`,
              ht: 0,
              vt: 0,
              ct: { fa: '@', t: 's' },
            },
          })
        }
      }

      luckyOption.value.container = 'my-table-define'

      nextTick(() => {
        window.luckysheet.create({
          ...luckyOption.value,
          data: [{
            index: 0,
            status: 1,
            order: 0,
            scrollLeft: 0,
            scrollTop: 0,
            defaultRowHeight: 32, // 自定义行高
            row: totalData.length, // 行数
            column: totalData[0].length, // 列数
            celldata: luckysheetData,
            luckysheet_select_save: [], // 选中的区域
          }],
          hook: {
            workbookCreateAfter: function() {
              window.luckysheet.setRangeShow({ row: [0, 0], column: [0, 0] }, { show: false, order: 0 })
            }
          }
        })
        window.luckysheet.setRangeMerge('all', {
          range: getRangeByCode(data?.mergeCells),
        })
        const widthObj = {}
        let totalWidth = 0
        for (let i = 0; i < totalData[0].length; i++) {
          const columnData = totalData.map(row => String(row[i]).length)
          columnData.shift()
          columnData.shift()
          columnData.shift()
          widthObj[i] = Math.max(...columnData) * 14 + 2
          totalWidth += widthObj[i]
        }
        if (totalWidth < 680) {
          Object.keys(widthObj)?.forEach((key) => {
            widthObj[key] = Math.floor((widthObj[key] / totalWidth) * 680)
          })
        }
        window.luckysheet.setColumnWidth(widthObj)
      })
    }
    else {
      showToast(res?.data?.msg || '报表生成出错，请重试')
    }
  }).catch((_error) => {
    searchLoading.value = false
  }).finally(() => {
    closeToast()
  })
}

const onReportStyle = () => {
  form.value.reportNick = undefined
  form.value.queryType = undefined
  form.value.createUserOrg = undefined
  form.value.areaId = undefined
  form.value.time = getLastMonth()
  form.value.perTypes = []
  selectReport.value = null
  options.value.reportNick = []
  reportType.value = ''
  reportName.value = ''

  if (reportContentRef.value) {
    reportContentRef.value.innerHTML = ''
  }
  if (reportDefineRef.value) {
    reportDefineRef.value.innerHTML = ''
  }

  getReportTemplateList({
    page: 1,
    limit: 100000,
    sceneType: form.value.reportClass ? form.value.reportClass : undefined,
    templateType: form.value.reportStyle ? Number(form.value.reportStyle) : undefined,
  }).then((res) => {
    if (res?.list) {
      options.value.reportNick = res.list
    }
  })
}

const onReportClass = () => {
  form.value.reportNick = undefined
  form.value.queryType = undefined
  form.value.createUserOrg = undefined
  form.value.areaId = undefined
  // form.value.time = getLastMonth()
  form.value.perTypes = []
  selectReport.value = null
  options.value.reportNick = []
  reportType.value = ''
  reportName.value = ''

  getReportTemplateList({
    page: 1,
    limit: 100000,
    sceneType: form.value.reportClass ? form.value.reportClass : undefined,
    templateType: form.value.reportStyle ? Number(form.value.reportStyle) : undefined,
  }).then((res) => {
    if (res?.list) {
      options.value.reportNick = res.list
    }
  })
}

const initType = () => {
  if (selectReport.value?.id && selectReport.value?.templateType === '固定报表') {
    getTemplateParams({ id: selectReport.value?.id }).then((res) => {
      if (res) {
        options.value.queryType = res?.map((item) => {
          return {
            ...item,
            key: item.boFireReportTypeId,
            value: item.reportName,
          }
        })
      }
    })
  }
  else if (selectReport.value?.id && selectReport.value?.templateType === '自定义报表') {
    getTemplateParams({ id: selectReport.value?.id }).then((res) => {
      if (res?.length > 0) {
        options.value.queryType = res?.map((item) => {
          return {
            ...item,
            key: item.boFireReportTypeId,
            value: item.reportName,
          }
        })
        reportType.value = res[0].reportType
        reportName.value = res[0].reportName
        form.value.queryType = res[0].boFireReportTypeId
        // eslint-disable-next-line no-console
        console.log(reportType.value, reportName.value, form.value.queryType)
      }
    })
  }
}

const onReportNick = () => {
  form.value.queryType = undefined
  form.value.createUserOrg = undefined
  form.value.areaId = undefined
  // form.value.time = getLastMonth()
  form.value.perTypes = []
  reportType.value = ''
  reportName.value = ''

  const filter = options.value.reportNick?.filter(item => item.templateCode === form.value.reportNick)
  selectReport.value = filter?.[0]

  initType()
}

const initOptions = () => {
  getReportTemplateList({
    page: 1,
    limit: 100000,
    sceneType: form.value.reportClass,
    templateType: Number(form.value.reportStyle),
  }).then((res) => {
    if (res?.list) {
      form.value.reportNick = selectReport.value?.templateCode
      options.value.reportNick = res.list

      initType()
    }
  })
  getSourceOption().then((res) => {
    options.value.dataTimeSource = res.map((item, index) => {
      return ({
        value: index === 0 ? '1' : item.paramValue,
        label: item.showValue,
      })
    })
    form.value.dataTimeSource = '1'
  })
}

const initForm = () => {
  const { currentRow } = props
  if (currentRow?.templateType === '固定报表') {
    form.value.reportStyle = '1'
  }
  else if (currentRow?.templateType === '自定义报表') {
    form.value.reportStyle = '2'
  }
  if (currentRow?.sceneType === '警情') {
    form.value.reportClass = 1
  }
  else if (currentRow?.sceneType === '出动') {
    form.value.reportClass = 2
  }
  else if (currentRow?.sceneType === '火灾') {
    form.value.reportClass = 3
  }
  initOptions()
}

const handleOpen = () => {
  openState.value = !openState.value
}

onMounted(() => {
  initForm()
})
</script>

<template>
  <div class="report-statistical-search">
    <van-tabs v-model:active="form.reportStyle" @change="onReportStyle">
      <van-tab title="固定报表" name="1"></van-tab>
      <van-tab title="自定义报表" name="2"></van-tab>
    </van-tabs>
    <van-form ref="formRef" :style="{ 'height': openState ? '0px' : 'unset', 'overflow': 'hidden'}">
      <SelectSingle
        v-model:value="form.reportClass"
        :readonly="true"
        name="reportClass"
        required
        :options="options.reportClass"
        :field-names="{ value: 'value', label: 'label' }"
        title="请选择报表类型"
        label="报表类型："
        placeholder="请选择报表类型"
        :rules="[{ required: true, message: '请选择报表类型' }]"
        :disabled="searchType === 2 || searchType === 3"
        @change="onReportClass"
      />
      <SelectSingle
        v-model:value="form.reportNick"
        :readonly="true"
        name="reportNick"
        required
        :options="options.reportNick"
        :field-names="{ value: 'templateCode', label: 'templateName' }"
        title="请选择报表名称"
        label="报表名称："
        placeholder="请选择报表名称"
        :rules="[{ required: true, message: '请选择报表名称' }]"
        @change="onReportNick"
      />
      <SelectSingle
        v-model:value="form.queryType"
        :readonly="true"
        name="queryType"
        required
        :options="options.queryType"
        :field-names="{ value: 'key', label: 'value' }"
        title="请选择报表维度"
        label="报表维度："
        placeholder="请选择报表维度"
        :rules="[{ required: true, message: '请选择报表维度' }]"
        :disabled="form.reportStyle === '1' ? options.queryType?.length <= 0 : true"
      />
      <template v-if="searchType === 1">
        <SelectRangeTime
          v-model:value="form.time"
          :required="true"
          :readonly="true"
          label="统计时间："
          placeholder="请选择统计时间"
        />
      </template>
      <template v-if="form.reportStyle === '1' && searchType === 1">
        <AreaCascader
          v-model:value="form.areaId"
          :required="false"
          :readonly="true"
          :selectLeaf="false"
          label="行政区域："
          :report-name="reportName"
          :params="{ staticFlag: form.searchDimension, deactivateFlag: form.deactivateFlag ? 2 : 1 }"
          :disabled="!(reportType === '1' || options.queryType?.length <= 0) || (form.reportStyle === '1' && options.queryType?.length > 0)"
        />
      </template>
      <template v-else-if="form.reportStyle === '2' && searchType === 1">
        <AreaCascader
          v-model:value="form.areaId"
          :required="searchType === 1 && reportType === '1'"
          :readonly="true"
          :selectLeaf="false"
          label="行政区域："
          :report-name="reportName"
          :params="{ staticFlag: form.searchDimension, deactivateFlag: form.deactivateFlag ? 2 : 1 }"
        />
      </template>
      <template v-if="form.reportStyle === '1' && searchType === 1">
        <SelectOrg
          v-model:value="form.createUserOrg"
          :readonly="true"
          name="createUserOrg"
          :field-names="{ value: 'organizationid', label: 'name' }"
          :required="false"
          label="所属队伍："
          placeholder="请选择所属队伍"
          title="请选择所属队伍"
          :rules="[{ required: false, message: '请选择所属队伍' }]"
          :disabled="!(reportType === '2' || options.queryType?.length <= 0) || (form.reportStyle === '1' && options.queryType?.length > 0)"
          :select-leaf="false"
          :single="true"
          :params="{ isReportQuery: 1, reportName, permission: true, staticFlag: form.searchDimension, deactivateFlag: form.deactivateFlag ? 2 : 1 }"
        />
      </template>
      <template v-else-if="form.reportStyle === '2' && searchType === 1">
        <SelectOrg
          v-model:value="form.createUserOrg"
          :readonly="true"
          name="createUserOrg"
          :field-names="{ value: 'organizationid', label: 'name' }"
          :required="searchType === 1 && reportType === '2'"
          label="所属队伍："
          placeholder="请选择所属队伍"
          title="请选择所属队伍"
          :rules="[{ required: false, message: '请选择所属队伍' }]"
          :disabled="!(reportType === '3' || reportType === '2')"
          :select-leaf="false"
          :single="true"
          :params="{ isReportQuery: 1, reportName, permission: true, staticFlag: form.searchDimension, deactivateFlag: form.deactivateFlag ? 2 : 1 }"
        />
      </template>
      <SelectSingle
        v-model:value="form.dataTimeSource"
        :readonly="true"
        name="dataTimeSource"
        :required="false"
        :options="options.dataTimeSource"
        :field-names="{ value: 'value', label: 'label' }"
        title="请选择数据版本"
        label="数据版本："
        placeholder="请选择数据版本"
        :rules="[{ required: true, message: '请选择数据版本' }]"
      />
      <SelectMultiple
        v-model:value="form.perTypes"
        :readonly="true"
        name="perTypes"
        :options="options.perTypes"
        :field-names="{ value: 'value', label: 'label' }"
        :rules="[{ required: false, message: '请选择对比类型' }]"
        :required="false"
        label="对比类型："
        placeholder="请选择对比类型"
        title="请选择对比类型"
      />
      <SelectSingle
        v-model:value="form.searchDimension"
        :readonly="true"
        name="searchDimension"
        required
        :options="options.searchDimensionOptions"
        :field-names="{ value: 'value', label: 'label' }"
        title="请选择查询类型"
        label="查询口径："
        placeholder="请选择查询类型"
        :rules="[{ required: true, message: '请选择查询类型' }]"
      />
      <van-field label="">
        <template #input>
          <van-checkbox v-model="form.deactivateFlag">不查停用单位和地区</van-checkbox>
        </template>
      </van-field>
    </van-form>

    <div class="search-btn">
      <van-button
        type="primary"
        size="small"
        block
        :loading="searchLoading"
        @click="() => form.reportStyle === '1' ? handleSearch() : handleDefineSearch()"
      >
        查询
      </van-button>
      <van-button
        size="small"
        block
        style="margin-left: 10px;"
        @click="handleOpen"
      >
        {{ openState ? '收起' : '展开' }}
      </van-button>
    </div>

    <div class="report-content">
      <p v-if="form.reportStyle === '1'" id="my-table-box" ref="reportContentRef" class="my-table-box" />
      <p v-if="form.reportStyle === '2'" id="my-table-define" ref="reportDefineRef" class="my-table-define" />
    </div>
    <div class="tip_per">
      “-”表示同、环期无数据或者数据为0，无法计算出同环比
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tip_per {
  padding: 10px 0;
  color:red;
  font-size: 12px;
  // height: 20px;
  background-color: #fff;
}
.report-statistical-search {
  height: 100vh;
  overflow-y: auto;
  background: #F6F7F8;
  .search-btn {
    display: flex;
    padding: 20px 20px;
  }
  .report-content {
    width: 100%;
    height: calc(100% - 195px);
    overflow-x: auto;
    position: relative;
    .my-table-box {
      width: 100%;
      height: 100%;
      :deep(.luckysheet-work-area) {
        display: none;
      }
      :deep(.luckysheet-loading-mask)  {
        width: 0;
        height: 0;
        background-color: transparent;
      }
      :deep(.luckysheet-loading-content) {
        display: none;
      }
      .luckysheet-column-count-show.luckysheet-count-show {
        display: none !important;
      }
      .luckysheet-row-count-show.luckysheet-count-show {
        display: none !important;
      }
    }
    .my-table-define {
      width: 100%;
      height: 100%;
      :deep(.luckysheet-work-area) {
        display: none;
      }
      :deep(.luckysheet-loading-mask)  {
        width: 0;
        height: 0;
        background-color: transparent;
      }
      :deep(.luckysheet-loading-content) {
        display: none;
      }
      .luckysheet-column-count-show.luckysheet-count-show {
        display: none !important;
      }
      .luckysheet-row-count-show.luckysheet-count-show {
        display: none !important;
      }
    }
  }
}
</style>
