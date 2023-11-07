<script setup>
import { computed, onMounted, provide, ref } from 'vue'
import { useDetail, useSubmit } from '@castle/castle-use'
import dayjs from 'dayjs'
import PloceTabs from './policeTabs.vue'
import DispatchForm from '@/views/dispatchReportForm/index.vue'
import FireForm from '@/views/fire-report/components/EditorForm.vue'
import PoliceForm from '@/views/policeEntryForm/index.vue'
import ProcessReview from '@/component/ProcessReview/index.vue'
import ProModal from "@/component/ProModal/index";
import { approveProcessActions, getFireWarningDetail, getFireWarningTabs } from '@/apis/index.js'
import { useModal } from '@/hooks/useModal.js'

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => {},
  },
  isApproval: {
    type: Boolean,
    default: false,
  },
  processKey: {
    type: String,
    default: '',
  },
  showExportPdf: { // 显示导出按钮
    type: Boolean,
    default: false,
  },
  setHandleOk: {
    type: Function,
  },
})

const emits = defineEmits(['finishCallback'])

const { detail, loadDetail } = useDetail({ getDetailFn: () => getFireWarningDetail(props.currentRow.boFireWarningId) })

const fireWarningInfo = ref({})

const localFireWarningId = ref('')

const approvalForm = ref(null)

const tabsData = ref([])

const selectTabRow = ref()

const { show } = useModal()

const currenState = computed(() => {
  return fireWarningInfo.value?.warningStatusValue
})

provide('localFireWarningId', localFireWarningId)

provide('fieldByState', currenState)

const { loading: approvalLoading, submit: approvalSubmit } = useSubmit(
  (res) => {
    if (!props.isApproval) {
      message.success('审批成功')
      emits('finishCallback')
    }
  },
  {
    submitFn: () => {
      return approveProcessActions(props.currentRow?.taskId, {
        businessData: {},
        approveType: approvalForm.value.approveType,
        taskData: {
          suggest: approvalForm.value.suggest,
          variables: {},
        },
        remark: approvalForm.value.remark,
      })
    },
  },
)

const approvalCallback = async (form) => {
  approvalForm.value = form
  await approvalSubmit()
  show.value.approvalVisible = false
  emits('finishCallback')
}

onMounted(async () => {
  const { currentRow } = props
  getFireWarningTabs(currentRow?.boFireWarningId).then(async (res) => {
    if (res?.data) {
      const { data } = res
      // selectTabRow.value = props.currentRow
      tabsData.value = [...data?.fireWarningList, ...data?.fireList, ...data?.dispatchList]
      tabsData.value.forEach((item) => {
        if (item.boFireInfoId) {
          item.type = 5
        }
        else if (item.boFireDispatchId && item.dispatchType === '1') {
          item.type = 2
          item.dispatchTypeValue = '主战'
        }
        else if (item.boFireDispatchId && item.dispatchType === '2') {
          item.type = 3
          item.dispatchTypeValue = '增援'
        }
        else if (item.boFireDispatchId && item.dispatchType === '3') {
          item.type = 4
          item.dispatchTypeValue = '指挥'
        }
        else if (item.boFireWarningId) {
          item.type = 1
        }
        if (item.boFireDispatchId && currentRow?.boFireDispatchId === item.boFireDispatchId && !selectTabRow.value) {
          selectTabRow.value = item
        }
        else if (item.boFireInfoId && currentRow?.boFireInfoId === item.boFireInfoId && !selectTabRow.value) {
          selectTabRow.value = item
        }
      })
      if (!selectTabRow.value?.boFireInfoId && !selectTabRow.value?.boFireDispatchId) {
        selectTabRow.value = { ...props.currentRow, type: 1 }
      }
      await loadDetail()
      fireWarningInfo.value = detail.value
      localFireWarningId.value = detail.value?.boFireWarningId
    }
  })

  props.setHandleOk && props.setHandleOk((finishFn) => {
    if (props.isApproval) {
      show.value.approvalVisible = true
    }
    else {
      finishFn()
    }
  }, approvalLoading)
})

const finishCallback = (row) => {
  selectTabRow.value = null
  setTimeout(() => {
    selectTabRow.value = row
  }, 500)
}
</script>

<template>
  <div class="police-manage-detail">
    <PloceTabs
      :tabs="tabsData"
      :select-tab-row="selectTabRow"
      @finish-callback="finishCallback"
    />
    <div v-if="(selectTabRow?.warningStatusValue || selectTabRow?.dispatchStatusValue || selectTabRow?.fireStatusValue) === '待填报' || selectTabRow?.isStorage === '1' || ((selectTabRow?.boFireDispatchId || selectTabRow?.boFireInfoId) && !selectTabRow?.commitDate)" class="tab-pane-content">
      <div v-if="selectTabRow?.fireStatusValue || (selectTabRow?.boFireInfoId && selectTabRow?.isStorage === '1') || (selectTabRow?.boFireInfoId && !selectTabRow?.commitDate)" class="no-data">
        <van-empty description="暂无火灾信息填报数据" />
      </div>
      <div v-else-if="selectTabRow?.dispatchStatusValue || (selectTabRow?.boFireDispatchId && selectTabRow?.isStorage === '1') || (selectTabRow?.boFireDispatchId && !selectTabRow?.commitDate)" class="no-data">
        <van-empty description="暂无出动信息填报数据" />
      </div>
    </div>
    <div v-else-if="selectTabRow?.boFireInfoId" class="tab-pane-content">
      <FireForm
        :is-police="true"
        :current-row="selectTabRow"
        :is-detail="true"
        render-dom=".police-tabs.police-tabs-line"
      />
    </div>
    <div v-else-if="selectTabRow?.boFireDispatchId" class="tab-pane-content">
      <DispatchForm
        :is-police="true"
        :current-row="selectTabRow"
        :is-detail="true"
        :offset="160"
      />
    </div>
    <div v-else-if="selectTabRow?.boFireWarningId" class="tab-pane-content">
      <PoliceForm
        :current-row="props.currentRow"
        :show-preview="true"
        :show-steps="true"
        :is-approval="isApproval"
      />
    </div>
    <ProModal v-model:visible="show.approvalVisible" :showHeader="false" title="新建警情">
      <template #default="{ setHandleOk }">
        <ProcessReview
          :process-key="props.processKey"
          :current-row="props.currentRow"
          :set-handle-ok="setHandleOk"
          label-text="审批"
          @finish-callback="approvalCallback"
        />
      </template>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.police-manage-detail {
  height: 100%;
  position: relative;
  .tab-pane-content {
    height: calc(100% - 98px);
  }
  .no-data {
    height: 100%;
    color: rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
