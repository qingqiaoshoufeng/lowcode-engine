<script setup>
import { inject, nextTick, onMounted, ref } from 'vue'
import { gutter } from '@/utils/constants.js'
// import { useUpload } from '@/hooks/useUpload.js'
import { downloadAttachmentFile, getAttachmentFile } from '@/apis/index.js'

const form = inject('form')

const isDetail = inject('isDetail')

const isEdit = inject('isEdit')

const currentRow = inject('currentRow')

const localFireDispatchId = inject('localFireDispatchId')

// const { initViewer, handlePreview, beforeUpload, onRemove } = useUpload(form.value.scenePhoto.photos)

const onPreview = (file) => {
  form.value.scenePhoto.photos.value?.forEach((item, i) => {
    if ((item.attachmentId || item.response?.attachmentId) === (file.attachmentId || file.response?.attachmentId)) {
      handlePreview(i)
    }
  })
}

const onChange = (file, fileList, event) => {
  form.value.scenePhoto.photos.value?.forEach((item, i) => {
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
  if (isDetail || isEdit || currentRow?.boFireDispatchId) {
    getAttachmentFile({
      businessObjId: currentRow?.boFireDispatchId,
      businessType: 'image',
    }).then((res) => {
      form.value.scenePhoto.photos.value = res.data.map((item) => {
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
  <van-cell-group> ??? </van-cell-group>
</template>
