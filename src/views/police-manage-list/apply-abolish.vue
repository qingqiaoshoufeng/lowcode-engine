<script setup>
import { onMounted, ref } from 'vue'
import { useSubmit } from '@castle/castle-use'
import { v4 as uuidv4 } from 'uuid'
// import { useSuccess } from '@/hooks/useSuccess.js'
import { abolishFireWarning } from '@/apis/index.js'

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => {},
  },
  setHandleOk: {
    type: Function,
  },
})

const emits = defineEmits(['finishCallback'])

// const { showSuccessModal } = useSuccess()

const tooltip = [
  '警情申请作废后，关联的出动、火灾报告一并作废！',
]

const localFireRecheckId = uuidv4()

const options = [
  {
    label: '警情重复派发',
    value: '1',
  },
  {
    label: '警情信息错误',
    value: '2',
  },
  {
    label: '指派队伍错误',
    value: '3',
  },
  {
    label: '其他',
    value: '4',
  },
]

const formRef = ref(null)

const form = ref({
  cancelReason: undefined,
  cancelRemark: '',
})

const { loading, submit } = useSubmit(() => {
  emits('finishCallback')
}, {
  submitFn: () => abolishFireWarning({
    boFireCancelId: localFireRecheckId,
    boFireWarningId: props.currentRow?.boFireWarningId,
    cancelReason: form.value.cancelReason,
    cancelRemark: form.value.cancelRemark,
    new: true,
    processStartReq: {},
  }),
})

const onSubmit = async () => {
  await submit()
  // await finishFn()
  // showSuccessModal({
  //   title: '申请作废成功！',
  //   okText: '查看申请记录',
  //   pathName: 'apply-record',
  //   query: {
  //     applyType: 4,
  //   },
  // })
}

onMounted(() => {
  props.setHandleOk(async (finishFn) => {
    formRef.value.submit()
  }, loading)
})
</script>

<template>
  <div class="apply-abolish">
    <van-form ref="formRef" @submit="onSubmit">
      <van-field
        v-model="form.cancelRemark"
        name="cancelRemark"
        required
        rows="4"
        autosize
        label="备注"
        type="textarea"
        maxlength="500"
        placeholder="请输入备注"
        show-word-limit
        :rules="[{ required: true, message: '请输入备注' }]"
        class="form-textarea"
      />
    </van-form>
    <!-- <a-form ref="formRef" :model="form" label-align="right" :label-col="{ style: { width: '94px' } }" autocomplete="off">
      <a-form-item
        name="cancelReason"
        label="作废原因"
        :rules="[{ required: true, message: `请选择作废原因` }]"
      >
        <a-select
          v-model:value="form.cancelReason"
          :options="options"
          placeholder="请选择作废原因"
        />
        <a-tooltip>
          <template #title>
            {{ tooltip[0] }}
          </template>
          <QuestionCircleOutlined class="form-col-delete" />
        </a-tooltip>
      </a-form-item>
    </a-form> -->
  </div>
</template>

<style lang="scss" scoped>
.apply-abolish {
  .form-textarea {
    flex-direction: column;
    :deep(.van-field__body) {
      border: 1px solid #f6f6f6;
      padding: 5px 5px;
      margin-top: 5px;
    }
  }
}
</style>
