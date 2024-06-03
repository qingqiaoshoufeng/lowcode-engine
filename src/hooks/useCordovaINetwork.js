import { onMounted, onUnmounted, ref } from 'vue'

export const useCordovaINetwork = (initial) => {
  const networkState = ref('')

  const onDeviceReady = () => {
    // 当网络状态发生变化时，更新网络状态
    if (window?.cordova?.plugins?.network) {
      window?.cordova?.plugins?.network?.addEventListener('online', () => {
        networkState.value = 'online';
      });
      window?.cordova?.plugins?.network?.addEventListener('offline', () => {
        networkState.value = 'offline';
      });
    }
  }

  onMounted(() => {
    document.addEventListener('deviceready', onDeviceReady, false);
  })

  onUnmounted(() => {
    // 清理事件监听器
    document.removeEventListener('deviceready', onDeviceReady, false);
    if (window?.cordova?.plugins?.network) {
      window?.cordova?.plugins?.network?.removeEventListener('online');
      window?.cordova?.plugins?.network?.removeEventListener('offline');
    }
  })

  return {
    networkState,
  }
}
