<script setup>
import { inject, onMounted, ref } from "vue";
import ProCard from "@/component/ProCard/index.vue";
import PoliceForm from "@/views/policeEntryForm/index.vue";

const emits = defineEmits(["updateField"]);

const currentRow = inject("currentRow");

const detail = inject("detail");

const updateField = (value) => {
  emits("updateField", value);
};
</script>

<template>
  <ProCard title="警情信息" id="fireInfo">
    <PoliceForm
      :is-approval="true"
      :show-survey="true"
      :current-row="currentRow"
      :show-preview="true"
      @update-field="updateField"
      class="fire-info-police"
    />
  </ProCard>
</template>

<style lang="scss" scoped>
.fire-info-police {
  height: unset !important;
  overflow-y: unset !important;
}
</style>
