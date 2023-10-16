<script setup>
import { onMounted, ref, watch } from 'vue'
import { getSystemArea } from '@/apis/index.js'

const props = defineProps({
  width: {
    type: String,
    default: '200px',
  },
  value: {
    type: [String, Array],
    default: '',
  },
  reportName: {
    type: String,
    default: '',
  },
  changeOnSelect: {
    type: Boolean,
    default: false,
  },
  showPreview: {
    type: Boolean,
    default: false,
  },
  showAllArea: {
    type: Boolean,
    default: false,
  },
  selectLevel: {
    type: Number,
    default: -1,
  },
  updateOptions: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '请选择行政区域',
  },
  params: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:value', 'change'])

const areaOptions = ref([])

const areaValue = ref(props.value)

watch(() => props.value, (newValue) => {
  areaValue.value = newValue
})

const returnLeaf = (item) => {
  let isLeaf = !item.hasChild
  if (props.selectLevel > 0 && props.selectLevel === item.areaLvl) {
    isLeaf = true
  }
  return isLeaf
}

watch(() => props.reportName, () => {
  getSystemArea({ reportName: props.reportName, showAllArea: props.showAllArea, ...props.params }).then((res) => {
    if (res) {
      areaOptions.value = res.map((item) => {
        return {
          ...item,
          isLeaf: returnLeaf(item),
        }
      })
    }
  })
})

const loadArea = (selectedOptions) => {
  const targetOption = selectedOptions[selectedOptions.length - 1]
  targetOption.loading = true
  getSystemArea({ parentAreaId: targetOption.boAreaId, reportName: props.reportName, showAllArea: props.showAllArea, ...props.params }).then((res) => {
    if (res) {
      targetOption.loading = false
      targetOption.children = res.map((item) => {
        return {
          ...item,
          isLeaf: returnLeaf(item),
        }
      })
    }
  })
}

const initOptions = () => {
  Promise.all([
    getSystemArea({ reportName: props.reportName, showAllArea: props.showAllArea, ...props.params }),
    getSystemArea({ parentAreaId: props.value[0], reportName: props.reportName, showAllArea: props.showAllArea, ...props.params }),
    getSystemArea({ parentAreaId: props.value[1], reportName: props.reportName, showAllArea: props.showAllArea, ...props.params }),
    getSystemArea({ parentAreaId: props.value[2], reportName: props.reportName, showAllArea: props.showAllArea, ...props.params }),
  ]).then((res) => {
    if (res[3] && res[3].length > 0) {
      res[2].forEach((item) => {
        if (item.boAreaId === props.value[2]) {
          item.children = res[3]
        }
        item.isLeaf = returnLeaf(item)
      })
    }
    if (res[2] && res[2].length > 0) {
      res[1].forEach((item) => {
        if (item.boAreaId === props.value[1]) {
          item.children = res[2]
        }
        item.isLeaf = returnLeaf(item)
      })
    }
    if (res[1]) {
      res[0].forEach((item) => {
        if (item.boAreaId === props.value[0]) {
          item.children = res[1]
        }
        item.isLeaf = returnLeaf(item)
      })
    }
    areaOptions.value = res[0].map((item) => {
      return {
        ...item,
        isLeaf: returnLeaf(item),
      }
    })
  })
}

if (props.updateOptions) {
  watch(() => props.value, () => {
    initOptions()
  })
}

onMounted(() => {
  if (props.value?.length > 0) {
    initOptions()
  }
  else {
    getSystemArea({ reportName: props.reportName, showAllArea: props.showAllArea, ...props.params }).then((res) => {
      if (res) {
        console.log(res)
        areaOptions.value = res?.data?.data?.map((item) => {
          return {
            ...item,
            isLeaf: returnLeaf(item),
          }
        })
      }
    })
  }
})

const onChange = (value, selectedOptions) => {
  emit('update:value', areaValue.value)
  emit('change', value, selectedOptions)
}

defineOptions({
  name: 'AreaCascader',
})
</script>

<template>
  <a-cascader
    ref="areaRef"
    v-model:value="areaValue"
    v-preview-text="showPreview && areaOptions?.length > 0"
    :options="areaOptions"
    :field-names="{ value: 'boAreaId', label: 'areaName' }"
    :load-data="loadArea"
    :style="{ width }"
    :change-on-select="changeOnSelect"
    expand-trigger="hover"
    show-arrow
    :placeholder="placeholder"
    @change="onChange"
  />
</template>
