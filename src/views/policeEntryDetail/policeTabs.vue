<script setup>
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { generateTextByState } from '@/utils/tools.js'

const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  selectTabRow: {
    type: Object,
    default: () => {},
  },
})

const emits = defineEmits(['finishCallback'])

const selectIndex = ref(0)

const selectItem = ref(props.selectTabRow)

const popVisible = ref(false)

watch(() => props.selectTabRow, () => {
  const { tabs, selectTabRow } = props
  if (tabs?.length >= 0) {
    tabs.forEach((item, index) => {
      if ((selectTabRow?.boFireInfoId && (selectTabRow?.boFireInfoId === item.boFireInfoId))
        || (selectTabRow?.boFireDispatchId && (selectTabRow?.boFireDispatchId === item.boFireDispatchId))) {
        selectIndex.value = index
        selectItem.value = item
      }
    })
  }
  if (selectTabRow) {
    selectItem.value = selectTabRow
  }
  popVisible.value = false
}, { deep: true })

const preTabs = computed(() => {
  if (!popVisible.value) {
    return props.tabs.slice(0, 1)
  }
  return props.tabs
})

const onShowMore = () => {
  popVisible.value = !popVisible.value
}

const onTabsChange = (index) => {
  selectIndex.value = index
  selectItem.value = props.tabs[index]
  popVisible.value = false
  emits('finishCallback', props.tabs[index])
}
</script>

<template>
  <div class="police-tabs" :class="{ 'police-tabs-line': preTabs?.length > 0 }" @click.stop>
    <div v-if="selectItem" class="top-row">
      <div class="police-tabs-item police-tabs-item-active">
        <div class="title">
          <template v-if="selectItem?.type === 1">
            <img src="@/assets/images/icon_tabs_police@2x.png">
          </template>
          <template v-else-if="selectItem?.type === 5">
            <img src="@/assets/images/icon_tabs_fire@2x.png">
          </template>
          <template v-else-if="selectItem?.type === 2">
            <img src="@/assets/images/icon_tabs_main@2x.png">
          </template>
          <template v-else-if="selectItem?.type === 3">
            <img src="@/assets/images/icon_tabs_zeng@2x.png">
          </template>
          <template v-else-if="selectItem?.type === 4">
            <img src="@/assets/images/icon_tabs_header@2x.png">
          </template>
        </div>
        <div class="right">
          <template v-if="selectItem?.type === 1">
            <div class="dispatch-org">
              {{ selectItem?.distributeOrgName }}
            </div>
          </template>
          <template v-else-if="selectItem?.type === 5">
            <div class="dispatch-org">
              {{ selectItem?.distributeOrgName }}
            </div>
          </template>
          <template v-if="selectItem?.type === 2 || selectItem?.type === 3 || selectItem?.type === 4">
            <div class="dispatch-org">
              {{ selectItem?.distributeOrgName }}
            </div>
          </template>
          <template v-if="selectItem?.type === 1">
            <div class="time">
              填报时间：{{ dayjs(selectItem?.createDate).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
          <template v-else-if="selectItem?.type === 5">
            <div v-if="selectItem?.commitDate" class="time">
                填报时间：{{ selectItem?.commitDate ? dayjs(selectItem?.commitDate).format('YYYY-MM-DD HH:mm:ss') : '' }}
              </div>
            <div v-else class="time">
              填报时间：
            </div>
          </template>
          <template v-if="selectItem?.type === 2 || selectItem?.type === 3 || selectItem?.type === 4">
            <div v-if="selectItem?.commitDate" class="time">
                填报时间：{{ selectItem?.commitDate ? dayjs(selectItem?.commitDate).format('YYYY-MM-DD HH:mm:ss') : '' }}
              </div>
            <div v-else class="time">
              填报时间：
            </div>
          </template>
          <div style="font-size: 12px;">
            报告状态：
            <span
              v-if="selectItem?.warningStatusValue || selectItem?.dispatchStatusValue || selectItem?.fireStatusValue"
              :class="generateTextByState(selectItem?.warningStatusValue || selectItem?.dispatchStatusValue || selectItem?.fireStatusValue)"
            >
              {{ selectItem?.warningStatusValue || selectItem?.dispatchStatusValue || selectItem?.fireStatusValue }}
            </span>
          </div>
          <div class="number">
            <slot name="number" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="tabs?.length > 1" class="police-icon">
      <img src="@/assets/images/open.png" @click="onShowMore">
    </div>

    <van-popup v-model:show="popVisible" position="bottom">
      <div class="select-tabs">
        <div class="header">
          <van-button type="default" size="small" @click="() => popVisible = false">
            取消
          </van-button>
          <div class="modal-title">请选择</div>
        </div>
        <div class="tabs-wrapper">
          <div
            v-for="(item, index) in tabs"
            :key="item.id"
            class="police-tabs-item item"
            :class="{ 'police-tabs-item-active': selectIndex === index }"
            @click="onTabsChange(index)"
          >
            <div class="title">
              <template v-if="item.type === 1">
                <img src="@/assets/images/icon_tabs_police@2x.png">
              </template>
              <template v-else-if="item.type === 5">
                <img src="@/assets/images/icon_tabs_fire@2x.png">
              </template>
              <template v-else-if="item.type === 2">
                <img src="@/assets/images/icon_tabs_main@2x.png">
              </template>
              <template v-else-if="item.type === 3">
                <img src="@/assets/images/icon_tabs_zeng@2x.png">
              </template>
              <template v-else-if="item.type === 4">
                <img src="@/assets/images/icon_tabs_header@2x.png">
              </template>
            </div>
            <div class="right">
              <template v-if="item.type === 1">
                <div class="dispatch-org">
                  {{ item.distributeOrgName }}
                </div>
              </template>
              <template v-else-if="item.type === 5">
                <div class="dispatch-org">
                  {{ item.distributeOrgName }}
                </div>
              </template>
              <template v-if="item.type === 2 || item.type === 3 || item.type === 4">
                <div class="dispatch-org">
                  {{ item.distributeOrgName }}
                </div>
              </template>
              <template v-if="item.type === 1">
                <div class="time">
                  填报时间：{{ dayjs(item.createDate).format('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </template>
              <template v-else-if="item.type === 5">
                <div v-if="item.commitDate" class="time">
                    填报时间：{{ item.commitDate ? dayjs(item.commitDate).format('YYYY-MM-DD HH:mm:ss') : '' }}
                  </div>
                <div v-else class="time">
                  填报时间：
                </div>
              </template>
              <template v-if="item.type === 2 || item.type === 3 || item.type === 4">
                <div v-if="item.commitDate" class="time">
                    填报时间：{{ item.commitDate ? dayjs(item.commitDate).format('YYYY-MM-DD HH:mm:ss') : '' }}
                  </div>
                <div v-else class="time">
                  填报时间：
                </div>
              </template>
              <div style="font-size: 12px;">
                报告状态：
                <span
                  v-if="item.warningStatusValue || item.dispatchStatusValue || item.fireStatusValue"
                  :class="generateTextByState(item.warningStatusValue || item.dispatchStatusValue || item.fireStatusValue)"
                >
                  {{ item.warningStatusValue || item.dispatchStatusValue || item.fireStatusValue }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.police-tabs {
  display: flex;
  padding: 10px 10px 10px 10px;
  background-color: white;
  .top-row {
    width: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    img {
      margin-left: 10px;
    }
  }
  &-item {
    width: 100%;
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #E7E8EE;
    padding: 6px 8px;
    margin-right: 10px;
    cursor: pointer;
    .title {
      width: 40px;
      font-size: 16px;
      font-weight: bold;
      color: #2E3656;
      display: flex;
      justify-content: right;
      margin-right: 6px;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .right {
      width: calc(100% - 46px);
      display: flex;
      flex: 1;
      flex-direction: column;
    }
    .dispatch-org {
      font-size: 14px;
      font-weight: bold;
      color: #48556A;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .time {
      font-size: 12px;
      color: #48556A;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-top: 4px;
      margin-bottom: 4px;
    }
    .state {
      display: inline-block;
      font-size: 10px;
      font-weight: 400;
      color: #ffffff;
      line-height: 10px;
      background: #34c38f;
      border-radius: 4px;
      padding: 6px 8px;
    }
  }
  &-item-active {
    border: 1px solid #0F7DE4;
  }
  .police-icon {
    height: 74px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }
}
.select-tabs {
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    height: 44px;
    padding: 0 10px;
    background-color: white;
    display: flex;
    align-items: center;
    position: relative;
    .modal-title {
      color: #242424;
      font-size: 16px;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
    }
  }
  .tabs-wrapper {
    width: 100%;
    height: 50vh;
    padding: 10px 10px 0 10px;
    overflow-y: auto;
    overflow-x: hidden;
    .item {
      margin-bottom: 10px;
    }
  }
}
</style>
