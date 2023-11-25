<script setup>
import { onMounted, ref } from "vue";
import { showToast } from "vant";
import { useSubmit } from "@castle/castle-use";
import SelectOrg from "@/component/SelectOrg/index";
import { transferWarning } from "@/apis/index.js";

const props = defineProps({
  currentRow: {
    type: Object,
    default: () => {},
  },
  setHandleOk: {
    type: Function,
  },
});

const emits = defineEmits(["finishCallback"]);

const formRef = ref(null);

const form = ref({
  dispatchGroup: undefined,
});

const { loading, submit } = useSubmit(
  () => {
    showToast("转派成功");
    emits("finishCallback");
  },
  {
    submitFn: () =>
      transferWarning({
        boFireWarningId: props.currentRow?.boFireWarningId,
        dispatchGroup: form.value.dispatchGroup?.map((item) => item.organizationid)?.join(","),
      }),
  }
);

const onSubmit = async () => {
  await submit();
  await formRef.value.finishFn();
};

onMounted(() => {
  props.setHandleOk(async (finishFn) => {
    formRef.value.submit();
    formRef.value.finishFn = finishFn;
  }, loading);
});
</script>

<template>
  <div class="police-transfer">
    <van-form ref="formRef" @submit="onSubmit">
      <SelectOrg
        v-model:value="form.dispatchGroup"
        :readonly="true"
        name="dispatchGroup"
        :field-names="{ value: 'organizationid', label: 'name' }"
        :required="true"
        label="出动队伍："
        placeholder="请选择出动队伍"
        title="请选择出动队伍"
        :rules="[{ required: true, message: '请选择出动队伍' }]"
        :params="{ deptType: 1 }"
      >
      </SelectOrg>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.police-transfer {
}
</style>
