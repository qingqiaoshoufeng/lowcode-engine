<script setup>
import { computed, inject, ref, watch } from 'vue'
// import { message, notification } from '@castle/ant-design-vue'
import { checkFireResistanceRating } from '../config/tool.js'
import { gutter } from '@/utils/constants.js'
import { integerReg, positiveIntegerReg } from '@/utils/validate.js'
import CascaderSingle from "@/component/CascaderSingle/index";
import { showToast } from 'vant';
// import FieldAnnotation from '@/components/field-annotation/index.vue'

const form = inject('form')

const showDraft = inject('showDraft')

const isRequired = inject('isRequired')

const showPreview = inject('showPreview')

const options = inject('options')

const showSevereFire = inject('showSevereFire')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const editDiabled = ref(false)

const ratingOptions = ref(options.value.fireResistanceRating)

const diyValidateMap = inject("diyValidateMap");

const showHousingLife = computed(() => {
  return form.value.basicInfo.firePlace?.text?.indexOf('居住场所') > -1
})

watch(form.value.basicInfo.firePlace, () => {
  if (form.value.basicInfo.firePlace?.text?.indexOf('居住场所') < 0) {
    form.value.fireBuilding.housingLife.value = ''
  }
}, { deep: true })

const onBuildType = () => {
  const { fireBuilding } = form.value
  const filter = options.value.buildType?.filter(item => item.boDictId === fireBuilding.buildType.value)
  if (filter && filter[0] && filter[0].dictName === '单层') {
    form.value.fireBuilding.buildFloor.value = 1
    editDiabled.value = true
  }
  else {
    form.value.fireBuilding.buildFloor.value = ''
    editDiabled.value = false
  }
}

const validateBuildFloor = (value) => {
  const { buildType, buildFloor, buildUse } = form.value.fireBuilding
  const filter = options.value.buildType?.filter(item => item.boDictId === buildType.value)
  const use = options.value.buildUse?.filter(item => item.boDictId === buildUse.value?.[0])
  if (filter?.[0]?.dictName === '多层' && use?.[0]?.dictName === '居住使用' && (buildFloor.value < 1 || buildFloor.value > 10)) {
    return '建筑类别为多层，建筑使用用途为居住时，建筑总楼层数可选范围为1-10层'
  }
  else if (filter?.[0]?.dictName === '多层' && use?.[0]?.dictName === '公共使用' && (buildFloor.value < 1 || buildFloor.value > 9)) {
    return '建筑类别为多层，建筑使用用途为公共时，建筑总楼层数可选范围为1-9层'
  }
  else if (filter?.[0]?.dictName === '高层' && use?.[0]?.dictName === '居住使用' && buildFloor.value < 8) {
    return '建筑类别为高层，建筑使用用途为居住时，建筑总楼层数可选范围为8层以上'
  }
  else if (filter?.[0]?.dictName === '高层' && use?.[0]?.dictName === '公共使用' && buildFloor.value < 7) {
    return '建筑类别为高层，建筑使用用途为公共时，建筑总楼层数可选范围为7层以上'
  }
  else if (!value && value !== 0) {
    if (!buildFloor.rules[0].required) {
      // callback()
    }
    else {
      return '请输入建筑总楼层'
    }
  }
  else if (!positiveIntegerReg.test(value) || value === 0) {
    return '请输入正确建筑总楼层'
  }
  else {
    return true
    // callback()
  }
}

const buildFloorChange = ()=>{
  checkFireResistanceRating(form.value, options)
  diyValidateMap.value.defaultKey.push('fireBuilding.buildFloor.value')
}

const onBuildUse = (value, selectedOptions) => {
  const { buildType, buildFloor } = form.value.fireBuilding
  const filter = options.value.buildType?.filter(item => item.boDictId === buildType.value)
  if (filter?.[0]?.dictName === '多层' && selectedOptions?.[0]?.dictName === '居住使用' && (buildFloor.value < 1 || buildFloor.value > 10)) {
    showToast('建筑类别为多层，建筑使用用途为居住时，建筑总楼层数可选范围为1-10层')
    // notification.open({ message: '填报异常提醒', description: '建筑类别为多层，建筑使用用途为居住时，建筑总楼层数可选范围为1-10层', style: { backgroundColor: 'orange' } })
  }
  else if (filter?.[0]?.dictName === '多层' && selectedOptions?.[0]?.dictName === '公共使用' && (buildFloor.value < 1 || buildFloor.value > 9)) {
    // notification.open({ message: '填报异常提醒', description: '建筑类别为多层，建筑使用用途为公共时，建筑总楼层数可选范围为1-9层', style: { backgroundColor: 'orange' } })
    showToast('建筑类别为多层，建筑使用用途为公共时，建筑总楼层数可选范围为1-9层')
  }
  else if (filter?.[0]?.dictName === '高层' && selectedOptions?.[0]?.dictName === '居住使用' && buildFloor.value < 8) {
    showToast('建筑类别为高层，建筑使用用途为居住时，建筑总楼层数可选范围为8层以上')
    // notification.open({ message: '填报异常提醒', description: '建筑类别为高层，建筑使用用途为居住时，建筑总楼层数可选范围为8层以上', style: { backgroundColor: 'orange' } })
  }
  else if (filter?.[0]?.dictName === '高层' && selectedOptions?.[0]?.dictName === '公共使用' && buildFloor.value < 7) {
    showToast('建筑类别为高层，建筑使用用途为公共时，建筑总楼层数可选范围为7层以上')
    // notification.open({ message: '填报异常提醒', description: '建筑类别为高层，建筑使用用途为公共时，建筑总楼层数可选范围为7层以上', style: { backgroundColor: 'orange' } })
  }
}

const validateFireFloor = (value) => {
  const { fireBuilding } = form.value
  const filter = options.value.buildType?.filter(item => item.boDictId === fireBuilding.buildType.value)
  // debugger;
  // console.log(fireBuilding.buildFloor.value,fireBuilding.fireFloor.value);
  if (Number(fireBuilding.buildFloor.value) < Number(fireBuilding.fireFloor.value)) {
    return '失火楼层不能大于建筑总楼层'
    // callback(new Error('失火楼层不能大于建筑总楼层'))
  }
  else if (!value && value !== 0) {
    if (!fireBuilding.fireFloor.rules[0].required) {
      return true
      // callback()
    }
    else {
      // callback(new Error('请输入失火楼层'))
      return '请输入失火楼层'
    }
  }
  // else if (filter?.[0]?.dictName === '地下' && !integerReg.test(value)) {
  //   return ('请输入正确失火楼层')
  //   // callback(new Error('请输入正确失火楼层'))
  // }
  // else if (filter?.[0]?.dictName !== '地下' && (!positiveIntegerReg.test(value) || value === 0)) {
  //   return '请输入正确失火楼层'
  //   // callback(new Error('请输入正确失火楼层'))
  // }
  else if (!integerReg.test(value)) {
    return '请输入正确失火楼层'
    // callback(new Error(''))
  }
  else {
    // callback()
    return true
  }
}

const fireFloorChange = ()=>{
  diyValidateMap.value.defaultKey.push('fireBuilding.fireFloor.value')
}

const onBuildTag = (val) => {
  if (val==='2023020801767') {
    if(form.value.fireBuilding.buildTag.value.includes(val)){
      form.value.fireBuilding.buildTag.value = form.value.fireBuilding.buildTag.value.filter(item=>item !== val)
    }else{
      form.value.fireBuilding.buildTag.value = ['2023020801767']
    }
  }
  else {
    if(form.value.fireBuilding.buildTag.value.includes(val)){
      form.value.fireBuilding.buildTag.value = form.value.fireBuilding.buildTag.value.filter(item=>item !== val)
    }else{
      form.value.fireBuilding.buildTag.value = [...form.value.fireBuilding.buildTag.value,val]
    }
    form.value.fireBuilding.buildTag.value = form.value.fireBuilding.buildTag.value.filter((item)=>item !== '2023020801767')
  }
  // debugger;
  // if (e.target.checked) {
  //   if (e.target.value === '2023020801767') {
  //     form.value.fireBuilding.buildTag.value = ['2023020801767']
  //   }
  //   else {
  //     form.value.fireBuilding.buildTag.value.push(e.target.value)
  //     form.value.fireBuilding.buildTag.value = form.value.fireBuilding.buildTag.value.filter(item => item !== '2023020801767')
  //   }
  // }
  // else {
  //   form.value.fireBuilding.buildTag.value = form.value.fireBuilding.buildTag.value.filter(item => item !== e.target.value)
  // }
}
</script>

<template>
  <van-cell-group class="rootform1">
    <div>
      <div :span="24">
        <van-field 
          name="fireBuilding.buildTag.value"
          label="建筑标签："
          :rules="form.fireBuilding.buildTag.rules"
          :required="isRequired"
        >
          <template #input>
            <van-checkbox-group 
              id="buildTag"
              v-preview-text="showPreview"
              class="muti-check"
              style="width: 100%"
              placeholder="请选择建筑标签"
              :modelValue="form.fireBuilding.buildTag.value" 
              direction="vertical"
            >
              <van-checkbox  
                v-for="item in options.buildTag"
                :key="item.boDictId"
                :name="item.boDictId" 
                shape="square"
                class="checks"
                @click="onBuildTag(item.boDictId)"
                >{{ item.dictName }}</van-checkbox>
            </van-checkbox-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="建筑标签："
              remark-field="buildTag"
              field-module="fireBuilding"
              :exist-data="fieldExist?.buildTag"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
    </div>

    <div :gutter="gutter">
      <div :span="8">
        <SelectSingle
          name="fireBuilding.buildType.value"
          label="建筑类别："
          :rules="form.fireBuilding.buildType.rules"
          id="buildType"
          v-model:value="form.fireBuilding.buildType.value"
          :showPreview="showPreview"
          :options="options.buildType"
          :field-name="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择建筑类别"
          @change="onBuildType(), checkFireResistanceRating(form, options)"
          :show-search="{ filter: (inputValue, path) => path.some(option => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) }"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="建筑类别："
              remark-field="buildType"
              field-module="fireBuilding"
              :exist-data="fieldExist?.buildType"
              @refresh-callback="refreshField"
              :warningTip="form.fireBuilding.fireResistanceRating.warningText"
            />
          </template>
        </SelectSingle>
      </div>
      <div :span="8">
        <SelectSingle
          name="fireBuilding.buildStructure.value"
          label="建筑结构："
          :rules="form.fireBuilding.buildStructure.rules"
          id="buildStructure"
          v-model:value="form.fireBuilding.buildStructure.value"
          :showPreview="showPreview"
          :options="options.buildStructure"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择建筑结构"
          @change="checkFireResistanceRating(form, options)"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="建筑结构："
              remark-field="buildStructure"
              field-module="fireBuilding"
              :exist-data="fieldExist?.buildStructure"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div v-if="showSevereFire" :span="8">
        <SelectSingle
          name="fireBuilding.fireResistanceRating.value"
          label="耐火等级："
          :rules="form.fireBuilding.fireResistanceRating.rules"
          id="fireResistanceRating"
          v-model:value="form.fireBuilding.fireResistanceRating.value"
          :showPreview="showPreview"
          :options="ratingOptions"
          :field-names="{ value: 'boDictId', label: 'dictName' }"
          allow-clear
          placeholder="请选择耐火等级"
          @change="checkFireResistanceRating(form, options)"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="耐火等级："
              remark-field="fireResistanceRating"
              field-module="fireBuilding"
              :isWarning="form.fireBuilding.fireResistanceRating.warning"
              :exist-data="fieldExist?.fireResistanceRating"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
    </div>

    <div :gutter="gutter">
      <div v-if="showSevereFire" :span="8">
        <van-field 
          name="fireBuilding.buildFloor.value"
          label="建筑总楼层："
          :rules="[{ validator: validateBuildFloor, trigger: 'onBlur' }, ...form.fireBuilding.buildFloor.rules]"
          :required="isRequired"
          label-width="105"
          id="buildFloor"
          v-model="form.fireBuilding.buildFloor.value"
          v-preview-text="showPreview"
          style="width: 100%"
          :maxlength="5"
          allow-clear
          aria-autocomplete="none"
          :disabled="editDiabled"
          placeholder="请输入建筑总楼层"
          @change="buildFloorChange"
          type="digit" 
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="建筑总楼层："
              remark-field="buildFloor"
              field-module="fireBuilding"
              :exist-data="fieldExist?.buildFloor"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="showSevereFire" :span="8">
        <van-field 
          name="fireBuilding.fireFloor.value"
          label="失火楼层："
          :required="isRequired"
          :rules="[{ validator: validateFireFloor, trigger: 'onBlur' }, ...form.fireBuilding.fireFloor.rules]"
          id="fireFloor"
          v-model="form.fireBuilding.fireFloor.value"
          v-preview-text="showPreview"
          style="width: 100%"
          :maxlength="5"
          allow-clear
          aria-autocomplete="none"
          placeholder="请输入失火楼层"
          @change="fireFloorChange"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="失火楼层："
              remark-field="fireFloor"
              field-module="fireBuilding"
              :exist-data="fieldExist?.fireFloor"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="showSevereFire" :span="8">
        <van-field 
          name="fireBuilding.buildAllArea.value"
          label="总建筑面积（平方米）"
          label-width="115px"
          :rules="form.fireBuilding.buildAllArea.rules"
          id="buildAllArea"
          v-model="form.fireBuilding.buildAllArea.value"
          v-preview-text="showPreview"
          style="width: 100%"
          :required="isRequired"
          :maxlength="10"
          allow-clear
          aria-autocomplete="none"
          placeholder="请输入总建筑面积"
          type="number" 
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="总建筑面积（平方米）："
              remark-field="buildAllArea"
              field-module="fireBuilding"
              :exist-data="fieldExist?.buildAllArea"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="showSevereFire" :span="8">
        <van-field 
          name="fireBuilding.buildFloorArea.value"
          label="单层建筑面积（平方米）："
          :rules="form.fireBuilding.buildFloorArea.rules"
          :required="isRequired"
          label-width="115px"
          id="buildFloorArea"
          v-model="form.fireBuilding.buildFloorArea.value"
          v-preview-text="showPreview"
          style="width: 100%"
          :maxlength="10"
          allow-clear
          aria-autocomplete="none"
          placeholder="请输入单层建筑面积"
          type="number" 
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="单层建筑面积（平方米）："
              remark-field="buildFloorArea"
            field-module="fireBuilding"
            :exist-data="fieldExist?.buildFloorArea"
            @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
      <div v-if="showHousingLife" :span="8">
        <van-field 
          name="fireBuilding.housingLife.value"
          label="房龄（年）："
          :rules="form.fireBuilding.housingLife.rules"
          label-width="100px"
          id="housingLife"
          v-model="form.fireBuilding.housingLife.value"
          v-preview-text="showPreview"
          style="width: 100%"
          :maxlength="5"
          allow-clear
          aria-autocomplete="none"
          placeholder="请输入房龄"
          type="digit" 
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="房龄（年）："
              remark-field="housingLife"
              field-module="fireBuilding"
              :exist-data="fieldExist?.housingLife"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
    </div>

    <div :gutter="gutter">
      <div v-if="showSevereFire" :span="8">
        <CascaderSingle
          name="fireBuilding.buildUse.value"
          label="建筑使用用途："
          :rules="form.fireBuilding.buildUse.rules"
          v-model:value="form.fireBuilding.buildUse.value"
          :showPreview="showPreview"
          label-width="120"
          :options="options.buildUse"
          placeholder="请选择建筑使用用途"
          allow-clear
          :show-search="{ filter: (inputValue, path) => path.some(option => option.dictName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) }"
          @change="onBuildUse"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="建筑使用用途："
              remark-field="buildUse"
              field-module="fireBuilding"
              :exist-data="fieldExist?.buildUse"
              @refresh-callback="refreshField"
            />
          </template>
        </CascaderSingle>
      </div>
      <div v-if="showSevereFire" :span="8">
        <SelectSingle
          name="fireBuilding.isSpread.value"
          :fieldNames="{label:'label',value:'value'}"
          label="是否蔓延："
          :rules="form.fireBuilding.isSpread.rules"
          id="isSpread"
          v-model:value="form.fireBuilding.isSpread.value"
          :showPreview="showPreview"
          :options="options.isNot"
          allow-clear
          placeholder="请选择是否蔓延"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="是否蔓延："
              remark-field="isSpread"
              field-module="fireBuilding"
              :exist-data="fieldExist?.isSpread"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
      <div v-if="showSevereFire" :span="8">
        <SelectSingle
          name="fireBuilding.isLoud.value"
          label="是否发生轰燃："
          :rules="form.fireBuilding.isLoud.rules"
          label-width="120"
          :fieldNames="{label:'label',value:'value'}"
          id="isLoud"
          v-model:value="form.fireBuilding.isLoud.value"
          :showPreview="showPreview"
          :options="options.isNot"
          allow-clear
          placeholder="请选择是否发生轰燃"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="是否发生轰燃："
              remark-field="isLoud"
              field-module="fireBuilding"
              :exist-data="fieldExist?.isLoud"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
    </div>

    <div v-if="showSevereFire" :gutter="gutter">
      <div :span="8">
        <SelectSingle
          :fieldNames="{label:'label',value:'value'}"
          name="fireBuilding.isWindowOpened.value"
          label="失火建筑门窗在过程中是否开启："
          label-width="135px"
          :rules="form.fireBuilding.isWindowOpened.rules"
          id="isWindowOpened"
          v-model:value="form.fireBuilding.isWindowOpened.value"
          :showPreview="showPreview"
          :options="options.isNot"
          allow-clear
          placeholder="请选择失火建筑门窗在过程中是否开启"
        >
          <template v-slot:label="">
            <FieldAnnotation
              label="失火建筑门窗在过程中是否开启："
              remark-field="isWindowOpened"
              field-module="fireBuilding"
              :exist-data="fieldExist?.isWindowOpened"
              @refresh-callback="refreshField"
            />
          </template>
        </SelectSingle>
      </div>
    </div>

</van-cell-group>
</template>
<style scoped lang="scss">
.checks{
  margin-top:10px
}
</style>
