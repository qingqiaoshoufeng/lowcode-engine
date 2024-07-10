<script setup>
import { inject, onMounted, ref } from 'vue'
import { gutter } from '@/utils/constants.js'
import { useUpload } from '@/hooks/useUpload.js'
import ProCard from "@/component/ProCard/index.vue";
// import FieldAnnotation from '@/components/field-annotation/index.vue'
import { downloadAttachmentFile, getAttachmentFile,uploadFile } from '@/apis/index.js'
import { downLoad } from '@/utils/download.js'
import { getAttachUrl } from '@/utils/tools.js'
import { showToast, showDialog, showLoadingToast, closeToast } from 'vant';

const form = inject('form')

const isDetail = inject('isDetail')

const showPreview = inject('showPreview')

const isShowTemporary = inject('isShowTemporary', false)

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
 try {
  const res = await onRemove(val)
 } catch (error) {
  getAttachmentFile({
    businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId || localFireInfoId.value || localFireInfoId,
    businessType: 'file',
  }).then((res) => {
    form.value.otherAttach.attach.value = res.data.map((item) => {
      return {
        deletable:isEdit || isShowTemporary.value,
        ...item,
        uid: item.attachmentId,
        name: item.attachmentName,
        status: 'done',
        url: `${getAttachUrl()}/acws/rest/app/attachments/${item.attachmentId}`,
      }
    }).sort((a,b)=> (new Date(a.createDate)-(new Date(b.createDate))))
  })
 }
  getAttachmentFile({
    businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId || localFireInfoId.value || localFireInfoId,
    businessType: 'file',
  }).then((res) => {
    form.value.otherAttach.attach.value = res.data.map((item) => {
      return {
        deletable:isEdit || isShowTemporary.value,
        ...item,
        uid: item.attachmentId,
        name: item.attachmentName,
        status: 'done',
        url: `${getAttachUrl()}/acws/rest/app/attachments/${item.attachmentId}`,
      }
    }).sort((a,b)=> (new Date(a.createDate)-(new Date(b.createDate))))
  })
}

const OnAfterRead = async(file) => {
  showLoadingToast({ message: '上传中...' });
  const formData = new FormData()
  formData.append('businessId', currentRow?.boFireInfoId || localFireInfoId.value || localFireInfoId)
  formData.append('attachmentType', 'file')
  formData.append('extend2', '其他附件')
  formData.append('file', file.file)
  return uploadFile(formData)
    .then(response => {
      if (response?.attachmentId) {
        getAttachmentFile({
          businessObjId: currentRow?.boFireInfoId || localFireInfoId.value || localFireInfoId,
          businessType: 'file',
        }).then((res) => {
          form.value.otherAttach.attach.value = res.data.map((item) => {
            return {
              deletable:!isDetail,
              ...item, 
              uid: item.attachmentId,
              name: item.attachmentName,
              status: 'done',
              url: `${getAttachUrl()}/acws/rest/app/attachments/${item.attachmentId}`,
            }
          }).sort((a,b)=> (new Date(a.createDate)-(new Date(b.createDate))))
        })
      }
      closeToast()
    })
    .catch(error => {
      closeToast()
      showToast('附件上传失败，请重试！')
      form.value.otherAttach.attach.value = form.value.otherAttach.attach.value?.filter(item => item.file.attachmentId)
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
      businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId || localFireInfoId.value || localFireInfoId,
      businessType: 'file',
    }).then((res) => {
      form.value.otherAttach.attach.value = res.data.map((item) => {
        return {
          ...item,
          deletable:!isDetail,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `${getAttachUrl()}/acws/rest/app/attachments/${item.attachmentId}`,
        }
      })
      haveData.value = !!res.data?.length
    })
  }
})
</script>

<template>
  <ProCard :title="haveData ? '其他附件' : '其他附件（无数据）'" id="otherAttach" :state="isOpen">
    <van-cell-group class="rootform1">
      <div :gutter="gutter">
        <div :span="24">
          <van-cell title="相关附件上传" class="item-cell" style="margin-left: 10px;">
            <van-uploader
              v-model="form.otherAttach.attach.value"
              accept="*"
              preview-full-image
              name="basicInfo.attach.value"
              :max-count="9"
              :max-size="10 * 1000 * 1000000"
              :readonly="isDetail"
              :deletable="!isDetail"
              :show-upload="form.otherAttach.attach?.value?.length < 9 && !isDetail"
              :after-read="OnAfterRead"
              :before-delete="onDelete"
              @click-preview="downLoadFile"
              :rules="form.otherAttach.attach.rules"
              :disabled="isDetail"
            >
              <van-button v-if="form.otherAttach.attach?.value?.length < 9 && !isDetail" icon="plus" size="small" type="primary">
                上传文件
              </van-button>
            </van-uploader>
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
            :class="{ 'field-not-required': true }"
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
