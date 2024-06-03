import { onMounted, onUnmounted, ref } from 'vue'

export const useCordovaINetwork = () => {
  const networkState = ref('online');

  function onLine() {
    networkState.value = 'online';
  }

  function onOffline() {
    networkState.value = 'offline';
  }

  function onDeviceReady() {
    document.addEventListener('online', onLine, false);
    document.addEventListener('offline', onOffline, false);
  }

  onMounted(() => {
    // 当网络状态发生变化时，更新网络状态
    if (window.cordova) {
      document.addEventListener('online', onLine, false);
      document.addEventListener('offline', onOffline, false);
    }
  })

  onUnmounted(() => {
    // 清理事件监听器
    if (window.cordova) {
      document.removeEventListener('online', onLine);
      document.removeEventListener('offline', onOffline);
    }
  })

  return {
    networkState,
  }
}
