<script setup>
import { inject } from "vue";
import ProCard from "@/component/ProCard/index.vue";

const form = inject("form");

const showPreview = inject("showPreview");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const refreshProcess = inject('refreshProcess')

const showDraft = inject('showDraft')

const isDetail = inject("isDetail")
</script>

<template>
  <ProCard title="处置经过" id="disposalProcess" :showOpenClose="!showPreview">
    <van-cell-group>
      <van-field
        v-model="form.disposalProcess.fireProcess.value"
        :readonly="showPreview"
        required
        name="disposalProcess.fireProcess.value"
        rows="4"
        autosize
        :label="showPreview ? '' : '处置经过：'"
        type="textarea"
        maxlength="2000"
        placeholder="请输入处置经过"
        :show-word-limit="!showPreview"
        :rules="form.disposalProcess.fireProcess.rules"
        :class="{ 'form-textarea': !showPreview }"
      >
        <template v-if="!showPreview" v-slot:label="">
          <FieldAnnotation
            label="处置经过："
            remark-field="fireProcess"
            field-module="disposalProcess"
            :exist-data="fieldExist?.fireProcess"
            @refresh-callback="refreshField"
          />
        </template>
        <template v-if="!showPreview && !showDraft" v-slot:right-icon="">
          <div class="refresh-btn" @click="refreshProcess"><van-icon size="small" name="replay" />一键更新</div>
        </template>
        <template v-if="showPreview && isDetail" v-slot:input="">
          <div>{{ form.disposalProcess.fireProcess.value }}</div>
        </template>
      </van-field>
    </van-cell-group>
  </ProCard>
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
    color: var(--van-primary-color);
    display: flex;
    align-items: center;
    position: absolute;
    top: -26px;
    left: 88px;
    border: 1px solid var(--van-primary-color);
    border-radius: 16px;
    padding: 0px 6px;
  }
}
</style>
