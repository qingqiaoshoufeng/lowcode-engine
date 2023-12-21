<script setup>
import { onMounted, ref } from "vue";
import { useSubmit } from "@castle/castle-use";

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
  approveType: "1",
  remark: "",
});

const { loading, submit } = useSubmit(
  () => {
    const { approveType, remark } = form.value;
    emits("finishCallback", {
      approveType,
      remark,
      boFireWarningId: props.currentRow?.boFireWarningId,
    });
  },
  {
    submitFn: () => {
      return Promise.resolve();
    },
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
  <div class="police-confirm">
    <van-form ref="formRef" @submit="onSubmit">
      <van-field
        name="approveType"
        label="是否有联动单位："
        label-width="124px"
        required
        class="field-radio"
      >
        <template #input>
          <van-radio-group
            v-model="form.approveType"
            icon-size="16px"
            direction="horizontal"
          >
            <van-radio name="1">通过</van-radio>
            <van-radio name="2">退回</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        v-model="form.remark"
        name="remark"
        required
        rows="4"
        autosize
        label="确认意见："
        type="textarea"
        maxlength="500"
        placeholder="请输入确认意见"
        show-word-limit
        :rules="[{ required: true, message: '请输入确认意见' }]"
        class="form-textarea"
      />
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.police-confirm {
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
