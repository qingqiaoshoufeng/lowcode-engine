<script setup>
import { inject, onMounted } from 'vue'
import { gutter } from '@/utils/constants.js'
import { useUpload } from '@/hooks/useUpload.js'
// import FieldAnnotation from '@/components/field-annotation/index.vue'
import { downloadAttachmentFile, getAttachmentFile } from '@/apis/index.js'

const form = inject('form')

const isDetail = inject('isDetail')

const showPreview = inject('showPreview')

const isEdit = inject('isEdit')

const currentRow = inject('currentRow')

const localFireInfoId = inject('localFireInfoId')

const relevanceDraft = inject('relevanceDraft')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const { onRemove } = useUpload()

onMounted(() => {
  if (isDetail || isEdit || (relevanceDraft && relevanceDraft.boFireInfoId) || currentRow?.boFireInfoId) {
    getAttachmentFile({
      businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId,
      businessType: 'file',
    }).then((res) => {
      form.value.otherAttach.attach.value = res.data.map((item) => {
        return {
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `/acws/rest/attachments/${item.attachmentId}`,
        }
      })
    })
  }
})
</script>

<template>
  <div id="otherAttach">
    <h4 id="otherAttach-title">
      <file-text-outlined />
      <strong>其他附件</strong>
    </h4>
    <div :gutter="gutter">
      <div :span="24">
        <a-form-item
          :name="['otherAttach', 'attach', 'value']"
          label="相关附件上传"
          :rules="form.otherAttach.attach.rules"
        >
          <a-upload
            id="attach"
            v-model:file-list="form.otherAttach.attach.value"
            name="file"
            :multiple="true"
            :max-count="3"
            action="/acws/rest/attachments"
            :data="{ businessId: currentRow?.boFireInfoId || localFireInfoId, attachmentType: 'file', extend2: '其他附件' }"
            :show-upload-list="isDetail ? { showRemoveIcon: false } : true"
            @remove="onRemove"
          >
            <a-button v-if="!isDetail && form.otherAttach.attach?.value?.length < 3">
              <upload-outlined />
              选择文件
            </a-button>
          </a-upload>
        </a-form-item>
      </div>
    </div>
    <div :gutter="gutter">
      <div :span="24">
        <van-field
          name="otherAttach,otherRemark,value"
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
        />
      </div>
    </div>
  </div>
</template>
