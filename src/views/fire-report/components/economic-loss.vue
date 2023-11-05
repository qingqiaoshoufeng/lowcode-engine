<script setup>
import { inject, watch } from 'vue'
import store from '@/store/index.js'
// import { message, notification } from '@castle/ant-design-vue'
import { checkAffectedHouse, checkFireDisposalCost, checkFireInjuryCost } from '../config/tool.js'
import { gutter } from '@/utils/constants.js'
import { nonnegativeNumberReg } from '@/utils/validate.js'
// import FieldAnnotation from '@/components/field-annotation/index.vue'
// import { useRuleConfig } from '@/store/index.js'
const severityConfig = store.state?.rules?.ruleConfig?.severityConfig|| []
// const { ruleConfig: { severityConfig } } = useRuleConfig()
// const severityConfig = store.state?.rules?.ruleConfig?.severityConfig|| []
const form = inject('form')

const showPreview = inject('showPreview')

const showDraft = inject('showDraft')

const options = inject('options')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const importantEdit = inject('importantEdit')

watch(() => form.value.economicLoss, () => {
  let loss = 0
  const { directDamage, fireDisposalCost, fireInjuryCost, otherExpense } = form.value.economicLoss
  if (directDamage.value > 0) {
    loss += directDamage.value
  }
  if (fireDisposalCost.value > 0) {
    loss += fireDisposalCost.value
  }
  if (fireInjuryCost.value > 0) {
    loss += fireInjuryCost.value
  }
  if (otherExpense.value > 0) {
    loss += otherExpense.value
  }
  form.value.economicLoss.directEconomicLoss.value = loss
}, { deep: true })

const validateDirectDamage = (val) => {
  const { basicInfo, economicLoss } = form.value
  if ((Number(val) > severityConfig?.[2]?.value?.[1]
    || Number(val) < severityConfig?.[2]?.value?.[0]) && basicInfo.severity.value === '1') {
    return `轻微火灾的直接财产损失要在${severityConfig?.[2]?.value?.[0]}-${severityConfig?.[2]?.value?.[1]}元范围内！`
    // callback(new Error())
  }
  else if (!val && val !== 0) {
    if (!economicLoss.directDamage.rules[0].required) {
      // callback()
      return true
    }
    else {
      return '请输入直接财产损失'
      // callback(new Error('请输入直接财产损失'))
    }
  }
  else if (!nonnegativeNumberReg.test(val)) {
    return '请输入正确直接财产损失'
    // callback(new Error('请输入正确直接财产损失'))
  }
  else {
    return true
    // callback()
  }
}
</script>

<template>
<van-cell-group class="rootform1">
    <div class="economicLoss-message">
      直接经济损失：{{ form.economicLoss.directEconomicLoss?.value }}元
    </div>
    <div :gutter="gutter">
      <div :span="8">
        <SelectSingle
          name="economicLoss.inspectMethod.value"
          label="调查方式"
          :rules="form.economicLoss.inspectMethod.rules"
          id="inspectMethod"
          v-model:value="form.economicLoss.inspectMethod.value"
          :showPreview="showPreview"
          :options="options.inspectMethod"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择调查方式"
        />
      </div>
      <div :span="8">
        <van-field 
          name="economicLoss.directDamage.value"
          label="直接财产损失（元)"
          :rules="[{ validator: validateDirectDamage, trigger: 'blur' }, ...form.economicLoss.directDamage.rules]"
          id="directDamage"
          v-model="form.economicLoss.directDamage.value"
          v-preview-text="showPreview"
          allow-clear
          style="width: 100%"
          :maxlength="15"
          :disabled="!importantEdit"
          placeholder="请输入直接财产损失"
          aria-autocomplete="none"
          type="number" 
        />
      </div>
      <div :span="8">
        <van-field 
         name="economicLoss.fireDisposalCost.value"
          label="火灾现场处置费用（元)"
          :rules="form.economicLoss.fireDisposalCost.rules"
          id="fireDisposalCost"
          v-model="form.economicLoss.fireDisposalCost.value"
          v-preview-text="showPreview"
          style="width: 100%"
          :maxlength="15"
          allow-clear
          aria-autocomplete="none"
          placeholder="请输入火灾现场处置费用（元)"
          @blur="checkFireDisposalCost(form)"
          type="number" 
        />
      </div>
    </div>

    <div :gutter="gutter">
      <div :span="8">
          <van-field 
            name="economicLoss.fireInjuryCost.value"
            label="人身伤亡医疗支出（元)"
            :rules="form.economicLoss.fireInjuryCost.rules"
            id="fireInjuryCost"
            v-model="form.economicLoss.fireInjuryCost.value"
            v-preview-text="showPreview"
            style="width: 100%"
            allow-clear
            aria-autocomplete="none"
            :maxlength="10"
            placeholder="请输入人身伤亡医疗支出"
            @blur="checkFireInjuryCost(form)"
            type="number" 
          />
      </div>
      <div :span="8">
         <van-field 
            name="economicLoss.otherExpense.value"
            label="其他费用（元)"
            :rules="form.economicLoss.otherExpense.rules"
            id="otherExpense"
            v-model="form.economicLoss.otherExpense.value"
            v-preview-text="showPreview"
            style="width: 100%"
            allow-clear
            aria-autocomplete="none"
            :maxlength="10"
            placeholder="请输入其他费用"
            type="number" 
          />
      </div>
      <div :span="8">
        <SelectSingle
          name="economicLoss.costSource.value"
          label="损失来源"
          :rules="form.economicLoss.costSource.rules"
          id="costSource"
          v-model:value="form.economicLoss.costSource.value"
          :showPreview="showPreview"
          :options="options.costSource"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择损失来源"
        />
      </div>
      <div :span="8">
          <van-field 
            name="economicLoss.affectedHouse.value"
            label="受灾户数（户）"
            :rules="form.economicLoss.affectedHouse.rules"
            id="affectedHouse"
            v-model="form.economicLoss.affectedHouse.value"
            v-preview-text="showPreview"
            style="width: 100%"
            allow-clear
            aria-autocomplete="none"
            :maxlength="10"
            placeholder="请输入受灾户数"
            @blur="checkAffectedHouse(form)"
            type="number" 
          />
      </div>
    </div>
  </van-cell-group>
</template>

<style lang="scss" scoped>
.economicLoss-message {
  color: red;
  margin-bottom: 20px;
  color: red;
  padding: 12px 0 0 20px;
  &::after{
    display: none !important;
  }
}

</style>
