<script setup>
import { inject } from 'vue'
import { gutter } from '@/utils/constants.js'

const form = inject('form')
</script>

<template>
  <div id="briefSituation">
    <h4 id="briefSituation-title">
      <!-- <file-text-outlined /> -->
      <strong>简要情况</strong>
    </h4>
    <a-row :gutter="gutter">
      <a-col :span="24">
        {{ form.briefSituation.content.value }}
      </a-col>
    </a-row>
  </div>
</template>

