<script setup>
import { onMounted, ref } from 'vue'
import { message } from '@castle/ant-design-vue'
import { useSubmit } from '@castle/castle-use'
import { remarkReason } from '@/apis/index.js'

const props = defineProps({
  dataType: {
    type: Number,
    default: 1,
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

const formRef = ref(null)

const form = ref({
  remarkContent: '',
})

const { loading, submit } = useSubmit(() => {
  message.success('备注成功')
  emits('finishCallback')
}, {
  submitFn: () => {
    const { boFireInfoId, boFireDispatchId, boFireWarningId } = props.currentRow
    return remarkReason({
      dataId: boFireInfoId || boFireDispatchId || boFireWarningId,
      remarkContent: form.value.remarkContent,
      dataType: props.dataType,
    })
  },
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
  <div class="remark-reason">
    <van-form ref="formRef" :model="form" autocomplete="off">
      <van-field
        name="remarkContent"
        label="超时原因"
        :rules="[{ required: true, message: '请输入超时原因' }]"
        v-model="form.backRemark"
        v-model:value="form.remarkContent"
        placeholder="请输入超时原因"
        :rows="4"
        :maxlength="500"
        show-count
        required
      />
    </van-form>
  </div>
</template>

<style lang="less" scoped>
.remark-reason {
  margin-right: 20px;
}
</style>
