<script setup>
import { ref } from "vue";
import ProList from "@/component/ProList/index";
import PoliceEntryDetail from "@/views/policeEntryDetail/index.vue";
import ProModal from "@/component/ProModal/index";
import { getGlobalSearchList } from "@/apis/index.js";
import { useModal } from "@/hooks/useModal.js";
import { showToast, showLoadingToast, closeToast } from "vant";

const { show } = useModal();

const defaultFilterValue = {
  type: 1,
  keyword: "",
};

const resultValue = ref("");

const tabs = ref([
  {
    title: "警情",
    value: 1,
  },
  {
    title: "出动(队站)",
    value: 2,
  },
  {
    title: "出动(指挥)",
    value: 3,
  },
  {
    title: "火灾",
    value: 4,
  },
]);

const proListRef = ref(null);

const currentRow = ref(null);

const onTabFn = (name, title) => {
  proListRef.value.query.type = name
  proListRef.value.filter()
}

const handleItem = (row) => {
  currentRow.value = row;
  show.value.lookVisible = true;
};

const handleSearch = () => {
  showLoadingToast();
  proListRef.value.filter().then((res) => {
    if (proListRef.value.query.type === 1) {
      resultValue.value = `查询结果：共查询到<span style="color: red;">${ proListRef.value.result?.fireWarning?.warningCount || 0 }</span>起警情记录`
    } else if (proListRef.value.query.type === 2 || proListRef.value.query.type === 3) {
      const num = proListRef.value.result?.fireDispatch?.dispatchCount || proListRef.value.result?.fireDispatchHead?.dispatchCount || 0 || 0
      resultValue.value = `查询结果：共查询到<span style="color: red;">${ num }</span>起出动记录`
    } else if (proListRef.value.query.type === 4) {
      resultValue.value = `查询结果：共查询到<span style="color: red;">${ proListRef.value.result?.fireInfo?.fireCount || 0 }</span>起火灾记录`
    }
    closeToast();
  });
}
</script>

<template>
  <div class="global-search">
    <ProList
      ref="proListRef"
      title="全局搜索"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getGlobalSearchList"
      :tabs="tabs"
      :showLoad="false"
      :showBack="false"
      :onTabFn="onTabFn"
    >
      <template #search="{ filterFormState }">
        <div class="list-tabs">
          <div class="search-input">
            <van-field
              v-model="filterFormState.keyword"
              placeholder="请输入要找的信息"
              size="small"
              class="search-input-field"
            />
            <van-button type="primary" class="search-btn" size="small" @click="handleSearch">
              查询
            </van-button>
          </div>
          <div class="search-result" v-html="resultValue"></div>
        </div>
      </template>
      <template #list="{ record }">
        <div class="pro-list-item" @click="handleItem(record)">
          <div class="item-header">
            <div class="item-title" style="width: 100%;">{{ record.warningName }}</div>
          </div>
          <div class="item-type">
            <span>{{ record.warningTypeValue }}</span>
          </div>
          <div class="item-field">
            <div class="highlight-str" v-html="record.highlightStr" />
          </div>
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-button
              v-p="['admin', 'police-manage:edit']"
              type="success"
              size="mini"
              color="#1989fa"
              class="item-btn"
              @click="handleItem(record)"
            >
              查看
            </van-button>
          </div>
        </div>
      </template>
    </ProList>

    <!-- 警情详情 -->
    <ProModal
      v-model:visible="show.lookVisible"
      :showBack="true"
      :showHeader="false"
      title="警情详情"
    >
      <PoliceEntryDetail :current-row="currentRow" />
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.global-search {
  height: calc(100vh - 92px);
  background-color: #f6f7f8;
  .list-tabs {
    display: flex;
    flex-direction: column;
    .search-input {
      display: flex;
      align-items: center;
      padding: 10px 10px;
      .search-input-field {
        height: 32px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        padding: 0 10px;
        align-items: center;
      }
      .search-btn {
        width: 50px;
        height: 32px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    .search-result {
      margin-left: 12px;
      span {
        color: red;
        margin: 0 10px;
      }
    }
  }
}
</style>

<style>
.highlight-str {
}
.highlight-tooltip .red,
.highlight-str .red {
  color: #ff4d16;
}
</style>
