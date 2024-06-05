import { onMounted, onUnmounted, ref } from 'vue'
import { getRoleList } from '@/apis/index.js'

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

  const checkNetwork = async () => {
    try {
      const res = await getRoleList()
      // eslint-disable-next-line no-console
      console.log('test network', res, res?.data)
      return res && res.data && res.data.code === 200
    } catch (error) {
      return false
    }
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
    checkNetwork,
  }
}
