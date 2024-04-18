<script setup>
import { onMounted, ref } from "vue";
import { useSubmit } from "@castle/castle-use";
import SelectSingle from "@/component/SelectSingle/index";
import { useOptions } from "@/hooks/useOptions.js";

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

const { options } = useOptions({
  approval: [
    {
      label: '通过',
      value: '1',
    },
    {
      label: '退回',
      value: '2',
    },
  ]
});

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
      <!-- <van-field
        name="approveType"
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
      </van-field> -->
      <SelectSingle
        v-model:value="form.approveType"
        :readonly="true"
        name="approveType"
        required
        :options="options.approval"
        :field-names="{ value: 'value', label: 'label' }"
        :title="`请选择确认结果`"
        :label="`确认结果：`"
        :placeholder="`请选择确认结果`"
        :rules="[{ required: true, message: `请选择确认结果` }]"
        teleport="body"
      />
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
}
</style>
