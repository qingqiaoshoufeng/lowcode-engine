<script setup>
import { inject, nextTick, onMounted, ref } from "vue";
import { downloadAttachmentFile, getAttachmentFile, uploadFile } from "@/apis/index.js";
import ProCard from "@/component/ProCard/index.vue";

const form = inject("form");

const isDetail = inject("isDetail");

const isEdit = inject("isEdit");

const currentRow = inject("currentRow");

const localFireDispatchId = inject("localFireDispatchId");

const onChange = (file, fileList, event) => {
  form.value.scenePhoto.photos.value?.forEach((item, i) => {
    if (!item.url && (item.attachmentId || item.response?.attachmentId)) {
      item.url = `/acws/rest/attachments/${
        item.attachmentId || item.response?.attachmentId
      }`;
      item.thumbUrl = `/acws/rest/attachments/${
        item.attachmentId || item.response?.attachmentId
      }`;
    }
  });
  setTimeout(() => {
    initViewer();
  }, 1000);
};

onMounted(() => {
  if (isDetail || isEdit || currentRow?.boFireDispatchId) {
    getAttachmentFile({
      businessObjId: currentRow?.boFireDispatchId,
      businessType: "image",
    }).then((res) => {
      form.value.scenePhoto.photos.value = res.data.map((item) => {
        return {
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: "done",
          isImage: true,
          url: `/acws/rest/attachments/${item.attachmentId}`,
        };
      });
    });
  }
});

const OnAfterRead = (file) => {
  const formData = new FormData()
  formData.append('businessId', currentRow?.boFireDispatchId || localFireDispatchId)
  formData.append('attachmentType', 'image')
  formData.append('extend2', '照片')
  formData.append('file', file.file)
  return uploadFile(formData)
}
</script>

<template>
  <ProCard title="现场照片">
    <van-cell-group>
      <div class="scene-photo">
        <van-cell title="出动现场照片：" required class="item-cell">
          <van-uploader
            v-model="form.scenePhoto.photos.value"
            accept="image/png, image/jpeg, image/jpg"
            multiple
            preview-full-image
            name="photos"
            preview-image
            :max-count="9"
            :max-size="10 * 1000 * 1000000"
            :readonly="isDetail"
            :deletable="!isDetail"
            :show-upload="form.scenePhoto.photos?.value?.length < 9 && !isDetail"
            :after-read="OnAfterRead"
          />
        </van-cell>
      </div>
    </van-cell-group>
  </ProCard>
</template>

<style lang="scss" scoped>
.scene-photo {
  padding: 10px 0 0 10px;
  .item-cell {
    flex-direction: column;
    :deep(.van-cell__value) {
      display: flex;
    }
  }
}
</style>
