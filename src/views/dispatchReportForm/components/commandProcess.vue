<script setup>
import { inject, onMounted } from "vue";
import { showDialog } from 'vant';
import { deleteAttachmentFile, downloadAttachmentFile, getAttachmentFile, uploadFile } from "@/apis/index.js";
import ProCard from "@/component/ProCard/index.vue";

const form = inject("form");

const isDetail = inject("isDetail");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const showPreview = inject("showPreview");

const isEdit = inject("isEdit");

const currentRow = inject("currentRow");

const localFireDispatchId = inject("localFireDispatchId");

onMounted(() => {
  if (isDetail || isEdit) {
    getAttachmentFile({
      businessObjId: currentRow?.boFireDispatchId,
      businessType: "commandFile",
    }).then((res) => {
      form.value.commandProcess.attach.value = res.data.map((item) => {
        return {
          ...item,
          uid: item.attachmentId,
          name: item.attachmentName,
          status: "done",
          url: `${process.env.VUE_APP_BASE_URL}/acws/rest/app/attachments/${item.attachmentId}`,
        };
      });
    });
  }
});

const onAfterRead = (file) => {
  const formData = new FormData()
  formData.append('businessId', currentRow?.boFireDispatchId || localFireDispatchId)
  formData.append('attachmentType', 'commandFile')
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
</script>

<template>
  <ProCard title="指挥过程" id="commandProcess" :showOpenClose="!showPreview">
    <van-cell-group>
      <van-field
        v-model="form.commandProcess.rescueMethod.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        name="commandProcess.rescueMethod.value"
        rows="4"
        autosize
        label="处置对策："
        type="textarea"
        maxlength="500"
        placeholder="请输入处置对策"
        show-word-limit
        :rules="form.commandProcess.rescueMethod.rules"
        :class="{ 'form-textarea': !showPreview }"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="处置对策："
            remark-field="rescueMethod"
            field-module="commandProcess"
            :exist-data="fieldExist?.rescueMethod"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-model="form.commandProcess.actionPlan.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        name="commandProcess.actionPlan.value"
        rows="4"
        autosize
        label="行动方案："
        type="textarea"
        maxlength="500"
        placeholder="请输入行动方案"
        show-word-limit
        :rules="form.commandProcess.actionPlan.rules"
        :class="{ 'form-textarea': !showPreview }"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="行动方案："
            remark-field="actionPlan"
            field-module="commandProcess"
            :exist-data="fieldExist?.actionPlan"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
      <van-field
        v-model="form.commandProcess.commandProcess.value"
        v-preview-text="showPreview"
        :readonly="showPreview"
        name="commandProcess.commandProcess.value"
        rows="4"
        autosize
        label="过程描述："
        type="textarea"
        maxlength="500"
        placeholder="请输入过程描述"
        show-word-limit
        :rules="form.commandProcess.commandProcess.rules"
        :class="{ 'form-textarea': !showPreview }"
      >
        <template v-slot:label="">
          <FieldAnnotation
            label="过程描述："
            remark-field="commandProcess"
            field-module="commandProcess"
            :exist-data="fieldExist?.commandProcess"
            @refresh-callback="refreshField"
          />
        </template>
      </van-field>
    </van-cell-group>
    <van-cell-group>
      <div class="other-attach">
        <van-cell title="相关附件上传：" name="commandProcess.attach.value" class="item-cell">
          <van-uploader
            v-model="form.commandProcess.attach.value"
            accept="*"
            preview-full-image
            name="commandProcess.attach.value"
            :max-count="9"
            :max-size="10 * 1000 * 1000000"
            :readonly="isDetail"
            :deletable="!isDetail"
            :show-upload="form.commandProcess.attach?.value?.length < 9 && !isDetail"
            :after-read="onAfterRead"
            :before-delete="onDelete"
          >
            <van-button v-if="form.commandProcess.attach?.value?.length < 9 && !isDetail" icon="plus" size="small" type="primary">
              上传文件
            </van-button>
          </van-uploader>
          <template v-slot:title="">
            <FieldAnnotation
              label="相关附件上传："
              :id="currentRow?.boFireWarningId"
              remark-field="attach"
              field-module="commandProcess"
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
.form-textarea {
  flex-direction: column;
  :deep(.van-field__body) {
    border: 1px solid #f6f6f6;
    padding: 5px 5px;
    margin-top: 5px;
  }
}
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
