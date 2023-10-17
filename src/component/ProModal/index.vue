<script setup>
import { watch, ref } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:visible'])

const loading = ref(false);

const showModal = ref(false);

watch(
  () => props.visible,
  (newValue) => {
    showModal.value = newValue;
  }
);

let handleOkFn = () => {
  showModal.value = false
  emit('update:visible', showModal.value)
}

const closeModal = () => {
  showModal.value = false;
  emit("update:visible", showModal.value);
};

const handleOk = async () => {
  handleOkFn(() => {
    closeModal();
  });
};

const setHandleOk = (fn, loadings) => {
  handleOkFn = fn;
  loading.value = loadings;
};

defineOptions({
  name: "ProModal",
});
</script>

<template>
  <div class="pro-modal" v-if="showModal">
    <slot name="default" :set-handle-ok="setHandleOk" />
    <div class="footer">
      <van-button type="default" size="small" style="margin-right: 10px;" @click="closeModal">取消</van-button>
      <van-button type="primary" size="small" @click="handleOk">确定</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pro-modal {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  background-color: white;
  :deep(.leaflet-bottom.leaflet-left) {
    bottom: 48px;
  }
  .footer {
    width: 100%;
    height: 48px;
    padding-right: 10PX;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: end;
    position: absolute;
    bottom: 0;
    z-index: 999;
  }
}
</style>