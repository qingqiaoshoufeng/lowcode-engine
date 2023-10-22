<script setup>
import { onMounted, ref } from 'vue'
// import { message } from '@castle/ant-design-vue'
import { useSubmit } from '@castle/castle-use'
import { rejectDispatchBack } from '@/apis/index.js'

const props = defineProps({
  title: {
    type: String,
    default: '退回原因',
  },
  currentRow: {
    type: Object,
    default: () => {},
  },
  setHandleOk: {
    type: Function,
  },
})

const emits = defineEmits(['finishCallback'])

const options = [
  {
    label: '警情信息错误',
    value: '警情信息错误',
  },
  {
    label: '任务派发错误',
    value: '任务派发错误',
  },
  {
    label: '其他',
    value: '其他',
  },
]

const formRef = ref(null)

const form = ref({
  backCause: undefined,
  backRemark: '',
})

const { loading, submit } = useSubmit(() => {
  // message.success('操作成功')
  emits('finishCallback')
}, {
  submitFn: () => rejectDispatchBack({
    ...form.value,
    boFireDispatchId: props.currentRow?.boFireDispatchId,
  }),
})

onMounted(() => {
  props.setHandleOk(async (finishFn) => {
    formRef.value.validate().then(async (values) => {
      if (values) {
        await submit()
        await finishFn()
      }
    })
  }, loading)
})
</script>

<template>
  >>>>
  <!-- <a-form ref="formRef" :model="form" label-align="right" :label-col="{ style: { width: '80px' } }" autocomplete="off">
    <a-form-item
      name="backCause"
      :label="title"
      :rules="[{ required: true, message: `请选择${title}` }]"
    >
      <a-select v-model:value="form.backCause" :options="options" :placeholder="`请选择${title}`" />
    </a-form-item>
    <a-form-item
      name="backRemark"
      label="备注"
      :rules="[{ required: true, message: '请输入备注' }]"
    >
      <a-textarea
        v-model:value="form.backRemark"
        placeholder="请输入备注"
        :rows="4"
        :maxlength="500"
        show-count
      />
    </a-form-item>
  </a-form> -->
</template>
