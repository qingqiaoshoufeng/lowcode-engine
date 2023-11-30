<script setup>
import { inject, onMounted } from 'vue'
import { gutter } from '@/utils/constants.js'
import { useUpload } from '@/hooks/useUpload.js'
// import FieldAnnotation from '@/components/field-annotation/index.vue'
import { downloadAttachmentFile, getAttachmentFile,uploadFile } from '@/apis/index.js'

const form = inject('form')

const isDetail = inject('isDetail')

const showPreview = inject('showPreview')

// const isRequired = inject('isRequired')

const isEdit = inject('isEdit')

const currentRow = inject('currentRow')

const localFireInfoId = inject('localFireInfoId')

const relevanceDraft = inject('relevanceDraft')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const { onRemove } = useUpload()

const onDelete = async(val,val1)=>{
  const res = await onRemove(val)
  if(res === true){
    getAttachmentFile({
      businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId,
      businessType: 'file',
    }).then((res) => {
      form.value.firePhoto.photos.value = res.data.map((item) => {
        return {
          isImage: true,
          deletable:isEdit || isShowTemporary.value,
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `/acws/rest/app/attachments/${item.attachmentId}`,
        }
      }).sort((a,b)=> (new Date(a.createDate)-(new Date(b.createDate))))
    })
  }
}

const OnAfterRead = async(file) => {
  const formData = new FormData()
  formData.append('businessId', currentRow?.boFireInfoId || localFireInfoId)
  formData.append('attachmentType', 'safetyFile')
  formData.append('extend2', '其他附件')
  formData.append('file', file.file)
  await uploadFile(formData) 
  getAttachmentFile({
    businessObjId: currentRow?.boFireInfoId || localFireInfoId,
    businessType: 'file',
  }).then((res) => {
    form.value.firePhoto.photos.value = res.data.map((item) => {
      return {
        isImage: true,
        deletable:!isDetail,
        ...item, 
        uid: item.attachmentId,
        name: item.attachmentName,
        status: 'done',
        url: `${process.env.VUE_APP_BASE_URL}/acws/rest/app/attachments/${item.attachmentId}`,
      }
    }).sort((a,b)=> (new Date(a.createDate)-(new Date(b.createDate))))
  })
}

onMounted(() => {
  if (isDetail || isEdit || (relevanceDraft && relevanceDraft.boFireInfoId) || currentRow?.boFireInfoId) {
    getAttachmentFile({
      businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId,
      businessType: 'file',
    }).then((res) => {
      form.value.otherAttach.attach.value = res.data.map((item) => {
        return {
          ...item,
          deletable:!isDetail,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `${process.env.VUE_APP_BASE_URL}/acws/rest/app/attachments/${item.attachmentId}`,
        }
      })
    })
  }
})
</script>

<template>
  <van-cell-group class="rootform1">
    <div :gutter="gutter">
      <div :span="24">
        <van-cell title="相关附件上传" class="item-cell">
          <van-uploader
            name="basicInfo.attach.value"
            :rules="form.otherAttach.attach.rules"
            id="attach"
            v-model="form.otherAttach.attach.value" 
            :after-read="OnAfterRead"
            @delete="onDelete"
          />
        </van-cell>
      </div>
    </div>
    <div :gutter="gutter">
      <div :span="24">
        <van-field
          name="otherAttach.otherRemark.value"
          label="补充说明"
          :rules="form.otherAttach.otherRemark.rules"
          id="otherRemark"
          v-model="form.otherAttach.otherRemark.value"
          v-preview-text="showPreview"
          :rows="6"
          :maxlength="1000"
          show-count
          allow-clear
          placeholder="请输入补充说明"
          autosize
          type="textarea"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="补充说明"
              remark-field="attach"
              field-module="otherAttach"
              :exist-data="fieldExist?.attach"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
       </div>
    </div>
  </van-cell-group>
</template>
<style lang="scss" scoped>
.item-cell {
    flex-direction: column;
    :deep(.van-cell__value) {
      display: flex;

    }
    &::after{
      display: none;
    }
  }
</style>
