<script setup>
import { onMounted, ref } from "vue";
import { showToast } from "vant";
import { useSubmit } from "@castle/castle-use";
import SelectOrg from "@/component/SelectOrg/index";
import SelectSingle from "@/component/SelectSingle/index";
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
  firstGroup: undefined,
  mainGroup: undefined,
});

const { loading, submit } = useSubmit(
  () => {
    showToast("转派成功");
    emits("finishCallback");
  },
  {
    submitFn: () => {
      const { boFireWarningId } = props.currentRow;
      const { dispatchGroup, firstGroup, mainGroup } = form.value;
      return transferWarning({
        boFireWarningId: boFireWarningId,
        dispatchGroup: dispatchGroup?.map((item) => item.organizationid)?.join(","),
        firstGroup,
        mainGroup,
      });
    },
  }
);

const onSubmit = async () => {
  await submit();
  await formRef.value.finishFn();
};

const onChange = () => {
  if (form.value.dispatchGroup?.length <= 0) {
    form.value.firstGroup = undefined;
    form.value.mainGroup = undefined;
  }
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
        @change="onChange"
      >
      </SelectOrg>
      <SelectSingle
        v-if="currentRow?.isFirst"
        v-model:value="form.firstGroup"
        name="firstGroup"
        :options="form.dispatchGroup"
        :field-names="{ value: 'organizationid', label: 'name' }"
        :required="true"
        label="首到队站："
        title="请选择首到队站"
        placeholder="请选择首到队站"
        :rules="[{ required: true, message: '请选择首到队站' }]"
      >
      </SelectSingle>
      <SelectSingle
        v-if="currentRow?.isMain"
        v-model:value="form.mainGroup"
        name="mainGroup"
        :options="form.dispatchGroup"
        :field-names="{ value: 'organizationid', label: 'name' }"
        :required="true"
        label="主战队站："
        title="请选择主战队站"
        placeholder="请选择主战队站"
        :rules="[{ required: true, message: '请选择主战队站' }]"
      >
      </SelectSingle>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.police-transfer {
}
</style>
