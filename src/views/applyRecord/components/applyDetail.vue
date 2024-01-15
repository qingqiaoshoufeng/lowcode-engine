<script setup>
import { onMounted } from "vue";
import { useDetail } from "@castle/castle-use";
import { useModal } from "@/hooks/useModal.js";
import { getApplyDetail } from "@/apis/index.js";
import { formatYmdHm, generateColorByState } from "@/utils/tools.js";
import PoliceEntryDetail from '@/views/policeEntryDetail/index.vue';
import DispatchForm from '@/views/dispatchReportForm/index.vue';
import EditorForm from '@/views/fire-report/components/EditorForm.vue'

const props = defineProps({
  applyType: {
    type: String,
    default: "1",
  },
  currentRow: {
    type: Object,
    default: () => {},
  },
});

const { show } = useModal()

const { detail, loadDetail } = useDetail({
  getDetailFn: () => {
    const { processInstanceId, boFireRecheckId, boFireCancelId } = props.currentRow
    return getApplyDetail({
      appId: boFireRecheckId || boFireCancelId,
      instanceId: processInstanceId,
      applyType: props.applyType,
    })
  },
})

onMounted(() => {
  if (props.currentRow.processInstanceId) {
    loadDetail()
  }
})

const handleOpen = (key) => {
  show.value[key] = true
}

const getCurrentStatus = (item) => {
  if (!item.commentDate) {
    return 'process'
  }
  else if (['通过', '同意', '审核通过'].includes(item.comment) || !item.comment) {
    return 'finish'
  }
  else if (['不通过', '不同意', '退回起草人', '退回上一级'].includes(item.comment)) {
    return 'error'
  }
}
</script>

<template>
  <div class="apply-detail">
    <van-cell-group>
      <h2 class="detail-title">申请单信息</h2>
      <van-field label="申请单位：" :model-value="detail?.applyOrg" readonly />
      <van-field label="申请人：" :model-value="detail?.createUserName" readonly />
      <van-field label="申请时间：" :model-value="detail?.createDate" readonly />
      <template v-if="applyType !== '4'">
        <van-field label="申请原因：" :model-value="detail?.recheckReason" readonly />
      </template>
      <template v-else>
        <van-field label="申请原因：" :model-value="detail?.cancelReasonValue" readonly />
      </template>
      <template v-if="applyType !== '4' && applyType !== '2'">
        <van-field label="更正类型：" :model-value="detail?.applyTypeValue" readonly />
      </template>
      <template v-else-if="applyType === '4'">
        <van-field label="备注：" :model-value="detail?.cancelRemark" readonly />
      </template>
      <van-field
        label="申请单状态："
        :model-value="detail?.statusValue"
        readonly
        :class="generateColorByState(detail?.status)"
      />
      <template v-if="applyType === '1' || applyType === '4'">
        <van-field
          label="关联警情编号："
          label-width="104px"
          :model-value="detail?.warningCode"
          readonly
          class="link-code"
          @click="handleOpen('policeVisible')"
        />
        <van-field label="警情状态：" :model-value="detail?.warningStatusValue" readonly />
      </template>
      <template v-else-if="applyType === '2'">
        <van-field
          label="关联出动编号："
          label-width="104px"
          :model-value="detail?.dispatchCode"
          readonly
          class="link-code"
          @click="handleOpen('dispatchVisible')"
        />
        <van-field label="出动状态：" :model-value="detail?.dispatchStatusValue" readonly />
      </template>
      <template v-else-if="applyType === '3'">
        <van-field
          label="关联火灾编号："
          label-width="104px"
          :model-value="detail?.fireCode"
          readonly
          class="link-code"
          @click="handleOpen('fireVisible')"
        />
        <van-field label="火灾状态：" :model-value="detail?.fireStatusValue" readonly />
      </template>
    </van-cell-group>
    <div class="record-steps">
      <h2 class="detail-title">审批记录</h2>
      <van-steps direction="vertical" :active="-1">
        <van-step
          v-for="(item, index) in detail?.commentsInfo"
          :key="item.createDate"
          >
          <template #inactive-icon>
            <van-icon v-if="getCurrentStatus(item) === 'finish'" name="success" color="light-green" />
            <van-icon v-if="getCurrentStatus(item) === 'error'" name="cross" color="red" />
            <van-icon v-if="getCurrentStatus(item) === 'process'" name="circle" color="blue" />
          </template>
          <template v-if="index !== (detail?.commentsInfo?.length - 1)">
            <p style="font-weight: bold;">{{ item.commentDate ? formatYmdHm(item.commentDate) : '' }}</p>
            <p>审批单位：{{ item.commentOrgName }}</p>
            <p v-if="item.commentUserName">审批人员：{{ item.commentUserName }}</p>
            <p v-if="getCurrentStatus(item) !== 'process'">审批结果：{{ item.comment }}</p>
            <p v-if="getCurrentStatus(item) !== 'process'">审批意见：{{ item.remark }}</p>
          </template>
          <template v-else>
            <p style="font-weight: bold;">{{ item.commentDate ? formatYmdHm(item.commentDate) : '' }}</p>
            <p>申请单位：{{ item.commentOrgName }}</p>
            <p>申请人员：{{ item.commentUserName }}</p>
          </template>
        </van-step>
      </van-steps>
    </div>

    <!-- 警情详情 -->
    <ProModal v-model:visible="show.policeVisible" :showBack="true" :showHeader="false" title="警情详情">
      <PoliceEntryDetail :current-row="{ boFireWarningId: currentRow.recheckAppid || currentRow.boFireWarningId }" />
    </ProModal>
    <!-- 出动填报详情 -->
    <ProModal v-model:visible="show.dispatchVisible" :showBack="true" :showHeader="false" title="出动填报详情">
      <DispatchForm
        :current-row="{ ...currentRow, boFireDispatchId: currentRow.recheckAppid, boFireWarningId: currentRow.boFireWarningId }"
        :is-detail="true"
      />
    </ProModal>
    <!-- 火灾填报详情 -->
    <ProModal v-model:visible="show.fireVisible" :showBack="true" :showHeader="false" title="火灾填报详情">
      <EditorForm
        :current-row="{ boFireInfoId: currentRow.recheckAppid, boFireWarningId: currentRow.boFireWarningId }"
        :is-detail="true"
      />
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.apply-detail {
  height: 100%;
  overflow-y: auto;
  background-color: #f6f7f8;
  :deep(.state-wait .van-field__control) {
    color: #f2b34c !important;
  }
  :deep(.state-finish .van-field__control) {
    color: #34c38f !important;
  }
  :deep(.state-reject .van-field__control) {
    color: #ff4d16 !important;
  }
  .link-code {
    :deep(.van-field__control) {
      color: blue;
    }
  }
  .record-steps {
    margin-top: 10px;
    :deep(.van-step__title) {
      color: #323232;
    }
  }
  .detail-title {
    background-color: white;
    padding: 10px 0 4px 16px;
  }
}
</style>
