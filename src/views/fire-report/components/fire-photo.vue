<script setup>
import { inject, nextTick, onMounted, ref } from 'vue'
import { gutter } from '@/utils/constants.js'
import { useUpload } from '@/hooks/useUpload.js'
import { downloadAttachmentFile, getAttachmentFile } from '@/apis/index.js'
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

const onChange = (file, fileList, event) => {
  form.value.firePhoto.photos.value?.forEach((item, i) => {
    if (!item.url && (item.attachmentId || item.response?.attachmentId)) {
      item.url = `/acws/rest/attachments/${item.attachmentId || item.response?.attachmentId}`
      item.thumbUrl = `/acws/rest/attachments/${item.attachmentId || item.response?.attachmentId}`
    }
  })
  setTimeout(() => {
    initViewer()
  }, 1000)
}

onMounted(() => {
  if (isDetail || isEdit || (relevanceDraft && relevanceDraft.boFireInfoId) || currentRow?.boFireInfoId) {
    getAttachmentFile({
      businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId,
      businessType: 'image',
    }).then((res) => {
      form.value.firePhoto.photos.value = res.data.map((item) => {
        return {
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `/acws/rest/attachments/${item.attachmentId}`,
        }
      })
      nextTick(() => {
        initViewer()
      })
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
        <van-field 
          name="firePhoto,photos,value" 
          label="火灾照片"
          :rules="form.firePhoto.photos.rules"
        >
          <template #input>
            <van-uploader v-model="value" />
          </template>
        </van-field>
        <!-- <a-form-item
          :name="['firePhoto', 'photos', 'value']"
          label="火灾照片"
          :rules="form.firePhoto.photos.rules"
        > -->
          <!-- <van-upload
            id="photos"
            v-model:file-list="form.firePhoto.photos.value"
            accept="image/png, image/jpeg, image/jpg"
            action="/acws/rest/attachments"
            list-type="picture-card"
            :data="{ businessId: currentRow?.boFireInfoId || localFireInfoId, attachmentType: 'image', extend2: '照片' }"
            :show-upload-list="isDetail ? { showRemoveIcon: false } : true"
            :before-upload="beforeUpload"
            @preview="onPreview"
            @remove="onRemove"
            @change="onChange"
          >
            <div v-if="form.firePhoto.photos.value?.length < 9 && !isDetail">
              <van-icon name="plus" />
            </div>
          </van-upload> -->
          <span v-if="!isDetail">只能上传 jpg/png 文件，最多9张且每张不超过10MB。</span>
        <!-- </a-form-item> -->
      </div>
    </div>
  </div>
</template>

