<script setup>
import { inject, onMounted } from "vue";
// import { useUpload } from "@/hooks/useUpload.js";
import { downloadAttachmentFile, getAttachmentFile } from "@/apis/index.js";

const form = inject("form");

const isDetail = inject("isDetail");

const showPreview = inject("showPreview");

const isEdit = inject("isEdit");

const currentRow = inject("currentRow");

const localFireDispatchId = inject("localFireDispatchId");

const relevanceDraft = inject("relevanceDraft");

// const { onRemove } = useUpload();

onMounted(() => {
  if (isDetail || isEdit || currentRow?.boFireDispatchId) {
    getAttachmentFile({
      businessObjId:
        relevanceDraft?.boFireDispatchId || currentRow?.boFireDispatchId,
      businessType: "file",
    }).then((res) => {
      form.value.otherAttach.attach.value = res.data.map((item) => {
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
  <van-cell-group> ??? </van-cell-group>
</template>
