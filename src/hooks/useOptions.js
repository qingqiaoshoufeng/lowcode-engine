import { onMounted, ref } from 'vue'

export const useOptions = (initial) => {
  const options = ref({})

  onMounted(() => {
    if (initial && typeof initial === 'object') {
      Object.keys(initial).forEach((item) => {
        options.value[item] = initial[item]
      })
    }
  })

  const setOptions = (key, options) => {
    options.value[key] = options
  }

  return {
    options,
    setOptions,
  }
}
