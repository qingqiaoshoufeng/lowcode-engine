<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { cloneDeep } from "lodash-es";
import { getSystemArea } from "@/apis/index.js";
import { showLoadingToast, closeToast } from 'vant';
import { findNodeFromTreeById } from '@/utils/tools.js';

const props = defineProps({
  width: {
    type: String,
    default: "200px",
  },
  label: {
    type: String,
    default: "行政区域：",
  },
  value: {
    type: [String, Array],
    default: "",
  },
  reportName: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: true,
  },
  rules: {
    type: Array,
    default: () => [],
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
  placeholder: {
    type: String,
    default: "请选择行政区域",
  },
  params: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:value", "change"]);

const areaOptions = ref([]);

const areaCascaderValue = ref('')

const areaValue = ref([]);

const areaText = ref("")

const selectVisible = ref(false);

watch(() => props.value, (newValue) => {
  if (newValue?.length > 0) {
    areaValue.value = cloneDeep(newValue);
    areaCascaderValue.value = cloneDeep(newValue)?.pop()
  } else {
    areaValue.value = []
    areaText.value = ''
  }
}, { immediate: true });

const returnLeaf = (item) => {
  let isLeaf = !item.hasChild;
  if (props.selectLevel > 0 && props.selectLevel === item.areaLvl) {
    isLeaf = true;
  }
  return isLeaf;
};

const returnChild = (item) => {
  return item.hasChild ? [] : undefined
}

watch(() => props.reportName, () => {
  getSystemArea({
    reportName: props.reportName,
    showAllArea: props.showAllArea,
    ...props.params,
  }).then((res) => {
    if (res) {
      areaOptions.value = res.map((item) => {
        return {
          ...item,
          isLeaf: returnLeaf(item),
        };
      });
    }
  });
}
);

onMounted(() => {
  if (props.value?.length > 1) {
    Promise.all([
      getSystemArea({
        reportName: props.reportName,
        showAllArea: props.showAllArea,
        ...props.params,
      }),
      getSystemArea({
        parentAreaId: props.value[0],
        reportName: props.reportName,
        showAllArea: props.showAllArea,
        ...props.params,
      }),
      getSystemArea({
        parentAreaId: props.value[1],
        reportName: props.reportName,
        showAllArea: props.showAllArea,
        ...props.params,
      }),
      getSystemArea({
        parentAreaId: props.value[2],
        reportName: props.reportName,
        showAllArea: props.showAllArea,
        ...props.params,
      }),
    ]).then((res) => {
      if (res[3] && res[3].length > 0) {
        res[2].forEach((item) => {
          if (item.boAreaId === props.value[2]) {
            item.children = res[3];
          }
          item.isLeaf = returnLeaf(item);
        });
      }
      if (res[2] && res[2].length > 0) {
        res[1].forEach((item) => {
          if (item.boAreaId === props.value[1]) {
            item.children = res[2];
          }
          item.isLeaf = returnLeaf(item);
        });
      }
      if (res[1]) {
        res[0].forEach((item) => {
          if (item.boAreaId === props.value[0]) {
            item.children = res[1];
          }
          item.isLeaf = returnLeaf(item);
        });
      }
      areaOptions.value = res[0].map((item) => {
        return {
          ...item,
          isLeaf: returnLeaf(item),
        };
      });
      areaText.value = areaValue.value?.map(item => {
        const temp = findNodeFromTreeById({ boAreaId: '-1', areaName: '-1', children: areaOptions.value }, item, 'boAreaId')
        return temp?.areaName
      })?.join('/')
    });
  } else {
    getSystemArea({
      reportName: props.reportName,
      showAllArea: props.showAllArea,
      ...props.params,
    }).then((res) => {
      if (res) {
        areaOptions.value = res.map((item) => {
          return {
            ...item,
            children: returnChild(item),
            isLeaf: returnLeaf(item),
          };
        });
      }
    });
  }
});

const onChange = ({value, selectedOptions, tabIndex}) => {
  if (selectedOptions?.length > 1 && !selectedOptions[selectedOptions.length - 1].hasChild) {
    return
  }
  const targetOption = selectedOptions[tabIndex];
  showLoadingToast()
  getSystemArea({
    parentAreaId: targetOption.boAreaId,
    reportName: props.reportName,
    showAllArea: props.showAllArea,
    ...props.params,
  }).then((res) => {
    if (res) {
      closeToast()
      targetOption.children = res.map((item) => {
        return {
          ...item,
          children: returnChild(item),
          isLeaf: returnLeaf(item),
        };
      });
    }
  });
};

const onFinish = ({ selectedOptions }) => {
  selectVisible.value = false;
  areaValue.value = selectedOptions.map((option) => option.boAreaId);
  areaText.value = selectedOptions.map((option) => option.areaName).join('/');
  emit("update:value", areaValue.value);
  emit("change", areaValue.value, selectedOptions);
};

defineOptions({
  name: "AreaCascader",
});
</script>
<script>
export default {
  name: 'AreaCascader',
}
</script>

<template>
  <van-field
    v-model="areaText"
    v-preview-text="showPreview"
    is-link
    v-bind="$attrs"
    :required="required"
    :readonly="readonly"
    :label="label"
    :placeholder="placeholder"
    :rules="rules"
    @click="selectVisible = true"
  />
  <!-- 弹窗 -->
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="select-wrapper">
      <van-cascader
        v-model="areaCascaderValue"
        :title="placeholder"
        :options="areaOptions"
        :field-names="{ value: 'boAreaId', text: 'areaName' }"
        :placeholder="placeholder"
        active-color="#1989fa"
        @close="selectVisible = false"
        @change="onChange"
        @finish="onFinish"
      />
    </div>
  </van-popup>
</template>

<style lang="scss">
.select-wrapper {
}
</style>
