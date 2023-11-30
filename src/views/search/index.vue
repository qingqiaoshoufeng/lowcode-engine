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
import globalSearch from "@/views/globalSearch/index.vue";
import compositeSearch from "@/views/compositeSearch/index.vue";
import advanceSearch from "@/views/advanceSearch/index.vue";

const option = [
  { text: "全局搜索", value: "globalSearch" },
  { text: "综合查询", value: "compositeSearch" },
  { text: "高级查询", value: "advanceSearch" },
];

const dropValue = ref("globalSearch");

const currentab = ref(2);

const currentValue = ref(globalSearch)

const onDropdown = (value) => {
  if (value === 'globalSearch') {
    currentValue.value = globalSearch
  }
  else if (value === 'compositeSearch') {
    currentValue.value = compositeSearch
  }
  else if (value === 'advanceSearch') {
    currentValue.value = advanceSearch
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
    