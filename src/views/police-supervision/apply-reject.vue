<script setup>
import { onMounted, ref } from 'vue'
import { message } from '@castle/ant-design-vue'
import { useSubmit } from '@castle/castle-use'
import { rejectBatch } from '@/apis/index.js'
import {showToast} from 'vant'
const props = defineProps({
  type: {
    type: String,
    default: '1',
  },
  currentRow: {
    type: Object,
    default: () => {},
  },
  selectedKeys: {
    type: Array,
    default: () => [],
  },
  setHandleOk: {
    type: Function,
  },
  finishCallback:{
    type: Function,
  }
})

const emits = defineEmits(['finishCallback'])

const options = [
  {
    label: '数据不准',
    value: '数据不准',
  },
  {
    label: '数据错误',
    value: '数据错误',
  },
  {
    label: '信息不全',
    value: '信息不全',
  },
  {
    label: '数据不规范',
    value: '数据不规范',
  },
]

const formRef = ref(null)

const form = ref({
  rejectCause: undefined,
  rejectRemark: '',
})

const { loading, submit } = useSubmit(() => {
  showToast('驳回成功')
  emits('finishCallback')
}, {
  submitFn: () => {
    const { currentRow, type, selectedKeys } = props
    const { rejectCause, rejectRemark } = form.value
    let ids = []
    if (type === '1' && currentRow?.boFireWarningId) {
      ids.push(currentRow?.boFireWarningId)
    }
    else if (type === '2' && currentRow?.boFireDispatchId) {
      ids.push(currentRow?.boFireDispatchId)
    }
    else if (type === '3' && currentRow?.boFireInfoId) {
      ids.push(currentRow?.boFireInfoId)
    }
    else {
      ids = selectedKeys
    }
    return rejectBatch({
      rejectType: type,
      rejectCause,
      rejectRemark,
      ids,
    })
  },
})

onMounted(() => {
  props.setHandleOk(async (finishFn) => {
    formRef.value.validate().then(async (values) => {
      await submit()
      props.finishCallback()
      finishFn()
    })
  }, loading)
})
</script>

<template>
  <van-form ref="formRef" :model="form" label-align="right" autocomplete="off">
    <SelectSingle
      name="rejectCause"
      label="驳回原因"
      :rules="[{ required: true, message: `请选择驳回原因` }]"
      v-model:value="form.rejectCause" 
      label-width="62px"
      :options="options" 
      placeholder="请选择驳回原因"
      :field-names="{label:'label',value:'value'}"
      :required="true"
      title="请选择驳回原因" 
      teleport="body"
    />
    <van-field
      name="rejectRemark"
      label="驳回描述"
      label-width="62px"
      :rules="[{ required: true, message: '请输入驳回描述' }]"
      id="fileRemark"
      v-model="form.rejectRemark"
      v-preview-text="showPreview"
      :rows="4"
      :maxlength="500"
      show-count
      required
      allow-clear
      placeholder="请输入驳回描述"
      autosize
      type="textarea"
    />
  </van-form>
</template>
