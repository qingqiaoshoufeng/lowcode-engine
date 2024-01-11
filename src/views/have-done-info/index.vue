<template>
<div>
  <!-- <HeaderTitle :title="tabs.title" /> -->
  <ProList
    showTotal
    ref="proListRef"
    :defaultFilterValue="info.query"
    :getListFn="info.getListFn"
    :title="info.name"
  >
    <template #list="{ record }">
      <DispatchItem @click="handleItem(record)" :record="record" :type="type" v-if="type.startsWith('dispatch')"/>
      <FireItem @click="handleItem(record)" :record="record" :type="type" v-if="type.startsWith('fire')" />
      <PoliceItem @click="handleItem(record)" :record="record" :type="type" v-if="type.startsWith('police')" />
    </template>
  </ProList>
  <ProModal showBack v-model:visible="show.lookVisible" :showHeader="false" :title="title">
    <template #default="{}">
      <LookFireWarning v-if="lookType === 1" :current-row="currentRow" :is-detail="true"  />
      <DispatchForm v-if="lookType === 2" :current-row="currentRow" :is-detail="true"  />
      <FireForm v-if="lookType === 3" :current-row="currentRow" :is-detail="true"  />
    </template>
  </ProModal>
</div>
</template>
<script setup>
import {getInitInfo} from './config.js'
import store from '@/store/index.js'
import {ref} from 'vue'
import DispatchItem from './components/dispatchItem.vue'
import FireItem from './components/fireItem.vue'
import PoliceItem from './components/policeItem.vue'
import FireForm from '@/views/fire-report/components/EditorForm.vue'
import LookFireWarning from '@/views/policeEntryDetail/index.vue'
import DispatchForm from '@/views/dispatchReportForm/index.vue'
import { computed } from 'vue'
const orgLevel = store.state.userInfo?.userInfo?.ORGLEVEL

const props = defineProps({
  type:{
    type:String
  }
})

const lookType = computed(()=>{
  const list = ['','police','dispatch','fire']
  const index = list.findIndex((item)=>(item && props.type.startsWith(item)))
  return index
})
const title = computed(()=>{
  const list = ['','police','dispatch','fire']
  const titleMap = ['','警情详情','出动填报详情','火灾填报详情']
  const index = list.findIndex((item)=>(item && props.type.startsWith(item)))
  return titleMap[index]
})
const info = ref(getInitInfo(props.type,orgLevel))
const show = ref({})
const currentRow = ref({})
const handleItem = (record)=>{
  currentRow.value = record
  show.value.lookVisible =true
}

</script>
<style>
</style>