<script setup>
import { computed, onMounted, ref } from "vue";
import { showToast } from "vant";
import { useSubmit } from "@castle/castle-use";
import SelectSingle from "@/component/SelectSingle/index";
import { reinforcereturn } from "@/apis/index.js";

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

const options = [
  {
    label: "警情信息错误",
    value: "警情信息错误",
  },
  {
    label: "任务派发错误",
    value: "任务派发错误",
  },
  {
    label: "其他",
    value: "其他",
  },
];

const formRef = ref(null);

const form = ref({
  returnRemark: "",
  returnReason: undefined,
});

const { loading, submit } = useSubmit(
  () => {
    showToast("退回成功");
    emits("finishCallback");
  },
  {
    submitFn: () =>
      reinforcereturn({
        boFireWarningId: props.currentRow?.boFireWarningId,
        returnReason: form.value.returnReason,
        returnRemark: form.value.returnRemark,
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
  <div class="police-back">
    <van-form ref="formRef" @submit="onSubmit">
      <SelectSingle
        v-model:value="form.returnReason"
        name="returnReason"
        :options="options"
        :field-names="{ value: 'value', label: 'label' }"
        title="退回原因"
        label="退回原因："
        placeholder="请选择退回原因"
        :rules="[{ required: true, message: '请选择退回原因' }]"
      />
      <van-field
        v-model="form.returnRemark"
        name="returnRemark"
        required
        rows="4"
        autosize
        label="备注"
        type="textarea"
        maxlength="500"
        placeholder="请输入备注"
        show-word-limit
        :rules="[{ required: true, message: '请输入备注' }]"
        class="form-textarea"
      />
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.police-back {
  .form-textarea {
    flex-direction: column;
    :deep(.van-field__body) {
      border: 1px solid #f6f6f6;
      padding: 5px 5px;
      margin-top: 5px;
    }
  }
}
</style>
