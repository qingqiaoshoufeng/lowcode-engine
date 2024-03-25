<script setup>
import { inject } from 'vue'
import { gutter } from '@/utils/constants.js'
// import FieldAnnotation from '@/components/field-annotation/index.vue'

const form = inject('form')

const showPreview = inject('showPreview')

const isRequired = inject('isRequired')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const refreshProcess = inject('refreshProcess')

const showDraft = inject('showDraft')
</script>

<template>
  <van-cell-group>
    <div :gutter="gutter">
      <div :span="24">
        <van-field
          name="fireCourse.firePassage.value"
          label="起火经过："
          :rules="form.fireCourse.firePassage.rules"
          :required="isRequired"
          id="firePassage"
          v-model="form.fireCourse.firePassage.value"
          v-preview-text="showPreview"
          :rows="6"
          :maxlength="2000"
          show-count
          allow-clear
          autosize
          type="textarea"
          placeholder="请输入起火经过"
          :class="{ 'form-textarea': !showPreview }"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="起火经过："
              remark-field="firePassage"
              field-module="fireCourse"
              :exist-data="fieldExist?.firePassage"
              @refresh-callback="refreshField"
            />
          </template>
          <template v-if="!showPreview && !showDraft" v-slot:right-icon="">
            <div class="refresh-btn" @click="refreshProcess"><van-icon size="small" name="replay" />一键更新</div>
          </template>
        </van-field>
      </div>
    </div>
  </van-cell-group>
</template>

<style lang="scss" scoped>
.form-textarea {
  flex-direction: column;
  :deep(.van-field__body) {
    border: 1px solid #f6f6f6;
    padding: 5px 5px;
    margin-top: 5px;
  }
  .refresh-btn {
    font-size: 12px;
    color: #027AFF;
    display: flex;
    align-items: center;
    position: absolute;
    top: -26px;
    left: 88px;
    border: 1px solid #027AFF;
    border-radius: 16px;
    padding: 0px 6px;
  }
}
</style>
