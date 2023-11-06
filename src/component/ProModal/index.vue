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
  },
  showBack: {
    type: Boolean,
    default: false,
  },
  leftBackFn: {
    type: Function,
  }
});

const emit = defineEmits(['update:visible'])

const loading = ref(false);

const showModal = ref(false);

watch(() => props.visible, (newValue) => {
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

const onLeftBack = () => {
  if (props.leftBackFn) {
    props.leftBackFn()
    return
  }
  showModal.value = false;
  emit('update:visible', showModal.value)
}

defineOptions({
  name: "ProModal",
});
</script>

<template>
  <div class="pro-modal" v-if="showModal">
    <div v-if="showBack" class="back" >
      <div class="arrow">
        <van-icon @click="onLeftBack" name="arrow-left" />
      </div>
      <div>{{ title }}</div>
    </div>
    <div class="header" v-if="showHeader">
      <van-button type="default" size="small" style="margin-right: 10px;" @click="closeModal">取消</van-button>
      <div class="modal-title">{{ title }}</div>
      <van-button type="primary" size="small" @click="handleOk">确定</van-button>
    </div>
    <div class="pro-wrapper">
      <slot name="default" :set-handle-ok="setHandleOk" :handle-ok="handleOk" :close-modal="closeModal" />
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
  .back {
    height: 44px;
    background: #0C207F;
    display: flex;
    position: relative;
    font-size: 18px;
    color: #fff;
    text-align: center;
    justify-content: center;
    align-items: center;
    .arrow{
      position: absolute;
      top: 50%;
      left: 16px;
      font-size: 18px;
      transform: translateY(-50%);
    }
  }
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
  .pro-wrapper {
    height: calc(100% - 44px);
  }
}
</style>