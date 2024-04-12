<script setup>
import { inject, onMounted, ref } from 'vue'
import { gutter } from '@/utils/constants.js'
import { useUpload } from '@/hooks/useUpload.js'
import ProCard from "@/component/ProCard/index.vue";
// import FieldAnnotation from '@/components/field-annotation/index.vue'
import { downloadAttachmentFile, getAttachmentFile,uploadFile } from '@/apis/index.js'
import {downLoad} from '@/utils/download.js'

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

const isOpen = ref((((form.value.otherAttach.attach.value && form.value.otherAttach.attach.value.length) || form.value.otherAttach.otherRemark.value) || !isDetail))

const haveData = ref((((form.value.otherAttach.attach.value && form.value.otherAttach.attach.value.length) || form.value.otherAttach.otherRemark.value) || !isDetail))

const { onRemove } = useUpload()

const onDelete = async(val,val1)=>{
  const res = await onRemove(val)
  getAttachmentFile({
    businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId,
    businessType: 'file',
  }).then((res) => {
    form.value.otherAttach.attach.value = res.data.map((item) => {
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

const OnAfterRead = async(file) => {
  const formData = new FormData()
  formData.append('businessId', currentRow?.boFireInfoId || localFireInfoId)
  formData.append('attachmentType', 'file')
  formData.append('extend2', '其他附件')
  formData.append('file', file.file)
  await uploadFile(formData) 
  getAttachmentFile({
    businessObjId: currentRow?.boFireInfoId || localFireInfoId,
    businessType: 'file',
  }).then((res) => {
    form.value.otherAttach.attach.value = res.data.map((item) => {
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
const downLoadFile = (val)=>{
  if(isDetail){
    downLoad(val)
  }
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
  <ProCard :title="haveData ? '其他附件' : '其他附件（无数据）'" id="otherAttach" :state="isOpen">
    <van-cell-group class="rootform1">
      <div :gutter="gutter">
        <div :span="24">
          <van-cell title="相关附件上传" class="item-cell">
            <van-uploader
              :readonly="isDetail"
              :deletable="!isDetail"
              :show-upload="form.otherAttach.attach?.value?.length < 9 && !isDetail"
              :before-delete="onDelete"
              @click-preview="downLoadFile"
              name="basicInfo.attach.value"
              :rules="form.otherAttach.attach.rules"
              :disabled="isDetail"
              preview-full-image
              :max-count="9"
              accept="*"
              :max-size="10 * 1000 * 1000000"
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
            @click-preview="downLoadFile"
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
  </ProCard>
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
