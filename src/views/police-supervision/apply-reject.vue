<script setup>
import { onMounted, ref } from 'vue'
import { message } from '@castle/ant-design-vue'
import { useSubmit } from '@castle/castle-use'
import { rejectBatch } from '@/apis/index.js'
import {showToast} from 'vant'
import { rejectApplyType } from '@/utils/constants.js'
import store from '@/store/index.js'

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
    label: '分类错误',
    value: '分类错误',
  },
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

// 2:高级管理员 6:高级驳回 11:普通驳回
const roleIds = ref([])

const applyTypeFlag = ref(false)

const formRef = ref(null)

const form = ref({
  applyType: undefined,
  rejectCause: undefined,
  rejectRemark: '',
})

const { loading, submit } = useSubmit(() => {
  showToast('驳回成功!')
  emits('finishCallback')
}, {
  submitFn: () => {
    const { currentRow, type, selectedKeys } = props
    const { applyType, rejectCause, rejectRemark } = form.value
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
      applyType,
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
  roleIds.value = store.state.userInfo?.userInfo?.ROLELIST.map(val => val.roleId)
  applyTypeFlag.value = (roleIds.value.includes('6') && roleIds.value.includes('11')) || roleIds.value.includes('2')
  if (!applyTypeFlag.value) {
    if (roleIds.value.includes('6')) {
      form.value.applyType = '1'
    }
    if (roleIds.value.includes('11')) {
      form.value.applyType = '2'
    }
  }
})
</script>

<template>
<div class="apply-recheck">
  <div v-if="type !== '2'" class="tooltip">
    <img src="@/assets/images/icon_warning.png" alt="">
    <span style="margin-left: 10px;" v-if="type === '1'">
      将火警变更为其他警情，请选择【高级驳回】；修改其他警情信息可选择【普通驳回】
    </span>
    <span style="margin-left: 10px;" v-if="type === '3'">
      修改受伤人数、亡人数请选择【高级驳回】；修改其他火灾信息可选择【普通驳回】
    </span>
  </div>
  <van-form ref="formRef" :model="form" label-align="right" autocomplete="off">
    <SelectSingle
      v-if="type !== '2'"
      v-model:value="form.applyType"
      name="applyType"
      :options="rejectApplyType"
      :field-names="{ value: 'value', label: 'label' }"
      :required="true"
      title="驳回类型"
      label="驳回类型"
      label-width="85px"
      placeholder="请选择驳回类型"
      :disabled="!applyTypeFlag"
      :rules="[{ required: true, message: '请选择驳回类型' }]"
    />
    <SelectSingle
      name="rejectCause"
      label="驳回原因"
      label-width="85px"
      :rules="[{ required: true, message: `请选择驳回原因` }]"
      v-model:value="form.rejectCause" 
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
      label-width="85px"
      :rules="[{ required: true, message: '请输入驳回描述' }]"
      id="fileRemark"
      v-model="form.rejectRemark"
      :rows="4"
      :maxlength="500"
      show-word-limit
      show-count
      required
      allow-clear
      placeholder="请输入驳回描述"
      autosize
      type="textarea"
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
