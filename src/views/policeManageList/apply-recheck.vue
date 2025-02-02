<script setup>
import { computed, onMounted, ref } from 'vue'
import { showToast, showLoadingToast, closeToast } from "vant"
import { useSubmit } from '@castle/castle-use'
import { v4 as uuidv4 } from 'uuid'
import SelectSingle from "@/component/SelectSingle/index";
import { recheckFireWarning } from '@/apis/index.js'
import { useOptions } from '@/hooks/useOptions.js'
import { applyType } from '@/utils/constants.js'

const props = defineProps({
  recheckType: {
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

const { options } = useOptions({ applyType })

const localFireRecheckId = uuidv4()

const tooltip = [
  '需要将火灾扑救修改为其他警情类型，请选择【重要信息更正】；修改其他警情信息请选择【普通信息更正】',
  '修改受伤人数、死亡人数、过火面积，请选择【重要信息更正】；修改出动填报其他信息请选择【普通信息更正】',
  '修改受伤人数、死亡人数，请选择【重要信息更正】；修改火灾填报其他信息请选择【普通信息更正】',
]

const formRef = ref(null)

const recheckAppid = computed(() => {
  if (props.recheckType === 1) {
    return props.currentRow?.boFireWarningId
  }
  else if (props.recheckType === 2) {
    return props.currentRow?.boFireDispatchId
  }
  else {
    return props.currentRow?.boFireInfoId
  }
})

const form = ref({
  recheckReason: '',
  applyType: undefined,
})

const { loading, submit } = useSubmit(() => {
  showToast('申请更正成功!')
  emits('finishCallback')
}, {
  submitFn: () => recheckFireWarning({
    boFireRecheckId: localFireRecheckId,
    recheckType: props.recheckType,
    recheckAppid: recheckAppid.value,
    recheckReason: form.value.recheckReason,
    applyType: form.value.applyType,
    new: true,
    processStartReq: {},
  }),
})

const onSubmit = async () => {
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
  <div class="apply-recheck">
    <div v-if="recheckType !== 2" class="tooltip">
      <img src="@/assets/images/icon_warning.png" alt="">
      <span style="margin-left: 10px;">{{ tooltip[recheckType - 1] }}</span>
    </div>
    <van-form ref="formRef" @submit="onSubmit">
      <SelectSingle
        v-if="recheckType !== 2"
        v-model:value="form.applyType"
        name="applyType"
        :options="options.applyType"
        :field-names="{ value: 'value', label: 'label' }"
        :required="true"
        title="申请类型"
        label="申请类型："
        placeholder="请选择申请类型"
        :rules="[{ required: true, message: '请选择申请类型' }]"
      />
      <van-field
        v-model="form.recheckReason"
        name="recheckReason"
        required
        rows="4"
        autosize
        label="申请原因"
        type="textarea"
        maxlength="500"
        placeholder="请输入申请原因"
        show-word-limit
        :rules="[{ required: true, message: '请输入申请原因' }]"
        class="form-textarea"
      />
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.apply-recheck {
  height: 100%;
  overflow-y: auto;
  .tooltip {
    background: #FEF7E3;
    padding: 8px 10px;
    margin: 10px 16px;
  }
}
</style>
