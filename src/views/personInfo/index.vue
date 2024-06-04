<script setup>
import { ref, onMounted } from "vue";
import dayjs from 'dayjs'
import { getUserDetail, getAttachmentFile, uploadFile } from '@/apis/index.js';
import { useDetail } from '@castle/castle-use';
import HeaderTitle from "@/component/HeaderTitle/index.vue";
import { getAttachUrl } from '@/utils/tools.js'

const form = ref({
  img: [],
})

const getAvatar = () => {
  getAttachmentFile({
    businessObjId: form.value.userId,
    businessType: 'userImage',
  }).then((res) => {
    if (res.data.length > 0) {
      const imgs = res.data.map(item => {
        return {
          ...item,
          createDate: dayjs(item.createDate)?.valueOf(),
        }
      }).sort((a, b) => {
        return b.createDate - a.createDate
      })
      form.value.img = [{
        ...imgs?.[0],
        uid: imgs?.[0]?.attachmentId,
        name: imgs?.[0]?.attachmentName,
        status: "done",
        isImage: true,
        url: `${getAttachUrl()}/acws/rest/app/attachments/${imgs?.[0]?.attachmentId}`,
      }]
    }
    else {
      form.value.img = []
    }
  })
}

const { detail, loadDetail } = useDetail({
  getDetailFn: () => getUserDetail().then((res) => {
    if (res) {
      form.value.userId = res.userId
      res.userRoles = res.userRoles?.filter(val => val.roleName)
      getAvatar()
    }
    return res
  }),
})

const onAfterRead = (file) => {
  const formData = new FormData()
  formData.append('businessId', form.value.userId)
  formData.append('attachmentType', 'userImage')
  formData.append('extend2', '照片')
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

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <div class="person-info">
    <HeaderTitle title="个人信息" />
    <van-cell-group>
      <van-cell title="头像" class="info-avatar">
        <template #default>
          <van-uploader
            v-model="form.img"
            accept="image/png, image/jpeg, image/jpg"
            preview-full-image
            name="img"
            preview-image
            :max-size="10 * 1000 * 1000000"
            :deletable="false"
            :show-upload="form.img?.length <= 0"
            reupload
            :max-count="1"
            :after-read="onAfterRead"
          />
        </template>
      </van-cell>
      <van-cell title="用户账号" :value="detail?.loginUserName" />
      <van-cell title="用户名称" :value="detail?.userName" />
      <van-cell title="所属部门" :value="detail?.ownerOrgName" />
      <van-cell title="所属角色" value-class="role-class" :value="detail?.userRoles?.map(val => val.roleName)?.join(',')" />
      <van-cell title="手机号码" :value="detail?.mobile" />
      <van-cell title="邮箱" :value="detail?.email" />
      <van-cell title="创建日期" :value="detail?.createTime" />
    </van-cell-group>
  </div>
</template>

<style lang="scss" scoped>
.person-info {
  .info-avatar {
    :deep(.van-cell__title) {
      display: flex;
      align-items: center;
    }
    :deep(.van-uploader__preview) {
      margin: 0 0;
    }
    :deep(.van-uploader__preview-image) {
      width: unset;
      height: unset;
    }
    :deep(.van-image__img) {
      width: 56px;
      height: 56px;
      border-radius: 50%;
    }
  }
}
</style>

<style>
.role-class {
  width: 250px !important;
  flex: none;
}
</style>
