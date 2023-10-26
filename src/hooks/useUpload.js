import { createVNode, ref } from 'vue'
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

  const onRemove = (file) => {
    return new Promise((resolve, reject) => {
      // Modal.confirm({
      //   title: '确定删除该附件/照片吗，删除后将无法再使用！',
      //   icon: createVNode(ExclamationCircleOutlined),
      //   onOk: () => {
      //     deleteAttachmentFile({ attachmentId: file?.response?.attachmentId || file?.attachmentId }).then((res) => {
      //       if (res?.status === 204) {
      //         setTimeout(() => {
      //           initViewer()
      //         }, 1000)
      //         resolve(true)
      //       }
      //       else {
      //         // eslint-disable-next-line prefer-promise-reject-errors
      //         reject(false)
      //       }
      //     })
      //   },
      //   onCancel: () => {
      //     // eslint-disable-next-line prefer-promise-reject-errors
      //     reject(false)
      //   },
      // })
    })
  }

  return { initViewer, handlePreview, beforeUpload, onRemove }
}
