<script setup>
import { onMounted, ref } from 'vue'
import { transferFire } from '@/apis/index.js'
import { showToast } from 'vant';
// import SelectTree from '@/components/select-tree/index1.vue'

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

const form = ref({
  team: [],
})

const formRef = ref(null)

onMounted(() => {
  props.setHandleOk((finishFn) => {
    formRef.value.validate().then((values) => {
      const fillReportOrg = form.value.team[0]?.organizationid
      transferFire({ boFireInfoId: props.currentRow.boFireInfoId, fillReportOrg })
        .then((res) => {
          if (res?.data?.code === 200) {
            emits('finishCallback')
            finishFn()
          }
          else {
            showToast(res?.data?.msg)
          }
        })
    })
  })
})
</script>

<template>
  <div class="transfer-task">
    <van-form ref="formRef" :model="form" label-align="right" :label-col="{ style: { width: '80px' } }">
      <span class="title">提示：轻微火灾才允许转派至队站填报，请确认！</span>
      <SelectOrg
        title="填报队伍"
        placeholder="请选择填报队伍"
        :params="{ permission: true }"
        :single="true"
        :selectLeaf= "true"
        :headersDisabled="true"
        v-model:value="form.team"
        :rules="[{ required: true, message: '请选择填报队伍' }]"
        teleport="body"
      />
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.transfer-task {
  .title {
    display: inline-block;
    font-weight: bold;
    padding-bottom: 12px;
    padding-top: 12px;
    font-size: 12px;
    margin-left: 20px;
  }
}
</style>
