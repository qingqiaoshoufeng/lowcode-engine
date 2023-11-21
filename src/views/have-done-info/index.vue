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
      <DispatchItem :record="record" :type="type" v-if="type.startsWith('dispatch')"/>
      <FireItem :record="record" :type="type" v-if="type.startsWith('fire')" />
      <PoliceItem :record="record" :type="type" v-if="type.startsWith('police')" />
    </template>
  </ProList>
</div>
</template>
<script setup>
import {getInitInfo} from './config.js'
import store from '@/store/index.js'
import {ref} from 'vue'
import DispatchItem from './components/dispatchItem.vue'
import FireItem from './components/fireItem.vue'
import PoliceItem from './components/policeItem.vue'
const orgLevel = store.state.userInfo?.userInfo?.ORGLEVEL
console.log(store);
const props = defineProps({
  type:{
    type:String
  }
})
const info = ref(getInitInfo(props.type,orgLevel))

</script>
<style>
</style>