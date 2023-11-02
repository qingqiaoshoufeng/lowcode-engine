<script setup>
import { inject } from 'vue'
import { gutter } from '@/utils/constants.js'
// import FieldAnnotation from '@/components/field-annotation/index.vue'

const form = inject('form')

const showPreview = inject('showPreview')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')
</script>

<template>
  <van-cell-group class="rootform1">
    <div :gutter="gutter">
      <div :span="24">
        <van-field
          name="fireCourse,firePassage,value"
          label="起火经过"
          :rules="form.fireCourse.firePassage.rules"
          id="firePassage"
          v-model="form.fireCourse.firePassage.value"
          v-preview-text="showPreview"
          :required="true"
          :rows="6"
          :maxlength="1000"
          show-count
          allow-clear
          autosize
          type="textarea"
          placeholder="请输入起火经过"
        />
      </div>
    </div>
  </van-cell-group>
</template>
