<script setup>
import { onMounted } from 'vue'
import { useDetail } from '@castle/castle-use'
import { getRemarkReason } from '@/apis/index.js'
import { formatYmdHm } from '@/utils/tools.js'

const props = defineProps({
  dataType: {
    type: Number,
    default: 1,
  },
  currentRow: {
    type: Object,
    default: () => {},
  },
})

const { detail, loadDetail } = useDetail({
  getDetailFn: () => {
    const { boFireInfoId, boFireDispatchId, boFireWarningId } = props.currentRow
    return getRemarkReason({
      dataId: boFireInfoId || boFireDispatchId || boFireWarningId,
      dataType: props.dataType,
    })
  },
})

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <div class="look-reason">
    <van-cell title="备注人" :value="detail?.createUserName"  />
    <van-cell title="单位" :value="detail?.createOrgName" />
    <van-cell title="备注时间" :value="formatYmdHm(detail?.updateDate)" />
    <van-cell title="超时原因" :value="detail?.remarkContent"  />
  </div>
</template>

<style lang="scss" scoped> 
.look-reason {
  height: 100%;
  overflow-y: auto;
}
</style>
