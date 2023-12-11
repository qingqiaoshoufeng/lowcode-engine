<script setup>
import { inject, ref } from 'vue'
import Draggable from 'vuedraggable'

const formRef = ref(null)

const currentIndex = ref(null)

const show = inject('show');

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

const handleClear = () => {
  list.value = []
}

defineExpose({
  formRef,
})
</script>

<template>
  <van-popup v-model:show="show.selectsVisible" position="bottom">
    <div class="select-search">
      <div class="title-divider">
        <span>已选条件</span>
        <div class="title-clear" @click="handleClear">全部清除<van-icon name="delete-o" /></div>
      </div>
      <div class="select-search-list">
        <Draggable :list="list" item-key="date" animation="300">
          <template #item="{ element }">
            <van-tag
              v-if="element.fieldFlag === '1'"
              closeable
              plain
              color="#52c41a"
              @close.prevent="handleClose(element)"
              class="tag-item"
            >
              <span @click="handleSearch(element)">
                {{ element.fieldText }}
              </span>
            </van-tag>
            <van-tag
              v-else
              color="#ff4d4f"
              plain
              closeable
              @close.prevent="handleClose(element)"
              class="tag-item"
            >
              <span @click="handleCount(element)">
                {{ element.fieldText }}
              </span>
            </van-tag>
          </template>
        </Draggable>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.title-divider {
  height: 22px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
  .title-clear {
    color: #027AFF;
    margin-left: auto;
    i {
      font-size: 14px;
      margin-left: 4px;
    }
  }
}
.select-search {
  height: 50vh;
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.2);
  padding: 10px;
  display: flex;
  flex-direction: column;
  .select-search-list {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .tag-item {
      margin-right: 8px;
      margin-bottom: 4px;
      padding: 4px 8px;
      white-space: break-spaces;
      :deep(.van-badge__wrapper) {
        margin-top: 4px;
      }
    }
  }
}
</style>
