<script setup>
import { onMounted, ref } from 'vue'
import { showToast, showLoadingToast, closeToast } from "vant"
import { useSubmit } from '@castle/castle-use'
import SelectSingle from "@/component/SelectSingle/index";
import { rejectFireBack } from '@/apis/index.js'

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
  showToast('退回成功!')
  form.value = {
    backCause: undefined,
    backRemark: '',
  }
  emits('finishCallback')
}, {
  submitFn: () => rejectFireBack({
    ...form.value,
    boFireInfoId: props.currentRow?.boFireInfoId,
  }),
})

const onSubmit = async () => {
  showLoadingToast()
  await submit()
  await formRef.value.finishFn()
}

onMounted(() => {
  props.setHandleOk(async (finishFn) => {
    formRef.value.submit()
    formRef.value.finishFn = finishFn
  }, loading)
})
</script>

<template>
  <div class="apply-reject">
    <van-form ref="formRef" @submit="onSubmit">
      <SelectSingle
        v-model:value="form.backCause"
        name="backCause"
        :options="options"
        :field-names="{ value: 'value', label: 'label' }"
        :required="true"
        :title="`${title}`"
        :label="`${title}：`"
        :placeholder="`请选择${title}`"
        :rules="[{ required: true, message: `请选择${title}` }]"
        teleport="body"
      />
      <van-field
        v-model="form.backRemark"
        name="backRemark"
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
.apply-reject {
}
</style>
