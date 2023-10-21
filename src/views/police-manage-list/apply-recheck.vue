<script setup>
import { computed, onMounted, ref } from 'vue'
// import { message } from '@castle/ant-design-vue'
import { useSubmit } from '@castle/castle-use'
import { v4 as uuidv4 } from 'uuid'
import { recheckFireWarning } from '@/apis/index.js'
import { useOptions } from '@/hooks/useOptions.js'
// import { useSuccess } from '@/hooks/useSuccess.js'
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

// const { showSuccessModal } = useSuccess()

const localFireRecheckId = uuidv4()

const tooltip = [
  '修改警情类型，请选择【重要信息更正】；修改警情其他信息选择【普通信息更正】',
  '修改受伤人数、死亡人数、过火面积，请选择【重要信息更正】；修改出动填报其他信息选择【普通信息更正】',
  '修改受伤人数、死亡人数、过火面积，请选择【重要信息更正】；修改火灾填报其他信息选择【普通信息更正】',
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
  // message.success('申请成功')
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
  await finishFn()
  // showSuccessModal({
  //   title: '申请更正成功！',
  //   okText: '查看申请记录',
  //   pathName: 'apply-record',
  //   query: {
  //     applyType: props.recheckType,
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
  <div class="apply-recheck">
    <van-form ref="formRef" @submit="onSubmit">
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
    <!-- <a-form ref="formRef" :model="form" label-align="right" :label-col="{ style: { width: '94px' } }" autocomplete="off">
      <a-form-item
        v-if="recheckType !== 2"
        name="applyType"
        label="申请类型"
        :rules="[{ required: true, message: `请选择申请类型` }]"
      >
        <a-select
          v-model:value="form.applyType"
          :options="options.applyType"
          placeholder="请选择申请类型"
        />
        <a-tooltip>
          <template #title>
            {{ tooltip[recheckType - 1] }}
          </template>
          <QuestionCircleOutlined class="form-col-delete" />
        </a-tooltip>
      </a-form-item>
    </a-form> -->
  </div>
</template>

<style lang="scss" scoped>
.apply-recheck {
  margin-right: 20px;
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
