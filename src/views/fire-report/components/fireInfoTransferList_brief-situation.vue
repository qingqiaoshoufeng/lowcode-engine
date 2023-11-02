<script setup>
import { inject } from 'vue'
import { gutter } from '@/utils/constants.js'

const form = inject('form')
</script>

<template>
    <van-cell-group class="rootform1">
    <div :gutter="gutter">
      <div :span="24">
        {{ form.briefSituation.content.value}}
      </div>
    </div>
  </van-cell-group>
</template>

