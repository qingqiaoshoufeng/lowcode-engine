<script setup>
import { onMounted, ref } from 'vue'
import { useSubmit } from '@castle/castle-use'
import { remarkReason } from '@/apis/index.js'
import {showToast} from 'vant'
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
  showToast('备注成功')
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
      await submit()
      await finishFn()
    })
  }, loading)
})
</script>

<template>
  <div class="remark-reason">
    <van-form ref="formRef" :model="form" label-align="right" :label-col="{ style: { width: '94px' } }" autocomplete="off">
      <van-field
        name="remarkContent"  
        label="超时原因："
        :rules="[{ required: true, message: '请输入超时原因' }]"
        v-model="form.remarkContent"
        placeholder="请输入超时原因"
        :rows="6"
        :maxlength="500" 
        show-count
        type="textarea" 
        required
      />
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.remark-reason {
  margin-right: 20px;
}
</style>
