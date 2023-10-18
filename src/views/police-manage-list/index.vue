<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import {
  checkAbolishState,
  checkPoliceChangeState,
  generateColorByState,
  getLastMonth,
} from "@/utils/tools.js";
import router from '@/router/index.js'
import { Toast } from "vant";
import { getFireWarningManage, collectFireWarning } from "@/apis/index.js";
import { formatYmdHm } from "@/utils/format.js";

const defaultFilterValue = {
  onlyMy: false,
  time: getLastMonth(),
  // warningType: [],
  // warningTag: [],
  // warningStatus: [],
  // mainGroup: [],
  // boAreaId: [],
  // areaLvl: [],
  // orgIds: [],
  // naturalDisasterType: [],
};

const tabs = ref([
  {
    title: "辖区警情",
    value: 1,
  },
  {
    title: "我的警情",
    value: 2,
  },
  {
    title: "收藏的警情",
    value: 3,
  },
]);

const proListRef = ref(null);

const onTabFn = (name, title) => {
  if (title === '我的警情') {
    proListRef.value.query.onlyMy = true
    proListRef.value.query.myCollect = false
    Toast.loading()
    proListRef.value.filter().then(() => {
      Toast.clear()
    })
  } else if (title === '收藏的警情') {
    proListRef.value.query.onlyMy = false
    proListRef.value.query.myCollect = true
    Toast.loading()
    proListRef.value.filter().then(() => {
      Toast.clear()
    })
  } else if (title === '辖区警情') {
    proListRef.value.query.onlyMy = false
    proListRef.value.query.myCollect = false
    Toast.loading()
    proListRef.value.filter().then(() => {
      Toast.clear()
    })
  }
};

const handleCollect = async (row, state) => {
  Toast.loading()
  const res = await collectFireWarning({
    focusAppid: row.boFireWarningId,
    focusCode: row.warningCode,
    focusType: '1',
    deleteFlag: state ? '1' : '2',
  })
  proListRef.value.filter().then(() => {
    Toast(state ? '收藏成功' : '取消收藏成功')
    Toast.clear()
  })
}

const handleAbolish = (item) => {
  Toast('此功能暂未开放！')
}

const handleChange = (item) => {
  Toast('此功能暂未开放！')
}

const handleItem = (item) => {
  router.push({ name: 'police-entry-form', query: { boFireWarningId: item.boFireWarningId }})
}

onMounted(() => {
  nextTick(() => {
    proListRef.value.filter();
  });
});
</script>

<template>
  <div class="police-manage-list">
    <ProList
      ref="proListRef"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getFireWarningManage"
      :tabs="tabs"
      rowKey="boFireWarningId"
      :showLoad="false"
      :onTabFn="onTabFn"
    >
      <!-- <template #search>
        <div>???</div>
      </template> -->
      <template #list="{ record }">
        <div class="list-item" @click="handleItem(record)">
          <div class="item-header">
            <div class="item-title">{{ record.warningName }}</div>
            <div
              class="item-state"
              :class="generateColorByState(record.warningStatusValue)"
            >
              {{ record.warningStatusValue }}
            </div>
          </div>
          <div class="item-type">
            <span>{{ record.warningTypeValue }}</span>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon-time@2x.png" alt="" />
            <div style="color: #929398;">接警时间：</div>
            <div>{{ formatYmdHm(record.warningDate) }}</div>
          </div>
          <div class="item-field">
            <img src="../../assets/images/icon-area@2x.png" style="width: 13px;height: 15px;margin-right: 8px;" alt="" />
            <div style="color: #929398;">行政区域：</div>
            <div>{{ record.warningAreaValue }}</div>
          </div>
          <div class="item-line" />
          <div class="item-operate" @click.stop>
            <van-icon name="star" v-if="record.focusStatus === '1'" style="font-size: 20px;color: #FED547;" @click="handleCollect(record, false)"/>
            <van-icon name="star-o" v-else style="font-size: 20px;" @click="handleCollect(record, true)" />
            <van-button plain type="success" size="small" class="item-btn" @click="handleAbolish(record)">作废</van-button>
            <van-button plain type="success" size="small" class="item-btn" @click="handleChange(record)">更正</van-button>
          </div>
        </div>
      </template>
    </ProList>
  </div>
</template>

<style lang="scss" scoped>
.police-manage-list {
  height: 100vh;
  background-color: #f6f7f8;
  .list-item {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    margin-top: 10px;
    .item-header {
      display: flex;
      padding: 8px 10px;
      .item-state {
        width: 57px;
        height: 24px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0075ff;
        border-radius: 2px;
        margin-left: auto;
      }
    }
    .item-field {
      font-size: 14px;
      color: #1F1F1F;
      display: flex;
      align-items: center;
      padding: 0 0 8px 10px;
      img {
        width: 14px;
        height: 14px;
        margin-right: 6px;
      }
    }
    .item-type {
      margin: 0 0 8px 10px;
      span {
        display: inline-block;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fc2902;
        background: #ffefec;
        border-radius: 2px;
        padding: 4px 10px;
      }
    }
    .item-line {
      width: 100%;
      border-top: 1px solid rgba(31, 31, 31, 0.15);
    }
    .item-operate {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 8px 10px;
      .item-btn {
        padding: 0 16px;
        margin-left: 10px;
        :deep(.van-button__content) {
          height: 18px;
        }
        :deep(.van-button__text) {
          white-space: nowrap;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
