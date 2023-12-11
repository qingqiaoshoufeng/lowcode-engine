<script setup>
import { inject, onMounted, ref } from 'vue'
import { useSubmit } from '@castle/castle-use'
import { showToast, showLoadingToast, closeToast } from "vant";
import { useDictName } from './checkConfig'
import { saveMySearchParams } from '@/apis/index.js'

const props = defineProps({
  currentIndex: {
    type: String,
    default: () => null,
  },
  setHandleOk: {
    type: Function,
  },
})

const emits = defineEmits(['finishCallback'])

const formRef = ref(null)

const form = ref({})

const list = inject('list')
const options = inject('options')

const { loading, submit } = useSubmit(() => {
  showToast('保存成功')
  emits('finishCallback')
}, {
  submitFn: () => {
    form.value.fieldText = useDictName(form.value.fieldType, options.value.fieldType)
    list.value[props.currentIndex] = form.value
  },
})

onMounted(() => {
  form.value = JSON.parse(JSON.stringify(list.value[props.currentIndex]))
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
  <div class="save-params">
    <a-form ref="formRef" :model="form" label-align="left" layout="vertical" autocomplete="off">
      <a-form-item
        name="fieldType"
        label="运算符"
        :rules="[{ required: true, message: '请选择运算符' }]"
      >
        <a-radio-group v-model:value="form.fieldType" button-style="solid">
          <a-radio-button v-for="item in options.fieldType" :key="item.boDictId" :value="item.boDictId">
            {{ item.dictName }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
.save-params {
  margin-right: 20px;
}
</style>
