<script setup>
import { onMounted, ref, watch, inject } from "vue";
import dayjs from "dayjs";
import SelectSingle from "@/component/SelectSingle/index";
import SelectMultiple from "@/component/SelectMultiple/index";
import CascaderSingle from "@/component/CascaderSingle/index";
import SelectOrg from "@/component/SelectOrg/index";
import SelectRangeTime from "@/component/SelectRangeTime/index";
import AreaCascader from "@/component/AreaCascader/index";
import { useRoute } from 'vue-router';
import { useRouter } from "vue-router";
import { getCurrentInstance } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  showBack: {
    type: Boolean,
    default: true,
  },
  resetFn: {
    type: Function,
  }
});

const emit = defineEmits(["update:value", "confirmCallback"]);

const instance = getCurrentInstance();

const route = useRoute();

const router = useRouter();

const currentTime = dayjs().valueOf()

const label = ref("选择更多条件");

const query = inject("query");

const selectVisible = ref(false);

watch(() => props.options, () => {
  instance.proxy.$forceUpdate();
})

watch(() => [route.path], () => {
  if (!route.query?.temporary || Number(route.query?.temporary) < currentTime) {
    selectVisible.value = false
  }
}, { immediate: true, deep: true })

const handleMore = () => {
  router.push({
    path: route.path,
    query: {
      temporary: currentTime,
    }
  })
  selectVisible.value = true;
};

const handleReset = () => {
  props.resetFn()
}

const handleConfirm = () => {
  emit('confirmCallback')
  router.go(-1)
  selectVisible.value = false;
}

const onLeftBack = () => {
  selectVisible.value = false;
  router.go(-1)
}

defineOptions({
  name: "SelectMore",
});
</script>

<template>
  <van-field
    v-model="label"
    :readonly="true"
    label=""
    label-width="0px"
    @click="handleMore"
    style="margin-left: 10px"
    is-link
  />
  <van-popup v-model:show="selectVisible" position="bottom">
    <div class="select-wrapper">
      <div v-if="showBack" class="back" >
        <div class="arrow">
          <van-icon @click="onLeftBack" name="arrow-left" />
        </div>
        <div>选择更多条件</div>
      </div>
      <div class="select-more">
        <div v-for="item in options" :key="item.title" class="more-item">
          <div class="more-title">{{ item.title }}</div>
          <template v-if="item.type === 'input'">
            <van-field
              v-model="query[item.value]"
              label=""
              :placeholder="item.placeholder"
            />
          </template>
          <template v-else-if="item.type === 'select'">
            <SelectMultiple
              v-model:value="query[item.value]"
              :options="item.options"
              :field-names="item.fieldNames"
              :rule="[{ required: true, message: item.placeholder }]"
              :required="false"
              :readonly="true"
              :placeholder="item.placeholder"
              :title="item.placeholder"
            />
          </template>
          <template v-else-if="item.type === 'select-single'">
            <SelectSingle
              v-model:value="query[item.value]"
              :options="item.options"
              :field-names="item.fieldNames"
              :rule="[{ required: true, message: item.placeholder }]"
              :required="false"
              :readonly="true"
              :placeholder="item.placeholder"
              :title="item.placeholder"
            />
          </template>
          <template v-else-if="item.type === 'select-org'">
            <SelectOrg
              v-model:value="query[item.value]"
              :field-names="{ value: 'organizationid', label: 'name' }"
              :required="false"
              :readonly="true"
              :placeholder="item.placeholder"
              :title="item.placeholder"
              :params="item.params"
              :single="item.single"
              :select-leaf="item.selectLeaf"
              :headers-disabled="item.headersDisabled"
            />
          </template>
          <template v-else-if="item.type === 'cascader'">
            <CascaderSingle
              v-model:value="query[item.value]"
              v-model:text="item.text"
              :options="item.options"
              :required="false"
              :readonly="true"
              :field-names="item.fieldNames"
              label=""
              :placeholder="item.placeholder"
            />
          </template>
          <template v-else-if="item.type === 'select-area'">
            <AreaCascader
              v-model:value="query[item.value]"
              :required="false"
              :readonly="true"
              :selectLeaf="false"
              label=""
            />
          </template>
          <template v-else-if="item.type === 'select-range'">
            <SelectRangeTime
              v-model:value="query[item.value]"
              :required="false"
              :readonly="true"
              label=""
              :placeholder="item.placeholder"
            />
          </template>
          <template v-else-if="item.type === 'input-range'">
            <Input-Range
              v-model:start="query[item.value[0]]"
              v-model:end="query[item.value[1]]"
              :required="false"
              :readonly="true"
              label=""
              :placeholder="item.placeholder"
            />
          </template>
        </div>
      </div>
      <div class="select-footer">
        <van-button type="primary" size="small" style="margin-right: 20px;" @click="handleReset">
          重置
        </van-button>
        <van-button type="success" size="small" @click="handleConfirm">
          确定
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.select-wrapper {
  height: 100vh;
  .back {
    height: 44px;
    background: #0C207F;
    display: flex;
    position: relative;
    font-size: 18px;
    color: #fff;
    text-align: center;
    justify-content: center;
    align-items: center;
    .arrow {
      position: absolute;
      top: 50%;
      left: 16px;
      font-size: 18px;
      transform: translateY(-50%);
    }
  }
  .select-more {
    height: calc(100vh - 92px);
    display: flex;
    flex-direction: column;
    padding: 10px 16px;
    overflow-y: auto;
    .more-item {
      .more-title {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .select-footer {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
  }
}
</style>