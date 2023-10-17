<script setup>
import { onMounted, ref, watch, computed } from "vue";

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "行政区域",
  },
  placeholder: {
    type: String,
    default: "请选择行政区域",
  },
  options: {
    type: Array,
    default: () => [],
  },
});

const selectVisible = ref(false);

const selectValue = ref('')

const handleSelect = (item) => {

}

defineOptions({
  name: "SelectSingle",
});
</script>

<template>
  <van-field
    v-model="selectValue"
    is-link
    readonly
    :required="required"
    :label="label"
    :placeholder="placeholder"
    @click="selectVisible = true"
  />
  <van-popup v-model:show="selectVisible" position="bottom">
    {{ options }}
    <van-radio-group v-model="selectValue">
      <van-cell-group inset>
        <van-cell
          v-for="item in options"
          :title="item.name"
          :key="item.id"
          clickable
          @click="handleSelect(item)"
        >
          <template #right-icon>
            <van-radio :name="item.name" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </van-popup>
</template>

<style lang="scss" scoped>
</style>