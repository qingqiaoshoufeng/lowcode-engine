<script setup>
import { inject, onMounted } from "vue";
// import { useUpload } from '@/hooks/useUpload.js'
import { downloadAttachmentFile, getAttachmentFile } from "@/apis/index.js";
import ProCard from "@/component/ProCard/index.vue";

const form = inject("form");

const isDetail = inject("isDetail");

const showPreview = inject("showPreview");

const isEdit = inject("isEdit");

const currentRow = inject("currentRow");

const localFireDispatchId = inject("localFireDispatchId");

// const { onRemove } = useUpload()

onMounted(() => {
  if (isDetail || isEdit) {
    getAttachmentFile({
      businessObjId: currentRow?.boFireDispatchId,
      businessType: "commandFile",
    }).then((res) => {
      form.value.commandProcess.attach.value = res.data.map((item) => {
        return {
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: "done",
          url: `/acws/rest/attachments/${item.attachmentId}`,
        };
      });
    });
  }
});
</script>

<template>
  <ProCard title="指挥过程">
    <van-cell-group>
      <van-field
        v-model="form.commandProcess.rescueMethod.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        name="rescueMethod"
        rows="4"
        autosize
        label="处置对策："
        type="textarea"
        maxlength="500"
        placeholder="请输入处置对策"
        show-word-limit
        :rules="form.commandProcess.rescueMethod.rules"
        :class="{ 'form-textarea': !showPreview }"
      />
      <van-field
        v-model="form.commandProcess.actionPlan.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        name="actionPlan"
        rows="4"
        autosize
        label="行动方案："
        type="textarea"
        maxlength="500"
        placeholder="请输入行动方案"
        show-word-limit
        :rules="form.commandProcess.actionPlan.rules"
        :class="{ 'form-textarea': !showPreview }"
      />
      <van-field
        v-model="form.commandProcess.commandProcess.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        name="commandProcess"
        rows="4"
        autosize
        label="过程描述："
        type="textarea"
        maxlength="500"
        placeholder="请输入过程描述"
        show-word-limit
        :rules="form.commandProcess.commandProcess.rules"
        :class="{ 'form-textarea': !showPreview }"
      />
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
}
</style>
