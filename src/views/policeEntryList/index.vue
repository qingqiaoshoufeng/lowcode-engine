<script setup>
import { ref, onMounted } from 'vue'
import PoliceForm from '@/views/policeEntryForm/index.vue';
import ProModal from "@/component/ProModal/index";
import { useModal } from '@/hooks/useModal.js'
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

const router = useRouter();

const { show } = useModal();

onMounted(() => {
  show.value.lookVisible = true
})

const finishCallback = () => {
  setTimeout(() => router.go(-1), 200)
}
</script>

<template>
  <div class="police-entry-list">
    <!-- 新建警情 -->
    <ProModal v-model:visible="show.lookVisible" :showHeader="false" title="新建警情">
      <template #default="{ setHandleOk }">
        <PoliceForm
          :current-row="{}"
          :set-handle-ok="setHandleOk"
          :refresh-callback="finishCallback"
          @finish-callback="finishCallback"
        />
      </template>
    </ProModal>
  </div>
</template>
