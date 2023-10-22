<script setup>
import { onMounted, ref } from 'vue'
import { useSubmit } from '@castle/castle-use'
import { v4 as uuidv4 } from 'uuid'
import { showLoadingToast, closeToast } from "vant";
// import { useSuccess } from '@/hooks/useSuccess.js'
import SelectSingle from "@/component/SelectSingle/index";
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
  closeToast()
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
  showLoadingToast()
  await submit()
  await formRef.value.finishFn()
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
    formRef.value.finishFn = finishFn
  }, loading)
})
</script>

<template>
  <div class="apply-abolish">
    <div class="tooltip">
      <img src="@/assets/images/icon_warning.png" alt="">
      <span style="margin-left: 10px;">警情申请作废后，关联的出动、火灾报告一并作废！</span>
    </div>
    <van-form ref="formRef" @submit="onSubmit">
      <SelectSingle
        v-model:value="form.cancelReason"
        name="cancelReason"
        :options="options"
        :field-names="{ value: 'value', label: 'label' }"
        :required="true"
        title="作废原因"
        label="作废原因："
        placeholder="请选择作废原因"
        :rules="[{ required: true, message: '请选择作废原因' }]"
      />
      <van-field
        v-model="form.cancelRemark"
        name="cancelRemark"
        required
        rows="4"
        autosize
        label="备注："
        type="textarea"
        maxlength="500"
        placeholder="请输入备注"
        show-word-limit
        :rules="[{ required: true, message: '请输入备注' }]"
        class="form-textarea"
      />
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.apply-abolish {
  .tooltip {
    background: #FEF7E3;
    padding: 8px 10px;
    margin: 10px 16px;
  }
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
