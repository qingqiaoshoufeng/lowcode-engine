<script setup>
import { inject, nextTick, onMounted, ref } from 'vue'
import { gutter } from '@/utils/constants.js'
import { useUpload } from '@/hooks/useUpload.js'
import { downloadAttachmentFile, getAttachmentFile,uploadFile  } from '@/apis/index.js'
// import FieldAnnotation from '@/components/field-annotation/index.vue'

const form = inject('form')

const isDetail = inject('isDetail')

const isEdit = inject('isEdit')

const currentRow = inject('currentRow')

const localFireInfoId = inject('localFireInfoId')

const relevanceDraft = inject('relevanceDraft')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const {
  initViewer,
  handlePreview,
  beforeUpload,
  onRemove,
} = useUpload()

const onPreview = (file) => {
  form.value.firePhoto.photos.value?.forEach((item, i) => {
    if ((item.attachmentId || item.response?.attachmentId) === (file.attachmentId || file.response?.attachmentId)) {
      handlePreview(i)
    }
  })
}

const OnAfterRead = async(file) => {
  const formData = new FormData()
  formData.append('businessId', relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId)
  formData.append('attachmentType', 'image')
  formData.append('extend2', '火灾照片')
  formData.append('file', file.file)
  await uploadFile(formData)
  getAttachmentFile({
    businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId,
    businessType: 'image',
  }).then((res) => {
    form.value.firePhoto.photos.value = res.data.map((item) => {
      return {
        isImage: true,
        deletable:isDetail,
        ...item, 
        uid: item.attachmentId,
        name: item.attachmentName,
        status: 'done',
        url: `/acws/rest/attachments/${item.attachmentId}`,
      }
    }).sort((a,b)=> (new Date(a.createDate)-(new Date(b.createDate))))
  })
}
// const onChange = (file, fileList, event) => {
//   form.value.firePhoto.photos.value?.forEach((item, i) => {
//     debugger
//     if (!item.url && (item.attachmentId || item.response?.attachmentId)) {
//       item.url = `/acws/rest/attachments/${item.attachmentId || item.response?.attachmentId}`
//       item.thumbUrl = `/acws/rest/attachments/${item.attachmentId || item.response?.attachmentId}`
//     }
//   })
// }
const onDelete = async(val,val1)=>{
  const res = await onRemove(val)
  if(res === true){
    getAttachmentFile({
      businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId,
      businessType: 'image',
    }).then((res) => {
      form.value.firePhoto.photos.value = res.data.map((item) => {
        return {
          isImage: true,
          deletable:isEdit,
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `/acws/rest/attachments/${item.attachmentId}`,
        }
      }).sort((a,b)=> (new Date(a.createDate)-(new Date(b.createDate))))
    })
  }
}

onMounted(() => {
  if (isDetail || isEdit || (relevanceDraft && relevanceDraft.boFireInfoId) || currentRow?.boFireInfoId) {
    getAttachmentFile({
      businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId,
      businessType: 'image',
    }).then((res) => {
      form.value.firePhoto.photos.value = res.data.map((item) => {
        return {
          isImage: true,
          deletable:isEdit,
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `/acws/rest/attachments/${item.attachmentId}`,
        }
      }).sort((a,b)=> (new Date(a.createDate)-(new Date(b.createDate))))
    })
  }
})
</script>

<template>
  <div id="firePhoto">
    <h4 id="firePhoto-title">
      <!-- <file-text-outlined /> -->
      <strong>火灾照片</strong>
    </h4>
    <div :gutter="gutter">
      <div :span="24">
        <van-uploader
            name="firePhoto,photos,value"
            label="火灾照片"
            :rules="form.firePhoto.photos.rules"
            v-model="form.firePhoto.photos.value"
            accept="image/png, image/jpeg, image/jpg"
            multiple
            preview-full-image
            preview-image
            :max-count="9"
            :max-size="10 * 1000 * 1000000"
            :readonly="isDetail"
            :deletable="!isDetail"
            :show-upload="form.firePhoto.photos?.value?.length < 9 && !isDetail"
            :after-read="OnAfterRead"
            @delete="onDelete"
          />
          <span v-if="!isDetail">只能上传 jpg/png 文件，最多9张且每张不超过10MB。</span>
      </div>
    </div>
  </div>
</template>

