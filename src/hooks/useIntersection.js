import { onMounted, ref, onUnmounted } from 'vue'
import { throttle } from 'lodash';

export const useIntersection = (classNames, wrapper = '.form-right', offset = 100) => {

  const sideBarActive = ref(0)

  const callback = () => {
    let visibleIndex = 0;
    let i = 0;
    const scrollTop = document.querySelector(wrapper).scrollTop;
    for (let key in classNames.value) {
      const dom = document.querySelector(`#${key}`)
      if (dom?.offsetTop <= scrollTop + offset) {
        visibleIndex = i;
      }
      i += 1;
    }
  
    // 更新选中的侧边栏项索引
    sideBarActive.value = visibleIndex;
  }

  onMounted(() => {
    document.querySelector(wrapper)?.addEventListener('scroll', throttle(callback, 100), true)
  })

  onUnmounted(() => {
    document.querySelector(wrapper)?.removeEventListener('scroll', throttle(callback, 100))
  })

  return { sideBarActive }
}
