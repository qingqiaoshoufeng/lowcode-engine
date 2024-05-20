<template>
  <div class="first-page">
    <component :is="currentValue" />
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import Login from './login.vue'
import Authorization from './authorization.vue'
import { getParams } from '@/utils/tools.js'

const currentValue = shallowRef(null)

const params = getParams(location.href)
if (params && params.a2_ticket) {
  currentValue.value = Authorization
} else {
  currentValue.value = Login
}
</script>

<style lang="scss" scoped>
.first-page {
  width: 100vw;
  height: 100vh;
}
</style>
