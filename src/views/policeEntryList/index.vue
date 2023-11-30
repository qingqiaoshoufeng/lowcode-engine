<script setup>
import { ref, onMounted } from 'vue'
import PoliceForm from '@/views/policeEntryForm/index.vue';
import ProModal from "@/component/ProModal/index";
import { useModal } from '@/hooks/useModal.js'
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const { show } = useModal();

onMounted(() => {
  show.value.lookVisible = true
})

const finishCallback = () => {
  setTimeout(() => {
    show.value.lookVisible = false
    router.go(-1)
  }, 200)
}

const leftBackFn = () => {
  router.go(-1)
}
</script>

<template>
  <div class="police-entry-list">
    <!-- 新建警情 -->
    <ProModal v-model:visible="show.lookVisible" :showBack="true" :showHeader="false" title="新建警情" :leftBackFn="leftBackFn">
      <template #default="{ setHandleOk, closeModal }">
        <PoliceForm
          :current-row="{}"
          :close-modal="closeModal"
          :set-handle-ok="setHandleOk"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
  </div>
</template>
