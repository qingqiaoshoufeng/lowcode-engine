<script setup>
import { ref, onMounted, provide } from "vue";
import { useList } from "@/utils/curd.js";
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  getListFn: {
    type: Function,
    default: () => {},
  },
  rowKey: {
    type: String,
    default: "id",
  },
  paginationConfig: {
    type: Object,
    default: () => ({
      alias: { page: "page", limit: "limit", list: "list", total: "total" },
      limit: 10,
    }),
  },
  defaultFilterValue: {
    type: Object,
    default: () => {},
  },
  // 默认初始化加载列表数据
  showLoad: {
    type: Boolean,
    default: true,
  },
  onTabFn: {
    type: Function,
    default: () => {},
  },
  searchFn: {
    type: Function,
  },
  resetFn: {
    type: Function,
  },
});

const emit = defineEmits(['filter', 'reset'])

const tabsActive = ref(1);

const {
  query,
  loadList,
  loadMore,
  list,
  page,
  limit,
  total,
  loading,
  pageChange,
  filter,
} = useList(props.paginationConfig.alias, {
  getListFn: props.getListFn,
  immediate: false,
});

provide("query", query);

const finished = ref(false);

if (props.defaultFilterValue) {
  query.value = cloneDeep(props.defaultFilterValue)
}

onMounted(() => {
  if (props.showLoad) {
    loadList();
  }
});

const onTabs = (name, title) => {
  finished.value = false;
  if (props.onTabFn) {
    props.onTabFn(name, title)
    return
  }
}

const onLoad = async () => {
  if (list.value?.length > 0 && !loading.value) {
    // loadMore(page + 1, limit).then(res => {
    //   if (list.value.length === total.value) {
    //     finished.value = true
    //   }
    // })
  }
};

const resetForm = () => {
  page.value = 1
  limit.value = 10
  query.value = cloneDeep(props.defaultFilterValue)
  if (props.resetFn) {
    props.resetFn()
    return
  }
  loadList()
  emit('reset')
}

defineOptions({
  name: "ProList",
});

defineExpose({
  loadList,
  filter,
  loading,
  list,
  query,
  total,
  resetForm,
})
</script>

<template>
  <div class="pro-list">
    <div class="list-tabs">
      <van-tabs v-model:active="tabsActive" color="#1833A9" @change="onTabs">
        <van-tab
          v-for="item in tabs"
          :key="item.value"
          :title="item.title"
          :name="item.value"
        />
      </van-tabs>
    </div>
    <div class="list-search">
      <slot name="search" :tabsActive="tabsActive" :filter-form-state="query" :reset-form="resetForm" />
    </div>
    <div class="list-wrapper">
      <van-list
        :loading="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div v-for="(item, index) in list" :key="item[rowKey]" :title="item[rowKey]" class="list-content">
          <slot name="list" :record="item" :index="index" />
        </div>
      </van-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pro-list {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .list-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 0 12px;
    .list-content {
      margin-bottom: 10px;
    }
    .list-content:last-child {
      margin-bottom: 0px;
    }
  }
}
</style>