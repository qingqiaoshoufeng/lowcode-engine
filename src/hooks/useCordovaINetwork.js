import { onMounted, onUnmounted, ref } from 'vue'

export const useCordovaINetwork = (initial) => {
  const networkState = ref('online')

  onMounted(() => {
    // 当网络状态发生变化时，更新网络状态
    if (window.cordova) {
      document.addEventListener('online', () => {
        networkState.value = 'online';
      });
      document.addEventListener('offline', () => {
        networkState.value = 'offline';
      });
    }
  })

  onUnmounted(() => {
    // 清理事件监听器
    if (window.cordova) {
      document.removeEventListener('online');
      document.removeEventListener('offline');
    }
  })

  return {
    networkState,
  }
}
