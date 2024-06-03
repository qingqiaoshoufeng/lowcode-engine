import { onMounted, onUnmounted, ref } from 'vue'

export const useCordovaINetwork = () => {
  const networkState = ref('online')

  const onLine = () => {
    networkState.value = 'online';
  }

  const onOffline = () => {
    networkState.value = 'offline';
  }

  const onDeviceReady = () => {
    document.addEventListener('online', onLine, false);
    document.addEventListener('offline', onOffline, false);
  }

  onMounted(() => {
    // 当网络状态发生变化时，更新网络状态
    if (window.cordova) {
      document.addEventListener('deviceready', onDeviceReady, false);
    }
  })

  onUnmounted(() => {
    // 清理事件监听器
    if (window.cordova) {
      document.removeEventListener('deviceready', onDeviceReady);
      document.removeEventListener('online', onLine);
      document.removeEventListener('offline', onOffline);
    }
  })

  return {
    networkState,
  }
}
