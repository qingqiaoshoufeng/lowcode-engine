<script setup>
import { ref, onMounted, nextTick, provide, watch } from "vue";
import ProList from "@/component/ProList/index";
import ProModal from "@/component/ProModal/index";
import SelectSingle from "@/component/SelectSingle/index";
import ReportGenerate from "./components/reportGenerate.vue";
import { statType } from '@/utils/constants.js';
import { showToast, showLoadingToast, closeToast } from "vant";
import { getReportTemplateList, collectFireWarning } from "@/apis/index.js";
import { useModal } from '@/hooks/useModal.js'
import { debounce } from 'throttle-debounce'

const defaultFilterValue = {
  templateType: 1,
  templateName: '',
  sceneType: '',
};

const tabs = ref([
  {
    title: "固定报表",
    value: 1,
  },
  {
    title: "自定义报表",
    value: 2,
  },
  {
    title: "我的收藏",
    value: 3,
  },
]);

const currentab = ref(4)

const { show } = useModal();

show.value.lookVisible = false

const currentRow = ref(null);

const proListRef = ref(null);

const isRote = ref(false)

provide('show', show)

watch(() => show.value, () => {
  if (show.value && !show.value.lookVisible && window.luckysheet) {
    window.luckysheet.destroy()
  }
})

const onTabFn = (name, title) => {
  if (title === tabs.value[1].title) {
    proListRef.value.query.templateType = 2;
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  } else if (title === tabs.value[2].title) {
    proListRef.value.query.templateType = 3;
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  } else if (title === tabs.value[0].title) {
    proListRef.value.query.templateType = 1;
    showLoadingToast();
    proListRef.value.filter().then(() => {
      closeToast();
    });
  }
};

const handleCollect = async (row, state) => {
  showLoadingToast();
  const res = await collectFireWarning({
    focusAppid: row.id,
    focusCode: row.templateCode,
    focusType: '4',
    deleteFlag: state ? '1' : '2',
  });
  proListRef.value.filter().then(() => {
    showToast(state ? "收藏成功" : "取消收藏成功");
    closeToast();
  });
};

const handleChange = (row) => {
  currentRow.value = row
  show.value.lookVisible = true
};

const handleItem = (row) => {
  currentRow.value = row
  show.value.imageVisible = true
};

const handleRote = () => {
  isRote.value = !isRote.value
}

const handleClose = () => {
  isRote.value = false
  currentRow.value = null
  show.value.imageVisible = false
}

const startSearchFn = debounce(1000, () => {
  proListRef.value.filter();
})

const onSearchConfirm = () => {
  startSearchFn();
}

onMounted(() => {
  nextTick(() => {
    proListRef.value?.filter();
  });
});
</script>

<template>
  <div class="report-statistical-list">
    <div class="statistical-list-wrapper">
      <ProList
        ref="proListRef"
        title="报表统计"
        :defaultFilterValue="defaultFilterValue"
        :getListFn="getReportTemplateList"
        :tabs="tabs"
        rowKey="id"
        :showLoad="false"
        :showBack="false"
        :onTabFn="onTabFn"
      >
        <template #search="{ filterFormState }">
          <div class="list-tabs">
            <SelectSingle
              v-model:value="filterFormState.sceneType"
              :readonly="true"
              name="sceneType"
              :options="statType"
              :field-names="{ value: 'value', label: 'label' }"
              placeholder="请选择报表类型"
              title="请选择报表类型"
              label-width="0px"
              :rules="[{ required: true, message: '请选择报表类型' }]"
              @change="onSearchConfirm"
            />
            <van-field
              v-model="filterFormState.templateName"
              maxlength="50"
              required
              name="templateName"
              label-width="0px"
              placeholder="请输入报表名称"
              :rules="[{ required: true, message: `请输入报表名称` }]"
              style="margin-left: 10px;"
              @input="onSearchConfirm"
            />
          </div>
        </template>
        <template #list="{ record }">
          <div class="pro-list-item">
            <div class="item-header">
              <div class="item-title">{{ record.templateName }}</div>
            </div>
            <div class="card-img" @click="handleChange(record)">
              <img :src="record.url" alt="">
            </div>
            <div class="item-line" />
            <div class="item-operate" @click.stop>
              <van-icon
                name="star"
                v-if="record.focusStatus === '1'"
                style="color: #fed547"
                class="item-collect"
                @click="handleCollect(record, false)"
              />
              <van-icon
                name="star-o"
                v-else
                class="item-collect"
                @click="handleCollect(record, true)"
              />
              <van-button
                v-p="['admin', 'police-manage:abolish']"
                type="success"
                size="mini"
                color="#1989fa"
                class="item-btn"
                @click="handleItem(record)"
              >
                预览
              </van-button>
              <van-button
                v-p="['admin', 'police-manage:change']"
                type="success"
                size="mini"
                color="#1989fa"
                class="item-btn"
                @click="handleChange(record)"
              >
                查询
              </van-button>
            </div>
          </div>
        </template>
      </ProList>
    </div>

    <Tabbar :currentTab="currentab" />

    <van-image-preview
      v-model:show="show.imageVisible"
      :images="[currentRow?.url]"
      :class="{'rote-wrapper': isRote}"
      :show-index="false"
      :closeable="true"
      @close="handleClose"
    >
      <template #cover>
        <div class="rote-btn">
          <van-icon name="exchange" @click="handleRote" />
        </div>
      </template>
    </van-image-preview>
    <!-- 报表查询 -->
    <ProModal
      v-model:visible="show.lookVisible"
      :showBack="true"
      :showHeader="false"
      title="报表查询"
    >
      <ReportGenerate :current-row="currentRow" />
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.report-statistical-list {
  height: 100%;
  background-color: #f6f7f8;
  .statistical-list-wrapper {
    height: calc(100% - 56px);
    :deep(.pro-list-item) {
      .item-title {
        width: auto;
        white-space: normal;
      }
    }
  }
  .list-tabs {
    display: flex;
    padding: 10px 12px 0 12px;
  }
  :deep(.van-image-preview__cover) {
    .rote-btn {
      color: white;
      font-size: 18px;
      position: absolute;
      top: 18px;
      left: 18px;
      z-index: 2222;
    }
  }
}
</style>

<style lang="scss">
.rote-wrapper {
  .van-image__img {
    transform: rotate(90deg) !important;
  }
}
</style>
