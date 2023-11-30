import { onMounted, ref, onUnmounted } from 'vue'
import { throttle } from 'lodash';

export const useIntersection = (classNames, wrapper = '.form-right', offset = 100) => {

  const sideBarActive = ref(1)

  const callback = () => {
    let visibleIndex = 0;
    let i = 0;
    let doms = [];
    const scrollTop = document.querySelector(wrapper).scrollTop;
    Object.keys(classNames.value).forEach((key) => {
      doms.push(classNames.value[key])
      classNames.value[key]?.children?.forEach(temp => {
        doms.push(temp)
      })
    })
    doms?.forEach(item => {
      const dom = document.querySelector(`#${item.link}`)
      if (dom?.offsetTop <= scrollTop + offset) {
        visibleIndex = i;
      }
      i += 1;
    })

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
