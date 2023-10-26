<script setup>
import { inject, onMounted } from "vue";
import { downloadAttachmentFile, getAttachmentFile, uploadFile } from "@/apis/index.js";
import ProCard from "@/component/ProCard/index.vue";

const form = inject("form");

const isDetail = inject("isDetail");

const showPreview = inject("showPreview");

const isEdit = inject("isEdit");

const currentRow = inject("currentRow");

const localFireDispatchId = inject("localFireDispatchId");

onMounted(() => {
  if (isDetail || isEdit || currentRow?.boFireDispatchId) {
    getAttachmentFile({
      businessObjId: currentRow?.boFireDispatchId,
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
  <ProCard title="其他附件">
    <van-cell-group>
      <div class="scene-photo">
        <van-cell title="相关附件上传：" required class="item-cell">
          <van-uploader
            v-model="form.otherAttach.attach.value"
            accept="*"
            multiple
            preview-full-image
            name="attach"
            :max-count="9"
            :max-size="10 * 1000 * 1000000"
            :readonly="isDetail"
            :deletable="!isDetail"
            :show-upload="form.scenePhoto.photos?.value?.length < 9 && !isDetail"
            :after-read="OnAfterRead"
          >
            <van-button v-if="form.scenePhoto.photos?.value?.length < 9 && !isDetail" icon="plus" size="small" type="primary">
              上传文件
            </van-button>
          </van-uploader>
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
