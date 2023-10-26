<script setup>
import { watch, ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
  showHeader: {
    type: Boolean,
    default: true,
  }
});

const emit = defineEmits(['update:visible'])

const loading = ref(false);

const showModal = ref(false);

watch(() => props.visible,(newValue) => {
  showModal.value = newValue;
});

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
    <div class="header" v-if="showHeader">
      <van-button type="default" size="small" style="margin-right: 10px;" @click="closeModal">取消</van-button>
      <div class="modal-title">{{ title }}</div>
      <van-button type="primary" size="small" @click="handleOk">确定</van-button>
    </div>
    <slot name="default" :set-handle-ok="setHandleOk" :handle-ok="handleOk" :close-modal="closeModal" />
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
  .header {
    width: 100%;
    height: 44px;
    padding: 0 10px;
    background-color: white;
    display: flex;
    align-items: center;
    .modal-title {
      color: #242424;
      font-size: 16px;
      flex: 1;
      text-align: center;
    }
  }
}
</style>