import { onMounted, onUnmounted, ref } from 'vue'

export const useModal = () => {
  const show = ref({})

  onMounted(() => {
    show.value = {}
  })

  onUnmounted(() => {
    show.value = null
  })

  const showVisible = (key) => {
    show.value[key] = true
  }

  const hideVisible = (key) => {
    show.value[key] = false
  }

  return {
    show,
    showVisible,
    hideVisible,
  }
}
