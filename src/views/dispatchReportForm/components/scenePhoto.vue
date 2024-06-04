<script setup>
import { inject, nextTick, onMounted, ref, onUnmounted } from "vue";
import { showDialog } from 'vant';
import { deleteAttachmentFile, getAttachmentFile, uploadFile } from "@/apis/index.js";
import ProCard from "@/component/ProCard/index.vue";
import { getAttachUrl } from '@/utils/tools.js'
import { formatYmdHm } from "@/utils/format.js";

const form = inject("form");

const isDetail = inject("isDetail");

const detail = inject("detail");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const isEdit = inject("isEdit");

const currentRow = inject("currentRow");

const showPreview = inject("showPreview");

const localFireDispatchId = inject("localFireDispatchId");

const onChange = (file, fileList, event) => {
  form.value.scenePhoto.photos.value?.forEach((item, i) => {
    if (!item.url && (item.attachmentId || item.response?.attachmentId)) {
      item.url = `${getAttachUrl()}/acws/rest/app/attachments/${
        item.attachmentId || item.response?.attachmentId
      }`;
      item.thumbUrl = `${getAttachUrl()}/acws/rest/app/attachments/${
        item.attachmentId || item.response?.attachmentId
      }`;
    }
  });
  setTimeout(() => {
    initViewer();
  }, 1000);
};

const initImages = () => {
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
        url: `${getAttachUrl()}/acws/rest/app/attachments/${item.attachmentId}`,
      };
    });
  });
}

onMounted(() => {
  if (isDetail || isEdit || currentRow?.boFireDispatchId) {
    initImages()
  }
});

const onAfterRead = (file) => {
  const formData = new FormData()
  formData.append('businessId', currentRow?.boFireDispatchId || localFireDispatchId)
  formData.append('attachmentType', 'image')
  formData.append('extend2', '照片')
  formData.append('extend3', formatYmdHm(detail.value?.warningDate, 'YYYY年MM月DD日'))
  formData.append('file', file.file)
  return uploadFile(formData).then(res => {
    if (res?.attachmentId) {
      file.file.url = `${getAttachUrl()}/acws/rest/app/attachments/${res.attachmentId}`
      file.file.uid = res.attachmentId
      file.file.attachmentId = res.attachmentId
      file.file.attachmentName = res.attachmentName
      file.file.attachmentSize = res.attachmentSize
      file.file.fileType = res.fileType
      file.file.fullPath = res.fullPath
    }
    initImages()
  })
}

const onDelete = (file) => {
  return new Promise((resolve, reject) => {
    showDialog({
      message: '确定删除该附件/照片吗，删除后将无法再使用！',
      showConfirmButton: true,
      showCancelButton: true,
    }).then(() => {
      deleteAttachmentFile({ attachmentId: file?.attachmentId || file?.file?.attachmentId }).then((res) => {
        if (res?.status === 204) {
          resolve(true)
        }
        else {
          reject(false)
        }
      })
    }).catch((error) => {
      reject(false)
    });
  })
}

const onOpenPreview = () => {
  // 在应急部app内，预览图片时开启水印
  if (window.ecpot) {
    window.ecpot.showWatermark();
  }
}

const onClosePreview = () => {
  if (window.ecpot) {
    window.ecpot.hideWatermark();
  }
}

onUnmounted(() => {
  if (window.ecpot) {
    window.ecpot.hideWatermark();
  }
})

const onClickUpload = () => {
  if (window.ecpot) {
    window.ecpot.chooseMedia({
      take: false,
      multi: false,
    });
  }
}
</script>

<template>
  <ProCard title="现场照片" id="scenePhoto" :showOpenClose="!showPreview">
    <van-cell-group>
      <div class="scene-photo">
        <van-cell title="现场照片：" name="scenePhoto.photos.value" required class="item-cell">
          <van-field
              name="scenePhoto.photos.value"
              :rules="form.scenePhoto.photos.rules"
              :required="true"
            >
            <template #input>
              <van-uploader
                v-model="form.scenePhoto.photos.value"
                accept="image/png, image/jpeg, image/jpg"
                preview-full-image
                name="scenePhoto.photos.value"
                preview-image
                :max-count="9"
                :max-size="10 * 1000 * 1000000"
                :readonly="isDetail"
                :deletable="!isDetail"
                :show-upload="form.scenePhoto.photos?.value?.length < 9 && !isDetail"
                :after-read="onAfterRead"
                :before-delete="onDelete"
                @click-preview="onOpenPreview"
                @close-preview="onClosePreview"
              />
            </template>
            <template v-slot:title="">
              <FieldAnnotation
                label="相关附件上传："
                remark-field="photos"
                field-module="scenePhoto"
                :exist-data="fieldExist?.photos"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
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
