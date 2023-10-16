<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { cloneDeep } from "lodash-es";
import { getSystemArea } from "@/apis/index.js";
import { Toast } from 'vant';

const props = defineProps({
  width: {
    type: String,
    default: "200px",
  },
  value: {
    type: [String, Array],
    default: "",
  },
  reportName: {
    type: String,
    default: "",
  },
  changeOnSelect: {
    type: Boolean,
    default: false,
  },
  preview: {
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

const areaValue = ref(props.value);

const areaText = ref("")

const selectVisible = ref(false);

watch(
  () => props.value,
  (newValue) => {
    areaValue.value = cloneDeep(newValue);
  }
);

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

watch(
  () => props.reportName,
  () => {
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
          children: returnChild(item),
          isLeaf: returnLeaf(item),
        };
      });
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
  const targetOption = selectedOptions[tabIndex];
  Toast.loading()
  getSystemArea({
    parentAreaId: targetOption.boAreaId,
    reportName: props.reportName,
    showAllArea: props.showAllArea,
    ...props.params,
  }).then((res) => {
    if (res) {
      Toast.clear()
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
    is-link
    readonly
    label="行政区划"
    :placeholder="placeholder"
    @click="selectVisible = true"
  />
  <!-- 弹窗 -->
  <van-popup v-model:show="selectVisible" round position="bottom">
    <div class="select-wrapper">
      <van-cascader
        v-model="areaValue"
        :options="areaOptions"
        :field-names="{ value: 'boAreaId', text: 'areaName' }"
        :placeholder="placeholder"
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
