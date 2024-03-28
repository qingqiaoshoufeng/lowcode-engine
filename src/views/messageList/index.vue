<template>
  <div class="fire-manage">
    <ProList
        ref="proListRef"
        :defaultFilterValue="defaultFilterValue"
        :getListFn="getMessageInfo"
        :onTabFn="onTabChangeFn"
        :tabs="tabs"
        title="我的消息"
        showExplain
      >
        <template v-slot:explain="">
          <div @click="handleUpdate" class="toReaded"> 全部设为已读</div>
        </template>
        <template #list="{ record }">
          <div class="list-item">
            <div class="item-header">
              <div class="item-title" :class="{unread:record.status === '1'}">{{formatYmdHm(record.createDate, 'YYYY-MM-DD HH:mm:ss') }}</div>
              <div class="item-state" v-if="record.status === '1'" :class="record.fireStatusValue" @click.stop="handleUpdate(record)">设为已读</div>
            </div>
            <div class="item-type">
              <span>{{ record.firePlaceValue }}</span>
            </div>
            <div class="item-field" @click="handleLook(record, $event)" v-html="textComputed(record)"></div>
          </div>
        </template>
    </ProList>
    <ProModal showBack v-model:visible="show.lookVisible" :showHeader="false" :title="title">
      <template #default="{ }">
        <LookFireWarning v-if="lookType === '1'" :current-row="currentRow" :is-detail="true"  />
        <DispatchForm v-if="lookType === '2'" :current-row="currentRow" :is-detail="true"  />
        <FireForm v-if="lookType === '3'" :current-row="currentRow" :is-detail="true"  />
      </template>
    </ProModal>
  </div>
</template>
  
<script setup>
import { computed, createVNode, onMounted, ref } from 'vue'
import { getMessageInfo, updateMessage } from '@/apis/index.js'
import { generateColorByState } from "@/utils/tools.js";

const messageStatistics = ref({})
const tabs = computed(()=>[
  {
    title: `未查看(${messageStatistics.value.unreadTotal || 0})`,
    value: 1,
  },
  {
    title: `近一周全部消息(${messageStatistics.value.total || 0})`,
    value:2,
  },
]);
import { formatYmdHm } from "@/utils/format.js";
import FireForm from '@/views/fire-report/components/EditorForm.vue'
import LookFireWarning from '@/views/policeEntryDetail/index.vue'
import DispatchForm from '@/views/dispatchReportForm/index.vue'
const currentRow = ref({})
const proListRef = ref(null);
const lookType = ref(null)
const title = ref('')
const defaultFilterValue = {
  status:1
}
const show = ref({})

const onTabChangeFn = (val)=>{
  const params = val === 1 ? {status:1} : {}
  proListRef.value.query = params
  proListRef.value.filter()
}

const getMessageStatistics = async()=>{
  const res = await getMessageInfo()
  messageStatistics.value = res
}
getMessageStatistics()

const handleLook = (row, e) => {
  const titleMap = ['','警情详情','出动填报详情','火灾填报详情']
  if (e.target.id !== 'warningCode' && e.target.id !== 'appCode') {
    return
  }
  currentRow.value = row
  if (e.target.id === 'warningCode') {
    lookType.value = '1'
  }
  if (e.target.id === 'appCode') {
    lookType.value = row.messageType
    if (row.messageType === '2') {
      currentRow.value.boFireDispatchId = row.appid
      currentRow.value.dispatchTypeValue = row.dispatchTypeValue
    }
    if (row.messageType === '3') {
      currentRow.value.boFireInfoId = row.appid
    }
  }
  title.value = titleMap[row.messageType] || '详情'
  show.value.lookVisible = true
}


const handleUpdate = (row) => {
  updateMessage({ id: row?.boUserMessageId }).then((res) => {
    getMessageStatistics()
    proListRef.value.filter()
  })
}


const textComputed = computed(() => (item) => {
  let text = item?.remark
  if (item.warningCode) {
    text = text.replace(item.warningCode, `<a style="color:#0072FF" type="link" id="warningCode">${item.warningCode}</a>`)
  }
  if (item.appCode) {
    text = text.replace(item.appCode, `<a style="color:#0072FF" type="link" style() id="appCode">${item.appCode}</a>`)
  }
  return text
})



</script>
  <style lang="scss" scoped>
  .fire-manage{
    .list-item {
      display: flex;
      flex-direction: column;
      background: #ffffff;
      margin-top: 10px;
      .item-header {
        display: flex;
        padding: 8px 10px;
        justify-content: space-between;
        .item-title {
          font-size: 12px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #929398;
          display: flex;
          align-items: center;
        }
        .item-state {
          font-size: 12px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #0075FF;
        }
      }
      .item-field{
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #08203E;
        padding: 0 11px 11px 11px;
      }
    }
  }
  .list-tabs1 {
    display: flex;
    padding: 10px 12px 0 12px;
  }
  .toReaded{
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
  }
  .unread{
    &::before{
      display: block;
      content: '';
      width: 7px;
      height: 7px;
      background: #FC2902;
      border-radius: 50%;
      margin-right: 3px;
    }
  }
  </style>