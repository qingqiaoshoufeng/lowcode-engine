<script setup>
import { ref, onMounted, nextTick } from "vue";
import ProList from "@/component/ProList/index";
import ProModal from "@/component/ProModal/index";
import SelectSingle from "@/component/SelectSingle/index";
import { statType } from '@/utils/constants.js';
import { showToast, showLoadingToast, closeToast } from "vant";
import { getReportTemplateList, collectFireWarning } from "@/apis/index.js";
import { useModal } from '@/hooks/useModal.js'
import { showImagePreview } from 'vant';
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

const { show } = useModal();

const currentRow = ref(null);

const proListRef = ref(null);

const isRote = ref(false)

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
  show.value.recheckVisible = true
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
    <ProList
      ref="proListRef"
      title="报表统计"
      :defaultFilterValue="defaultFilterValue"
      :getListFn="getReportTemplateList"
      :tabs="tabs"
      rowKey="boFireWarningId"
      :showLoad="false"
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
          <div class="card-img" @click="handleItem(record)">
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
    <!-- 警情详情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="警情详情">
      <!-- <PoliceEntryDetail :current-row="currentRow" /> -->
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
.report-statistical-list {
  height: 100%;
  background-color: #f6f7f8;
  .list-tabs {
    display: flex;
    padding: 10px 16px 0 16px;
  }
  :deep(.van-image-preview__cover) {
    width: 100%;
    height: 100%;
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
