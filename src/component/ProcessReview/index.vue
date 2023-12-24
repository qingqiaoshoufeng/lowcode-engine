<script setup>
import { onMounted, ref } from "vue";
import { getInitProcess } from "@/apis/index.js";
import { useOptions } from "@/hooks/useOptions.js";
import SelectSingle from "@/component/SelectSingle/index";

const props = defineProps({
  processKey: {
    type: String,
    default: "",
  },
  currentRow: {
    type: Object,
    default: () => {},
  },
  labelText: {
    type: String,
    default: "审核",
  },
  setHandleOk: {
    type: Function,
  },
});

const emits = defineEmits(["finishCallback"]);

const formRef = ref(null);

const { options } = useOptions();

const form = ref({
  suggest: "",
  approveType: undefined,
  remark: "",
});

const onSubmit = async () => {
  emits("finishCallback", form.value);
  formRef.value.finishFn();
};

onMounted(() => {
  props.setHandleOk(async (finishFn) => {
    formRef.value.submit();
    formRef.value.finishFn = finishFn;
  });
  // 初始化审核信息
  getInitProcess({ taskId: props.currentRow?.taskId, processKey: props.processKey }).then((res) => {
    if (res) {
      form.value.auditUserName = res.auditUserName;
      form.value.auditDeptName = res.auditDeptName;
      if (res?.pathList) {
        const keys = Object.keys(res?.pathList[0]);
        const values = Object.values(res?.pathList[0]);
        options.value.approval = keys.map((item, index) => {
          return {
            value: item,
            label: values[index],
          };
        });
      }
    }
  });
});

const onApproveType = (value) => {
  if (value) {
    const filter = options.value.approval?.filter((item) => item.value === value);
    form.value.suggest = filter[0] ? filter[0].label : "";
  } else {
    form.value.suggest = "";
  }
};

defineOptions({
  name: "ProcessReview",
});
</script>

<template>
  <van-form ref="formRef" @submit="onSubmit">
    <!-- <van-field
      v-model="form.auditUserName"
      :readonly="true"
      name="auditUserName"
      :label="`${labelText}员：`"
      :placeholder="`请输入${labelText}员`"
      :disabled="true"
    />
    <van-field
      v-model="form.auditDeptName"
      :readonly="true"
      name="auditDeptName"
      :label="`${labelText}单位：`"
      :placeholder="`请输入${labelText}单位`"
      :disabled="true"
    /> -->
    <SelectSingle
      v-model:value="form.approveType"
      :readonly="true"
      name="approveType"
      required
      :options="options.approval"
      :field-names="{ value: 'value', label: 'label' }"
      :title="`请选择${labelText}结果`"
      :label="`${labelText}结果：`"
      :placeholder="`请选择${labelText}结果`"
      :rules="[{ required: true, message: `请选择${labelText}结果` }]"
      @change="onApproveType"
      teleport="body"
    />
    <van-field
      v-model="form.remark"
      required
      name="remark"
      rows="4"
      autosize
      :label="`${labelText}意见：`"
      type="textarea"
      maxlength="500"
      :placeholder="`请选择${labelText}意见`"
      :rules="[{ required: true, message: `请选择${labelText}意见` }]"
      show-word-limit
      class="form-textarea"
    />
  </van-form>
</template>
