<script setup>
import { inject, onMounted, ref } from "vue";
import { showToast, showDialog, showLoadingToast, closeToast } from 'vant';
import { deleteAttachmentFile, getAttachmentFile, uploadFile } from "@/apis/index.js";
import { downLoad } from '@/utils/download.js'
import ProCard from "@/component/ProCard/index.vue";
import { getAttachUrl } from '@/utils/tools.js'

const form = inject("form");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const isDetail = inject("isDetail");

const showPreview = inject("showPreview");

const isEdit = inject("isEdit");

const currentRow = inject("currentRow");

const localFireDispatchId = inject("localFireDispatchId");

const isOpen = ref((form.value.otherAttach.attach.value?.length > 0 || !isDetail))

const haveData = ref((form.value.otherAttach.attach.value?.length > 0 || !isDetail))

const initImages = () => {
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
  showLoadingToast({ message: '上传中...' });
  const formData = new FormData()
  formData.append('businessId', currentRow?.boFireDispatchId || localFireDispatchId)
  formData.append('attachmentType', 'file')
  formData.append('extend2', '其他附件')
  formData.append('file', file.file)
  return uploadFile(formData).then(res => {
    if (res?.attachmentId) {
      file.file.attachmentId = res.attachmentId
      file.file.attachmentName = res.attachmentName
      file.file.attachmentSize = res.attachmentSize
      file.file.fileType = res.fileType
      file.file.fullPath = res.fullPath
    }
    initImages()
    closeToast()
  }).catch(error => {
    closeToast()
    showToast('附件上传失败，请重试！')
    form.value.otherAttach.attach.value = form.value.otherAttach.attach.value?.filter(item => item.file.attachmentId)
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

const downLoadFile = (val)=>{
  if(isDetail) {
    downLoad(val)
  }
}
</script>

<template>
  <ProCard :title="haveData ? '其他附件' : '其他附件（无数据）'" id="otherAttach" :state="isOpen">
    <van-cell-group>
      <div class="other-attach">
        <van-cell title="相关附件上传：" name="otherAttach.attach.value" class="item-cell">
          <van-uploader
            v-model="form.otherAttach.attach.value"
            accept="*"
            preview-full-image
            name="otherAttach.attach.value"
            :max-count="9"
            :max-size="10 * 1000 * 1000000"
            :readonly="isDetail"
            :deletable="!isDetail"
            :show-upload="form.otherAttach.attach?.value?.length < 9 && !isDetail"
            :after-read="onAfterRead"
            :before-delete="onDelete"
            @click-preview="downLoadFile"
          >
            <van-button v-if="form.otherAttach.attach?.value?.length < 9 && !isDetail" icon="plus" size="small" type="primary">
              上传文件
            </van-button>
          </van-uploader>
          <template v-slot:title="">
            <FieldAnnotation
              label="相关附件上传："
              remark-field="attach"
              field-module="otherAttach"
              :exist-data="fieldExist?.attach"
              @refresh-callback="refreshField"
            />
          </template>
        </van-cell>
      </div>
    </van-cell-group>
  </ProCard>
</template>

<style lang="scss" scoped>
.other-attach {
  padding: 10px 0 0 10px;
  .item-cell {
    flex-direction: column;
    :deep(.van-cell__value) {
      display: flex;
    }
  }
}
</style>
