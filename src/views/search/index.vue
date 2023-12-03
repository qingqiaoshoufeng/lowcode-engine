<template>
  <div class="statistics">
    <HeaderTitle withCheck :showArrow="false">
      <template v-slot:check="">
        <div class="statistics-header">
          <van-dropdown-menu>
            <van-dropdown-item
              v-model="dropValue"
              :options="option"
              @change="onDropdown"
            />
          </van-dropdown-menu>
        </div>
      </template>
    </HeaderTitle>
    <component :is="currentValue" />
    <Tabbar :currentTab="currentab" />
  </div>
</template>
    
<script setup>
import { ref } from "vue";
import Tabbar from "@/component/tabbar/index.vue";
import GlobalSearch from "@/views/globalSearch/index.vue";
import CompositeSearch from "@/views/compositeSearch/index.vue";
import AdvanceSearch from "@/views/advanceSearch/index.vue";

const option = [
  { text: "全局搜索", value: "GlobalSearch" },
  { text: "综合查询", value: "CompositeSearch" },
  { text: "高级查询", value: "AdvanceSearch" },
];

const dropValue = ref("GlobalSearch");

const currentab = ref(2);

const currentValue = ref(GlobalSearch)

const onDropdown = (value) => {
  if (value === 'GlobalSearch') {
    currentValue.value = GlobalSearch
  }
  else if (value === 'CompositeSearch') {
    currentValue.value = CompositeSearch
  }
  else if (value === 'AdvanceSearch') {
    currentValue.value = AdvanceSearch
  }
};
</script>
    
<style scoped lang="scss" >
.statistics {
  .statistics-header {
    :deep(.van-dropdown-menu__bar) {
      background-color: transparent;
    }
    :deep(.van-dropdown-menu__title) {
      color: white;
    }
  }
}
</style>
    