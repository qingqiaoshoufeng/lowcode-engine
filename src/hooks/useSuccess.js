import { createVNode } from 'vue'
// import { Modal } from '@castle/ant-design-vue'
// import { CheckCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

export const useSuccess = () => {
  const router = useRouter()

  const showSuccessModal = ({ title = '派发成功！', okText = '查看已派发', cancelText = '返回列表页', pathName, query }, fn) => {
    // Modal.confirm({
    //   title,
    //   icon: createVNode(CheckCircleOutlined, { style: 'color: #52c41a' }),
    //   okText,
    //   cancelText,
    //   onOk: (resolve) => {
    //     fn && fn()
    //     router.push({ name: pathName, query })
    //     resolve()
    //   },
    //   onCancel: (resolve) => {
    //     fn && fn()
    //     resolve()
    //   },
    // })
  }

  return {
    showSuccessModal,
  }
}
