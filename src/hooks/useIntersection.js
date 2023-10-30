import { onMounted, ref, onUnmounted } from 'vue'
import { useEventListener } from '@vueuse/core'

export const useIntersection = (classNames) => {

  const sideBarActive = ref(0)

  const doms = ref([])

  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  onMounted(() => {
    Object.keys(classNames.value)?.forEach(item => {
      const dom = document.querySelector(`#${item}`)
      if (dom) {
        doms.value.push(dom)
      }
    })

    // useEventListener(document, 'scroll', (evt) => {
    //   // 根据滚动位置计算当前可见区域对应的侧边栏项索引
    //   let visibleIndex = 0;
    //   for (let i = 0; i < doms.value.length; i++) {
    //     const item = doms.value[i];
    //     if (item.offsetTop <= scrollTop) {
    //       visibleIndex = i;
    //     } else {
    //       break;
    //     }
    //   }

    //   console.log('.....', visibleIndex)
    
    //   // 更新选中的侧边栏项索引
    //   sideBarActive.value = visibleIndex;
    // })
  })

  return { sideBarActive }
}
