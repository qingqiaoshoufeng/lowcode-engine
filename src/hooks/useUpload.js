import { createVNode, ref } from 'vue'
import { showConfirmDialog } from 'vant';
// import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
// import { Modal, message } from '@castle/ant-design-vue'
import Viewer from 'viewerjs'
import { deleteAttachmentFile } from '@/apis/index.js'

export const useUpload = () => {
  const viewer = ref(null)

  const initViewer = (className = '.ant-upload-list-picture-card') => {
    if (viewer.value) {
      viewer.value.update()
    }
    else {
      viewer.value = new Viewer(document.querySelector(className), {
        zIndex: 99999,
      })
    }
  }

  const handlePreview = (index) => {
    viewer.value.view(index)
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      // message.error('只能上传 jpg/png 图片!')
    }
    const isLt2M = file.size / 1024 / 1024 < 10
    if (!isLt2M) {
      // message.error('图片大小不能超过10MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const onRemove = async(file) => {
    const result = await showConfirmDialog({
      title: '标题',
      message:
        '如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。',
    })
    if(result === 'confirm'){
      const res = await deleteAttachmentFile({ attachmentId: file?.response?.attachmentId || file?.attachmentId })
      if (res?.status === 204) {
        return true
      }
      else {
        return false
      }
    }
    return true
  }

  return { initViewer, handlePreview, beforeUpload, onRemove }
}
