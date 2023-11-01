import { nextTick, onMounted, ref } from 'vue'
import elementResizeEvent from 'element-resize-event'

export const useRerender = (className = '.ant-modal-content') => {
  const showCurrentDom = ref(true)

  onMounted(() => {
    nextTick(() => {
      elementResizeEvent(document.querySelector(className), () => {
        showCurrentDom.value = false
        setTimeout(() => {
          showCurrentDom.value = true
        }, 50)
      })
    })
  })

  return {
    showCurrentDom,
  }
}
