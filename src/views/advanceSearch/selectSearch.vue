<script setup>
import { inject, ref } from 'vue'
import Draggable from 'vuedraggable'
// import SearchParams from './searchParams.vue'
// import CountParams from './countParams.vue'
import { useModal } from '@/hooks/useModal.js'

const formRef = ref(null)

const { show } = useModal()

const currentIndex = ref(null)

const form = inject('form')

const options = inject('options')

const list = inject('list')

const handleSearch = (item) => {
  currentIndex.value = `${list.value.findIndex(val => val.date === item.date)}`
  show.value.searchVisible = true
}
const handleCount = (item) => {
  currentIndex.value = `${list.value.findIndex(val => val.date === item.date)}`
  show.value.countVisible = true
}
const handleClose = (removedTag) => {
  const tags = list.value.filter(tag => tag !== removedTag)
  list.value = tags
}

defineExpose({
  formRef,
})
</script>

<template>
  <div class="select-search">
    <a-divider type="vertical" class="title-divider">
      <span>已选条件</span>
    </a-divider>
    <div class="select-search-list">
      <Draggable :list="list" item-key="date" animation="300">
        <template #item="{ element }">
          <van-tag v-if="element.fieldFlag === '1'" closable color="success" @close.prevent="handleClose(element)">
            <span @click="handleSearch(element)">
              {{ element.fieldText }}
            </span>
          </van-tag>
          <van-tag v-else color="error" closable @close.prevent="handleClose(element)">
            <span @click="handleCount(element)">
              {{ element.fieldText }}
            </span>
          </van-tag>
        </template>
      </Draggable>
    </div>
  </div>
  <!-- 修改查询条件 -->
  <!-- <CommonModal v-model:visible="show.searchVisible" title="修改查询条件" width="800px">
    <template #default="{ setHandleOk }">
      <SearchParams
        :current-index="currentIndex"
        :set-handle-ok="setHandleOk"
      />
    </template>
  </CommonModal> -->
  <!-- 修改运算符 -->
  <!-- <CommonModal v-model:visible="show.countVisible" title="修改运算符" width="800px">
    <template #default="{ setHandleOk }">
      <CountParams
        :current-index="currentIndex"
        :set-handle-ok="setHandleOk"
      />
    </template>
  </CommonModal> -->
</template>

<style lang="scss" scoped>
.title-divider {
  height: 22px;
  margin-bottom: 10px;
  border-left: 4px solid #2F6BFF;
  font-weight: bold;
}
.select-search {
  height: calc(100vh - 578px);
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.2);
  padding: 10px;
  display: flex;
  flex-direction: column;
  .select-search-list {
    width: 100%;
    height: 100%;
    padding-right: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .ant-tag {
      margin-top: 10px;
      margin-right: 10px;
      position: relative;
      cursor: pointer;
      padding: 4px 8px;
      white-space: break-spaces;
      :deep(.ant-tag-close-icon) {
        padding: 3px;
      }
      :deep(.ant-tag-close-icon:hover) {
        color: #fff;
        background: #ff4d4f;
        border-radius: 100%;
        padding: 3px;
      }
    }
  }
}
</style>
