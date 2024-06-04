<script setup>
import { inject, nextTick, onMounted, ref, onUnmounted } from 'vue'
import { gutter } from '@/utils/constants.js'
import { useUpload } from '@/hooks/useUpload.js'
import { downloadAttachmentFile, getAttachmentFile,uploadFile  } from '@/apis/index.js'
// import FieldAnnotation from '@/components/field-annotation/index.vue'
import { getAttachUrl } from '@/utils/tools.js'
import { formatYmdHm } from "@/utils/format.js";

const form = inject('form')

const isDetail = inject('isDetail')

const isRequired = inject('isRequired')

const isShowTemporary = inject('isShowTemporary',false)

const isEdit = inject('isEdit')

const currentRow = inject('currentRow')

const localFireInfoId = inject('localFireInfoId')

const relevanceDraft = inject('relevanceDraft')

const showPreview = inject('showPreview')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const unDispatch = inject('unDispatch')

const initFireDetail = inject('initFireDetail')

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
  formData.append('businessId', relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId || localFireInfoId.value || localFireInfoId)
  formData.append('attachmentType', 'image')
  formData.append('extend2', '照片')
  formData.append('extend3', formatYmdHm(form.value.basicInfo.fireDate.value, 'YYYY年MM月DD日'))
  formData.append('file', file.file)
  await uploadFile(formData)
  getAttachmentFile({
    businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId || localFireInfoId.value || localFireInfoId,
    businessType: 'image',
  }).then((res) => {
    form.value.firePhoto.photos.value = res.data.map((item) => {
      return {
        isImage: true,
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

const onDelete = async(val,val1)=>{
  try {
    const res = await onRemove(val)
    getAttachmentFile({
      businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId || localFireInfoId.value || localFireInfoId,
      businessType: 'image',
    }).then((res) => {
      form.value.firePhoto.photos.value = res.data.map((item) => {
        return {
          isImage: true,
          deletable:!isDetail,
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: 'done',
          url: `${getAttachUrl()}/acws/rest/app/attachments/${item.attachmentId}`,
        }
      }).sort((a,b)=> (new Date(a.createDate)-(new Date(b.createDate))))
    })
  } catch (error) {
    getAttachmentFile({
      businessObjId: relevanceDraft?.boFireInfoId || currentRow?.boFireInfoId || localFireInfoId.value || localFireInfoId,
      businessType: 'image',
    }).then((res) => {
      form.value.firePhoto.photos.value = res.data.map((item) => {
        return {
          isImage: true,
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
})

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
</script>

<template>
  <van-cell-group class="rootform1">
    <div v-if="!(showPreview && form.firePhoto.isAllBack.value === '2') && !unDispatch" :gutter="gutter">
      <div :span="8">
        <van-field
          name="firePhoto.isAllBack.value"
          label="队伍是否全部中返："
          :required="isRequired"
          :rules="form.firePhoto.isAllBack.rules"
          class="field-radio"
          :class="{ 'field-not-required': !isRequired }"
        >
          <template #input>
            <van-radio-group 
              id="isAllBack"
              v-model="form.firePhoto.isAllBack.value"
              v-preview-text="showPreview"
              direction="horizontal"
            >
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="队伍是否全部中返："
              remark-field="isAllBack"
              field-module="firePhoto"
              :exist-data="fieldExist?.isAllBack"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
    </div>
    <div :gutter="gutter">
      <div :span="24">
        <van-cell
          title="火灾照片："
          class="item-cell"
          style="margin-left: 10px;"
          :required="(initFireDetail.dispatchArriveFlag === '2' || form.firePhoto.isAllBack.value === '1' || unDispatch) ? false : isRequired"
        >
          <van-field
            name="firePhoto.photos.value"
            :rules="(initFireDetail.dispatchArriveFlag === '2' || form.firePhoto.isAllBack.value === '1' || unDispatch) ? [{ required: false, message: '请选择火灾照片' }] : form.firePhoto.photos.rules"
            :required="(initFireDetail.dispatchArriveFlag === '2' || form.firePhoto.isAllBack.value === '1' || unDispatch) ? false : isRequired"
            label="火灾照片"
            label-width="0"
          >
            <template #input>
              <van-uploader
                v-model="form.firePhoto.photos.value"
                accept="image/png, image/jpeg, image/jpg"
                multiple
                preview-full-image
                preview-image
                :max-count="9"
                :max-size="10 * 1000 * 1000000"
                :readonly="isDetail"
                :deletable="!isDetail"
                :disabled="isDetail"
                :show-upload="form.firePhoto.photos?.value?.length < 9 && !isDetail"
                :after-read="OnAfterRead"
                @delete="onDelete"
                @click-preview="onOpenPreview"
                @close-preview="onClosePreview"
              />
            </template>
            <template v-slot:label="">
              <FieldAnnotation
                label=""
                remark-field="photos"
                field-module="firePhoto"
                :exist-data="fieldExist?.photos"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field>
        </van-cell>
        <span class="tip" v-if="!isDetail">只能上传 jpg/png 文件，最多9张且每张不超过10MB。</span>
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
  :deep(.van-field__label--required) {
    width: 0 !important;
    overflow: hidden;
  }
  &::after {
    display: none;
  }
}
.tip {
  padding: 0 16px 0 26px;
  display: block;
}
</style>
