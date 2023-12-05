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
      <div class="title-divider" @click="handleClear">
        <span>已选条件</span>
        <div class="title-clear">全部清除<van-icon name="delete-o" /></div>
      </div>
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
