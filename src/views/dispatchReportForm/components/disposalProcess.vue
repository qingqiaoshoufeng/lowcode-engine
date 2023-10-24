<script setup>
import { inject } from "vue";

const form = inject("form");

const showPreview = inject("showPreview");
</script>

<template>
  <van-cell-group>
    <van-field
      v-model="form.disposalProcess.fireProcess.value"
      v-preview-text="showPreview"
      :readonly="showPreview"
      required
      name="fireProcess"
      rows="4"
      autosize
      label="处置经过："
      type="textarea"
      maxlength="1000"
      placeholder="请输入处置经过"
      show-word-limit
      :rules="form.disposalProcess.fireProcess.rules"
      :class="{ 'form-textarea': !showPreview }"
    />
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
}
</style>
