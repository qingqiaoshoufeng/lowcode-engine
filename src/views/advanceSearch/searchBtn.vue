<script setup>
import { ref, onMounted, nextTick, inject } from 'vue';
import { getAdvanceSearchList, getConfigList, getSourceOption } from '@/apis/index.js';
import { showToast, showLoadingToast, closeToast } from "vant";

const props = defineProps({
  searchScene: {
    type: Number,
    default: 1,
  }
})

const emits = defineEmits('searchCallback', 'initCallback');

const options = inject('options');

const show = inject('show');

const searchDimension = inject('searchDimension');

const dataTimeSource = inject('dataTimeSource');

const proListRef = ref(null);

const handleSearch = () => {
  emits('searchCallback');
}

const handleCollect = () => {
  show.value = { collectVisible: true }
  nextTick(() => {
    proListRef.value.query.searchScene = props.searchScene
    proListRef.value.query.shareFlag = 2
    proListRef.value.filter()
  })
}

const handlePath = () => {
  show.value = { pathVisible: true }
}

const handleByResult = (row) => {
  show.value.collectVisible = false
  emits('initCallback', row);
}

const handleTab = (value) => {
  proListRef.value.query.shareFlag = value
  proListRef.value.filter()
}

const handlePathItem = (row) => {
  searchDimension.value = row.value
  show.value.pathVisible = false
}

const handleSourceItem = (row) => {
  dataTimeSource.value = row.value
  show.value.pathVisible = false
}

const handleSelects = () => {
  show.value = { selectsVisible: true }
}

const getSourceOptionData = async () => {
  const list = await getSourceOption()
  options.value.sourceOptions = list.map((item) => {
    const { paramValue: value, showValue: label } = item
    return ({
      value,
      label,
    })
  })
}

onMounted(() => {
  options.value.searchDimensionOptions = [
    {
      label: '数据石化口径',
      value: 1,
    },
    {
      label: '数据迁移口径',
      value: 2,
    },
  ]
  getSourceOptionData()
})
</script>

<template>
  <div class="search-btn" id="searchBtnId">
    <div class="search-btn-collect" :class="{'search-btn-collect-open': show.collectVisible }" @click="() => show.collectVisible = false">
      <div class="collect-header">
        <div style="font-weight: bold;">已保存条件</div>
        <van-button
          size="small"
          :type="proListRef?.query?.shareFlag === 2 ? 'primary' : ''"
          style="height: 28px;margin-left: auto;"
          @click.stop="handleTab(2)"
        >
          自建
        </van-button>
        <van-button
          size="small"
          :type="proListRef?.query?.shareFlag === 1 ? 'primary' : ''"
          style="height: 28px;margin-left: 10px;"
          @click.stop="handleTab(1)"
        >
          共享
        </van-button>
      </div>
      <div style="width: 100%;height: 1px;border: 1px solid #F6F6F6;"></div>
      <div class="collect-list" @click.stop>
        <ProList
          ref="proListRef"
          title="查询结果"
          :getListFn="getAdvanceSearchList"
          rowKey="id"
          :showLoad="false"
          :showBack="false"
        >
          <template #list="{ record }">
            <div class="pro-list-item">
              <div class="item-result">{{ record.searchName }}</div>
              <div class="item-enter" @click="handleByResult(record)">一键带入</div>
            </div>
          </template>
        </ProList>
      </div>
      <div style="width: 100%;height: 1px;border: 1px solid #F6F6F6;"></div>
    </div>
    <div class="search-btn-path" :class="{'search-btn-path-open': show.pathVisible }" @click="() => show.pathVisible = false">
      <div class="path-wrapper">
        <div class="path-wrapper-title">数据版本</div>
        <div
          v-for="item in options.sourceOptions"
          :key="item.value"
          class="path-wrapper-item"
          @click="handleSourceItem(item)"
        >
          <span>{{ item.label }}</span>
          <van-icon v-if="dataTimeSource === item.value" name="success" />
        </div>
      </div>
      <div style="width: 100%;height: 1px;border: 1px solid #F6F6F6;"></div>
      <div class="path-wrapper">
        <div class="path-wrapper-title">数据口径</div>
        <div
          v-for="item in options.searchDimensionOptions"
          :key="item.value"
          class="path-wrapper-item"
          @click="handlePathItem(item)"
        >
          <span>{{ item.label }}</span>
          <van-icon v-if="searchDimension === item.value" name="success" />
        </div>
      </div>
      <div style="width: 100%;height: 1px;border: 1px solid #F6F6F6;"></div>
    </div>
    <div class="search-btn-wrapper">
      <div class="round-wrapper">
        <div class="search-path" @click="handleSelects">
          已选条件<van-icon name="arrow-down" />
        </div>
        <div class="search-path" @click="handlePath">
          查询口径<van-icon name="arrow-down" />
        </div>
        <img class="collect" src="../../assets/images/icon-collect@2x.png" @click="handleCollect" />
        <van-button
          type="primary"
          size="small"
          round
          style="width: 88px;"
          @click="handleSearch"
        >
          查询
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-btn {
  width: 100%;
  position: absolute;
  z-index: 8;
  bottom: 56px;
  &-collect {
    height: calc(100vh - 56px - 56px);
    display: none;
    flex-direction: column;
    justify-content: end;
    background-color: rgba(0, 0, 0, .7);
    .collect-header {
      height: 40px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      background-color: white;
    }
    .collect-list {
      height: 40vh;
      background-color: white;
      :deep(.pro-list-item) {
        flex-direction: row;
        position: relative;
        margin-bottom: 10px;
        .item-result {
          width: 270px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          font-weight: 400;
          color: #0E203C;
        }
        .item-enter {
          font-size: 14px;
          font-weight: 400;
          color: #027AFF;
          margin-left: auto;
        }
        &::after {
          content: '';
          width: 100%;
          height: 1px;
          background-color: #F6F6F6;
          position: absolute;
          bottom: -10px;
          left: 0px;
        }
      }
    }
    &-open {
      display: flex;
    }
  }
  &-path {
    height: calc(100vh - 56px - 56px);
    display: none;
    flex-direction: column;
    justify-content: end;
    background-color: rgba(0, 0, 0, .7);
    .path-wrapper {
      display: flex;
      flex-direction: column;
      background-color: white;
      &-item {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        position: relative;
        i {
          font-size: 14px;
          color: #027AFF;
          margin-left: auto;
        }
      }
      &-item::after {
        content: '';
        width: 100%;
        height: 1px;
        background-color: #F6F6F6;
        position: absolute;
        bottom: 0px;
        left: 0px;
      }
      &-item:last-child::after {
        height: 0px;
      }
    }
    .path-wrapper-title {
      padding: 8px 12px;
      font-weight: bold;
    }
    &-open {
      display: flex;
    }
  }
  &-wrapper {
    width: 100%;
    height: 56px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    .round-wrapper {
      width: 100%;
      height: 40px;
      padding: 0 10px 0 18px;
      background: #F6F8FC;
      border-radius: 25px;
      border: 1px solid #F6F8FC;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .search-path {
      i {
        margin-left: 6px;
      }
    }
    .collect {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
