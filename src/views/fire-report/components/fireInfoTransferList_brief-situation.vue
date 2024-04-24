<script setup>
import { inject } from "vue";
import { gutter } from "@/utils/constants.js";

const form = inject("form");
</script>

<template>
  <van-cell-group>
    <div :gutter="gutter">
      <div :span="24" class="fz16">
        {{ form.briefSituation.content.value }}
      </div>
    </div>
  </van-cell-group>
</template>
<style lang="scss" scoped>
.fz16 {
  font-size: var(--van-cell-font-size);
  color: rgb(50, 50, 51);
  padding: 10px 16px;
}
</style>
