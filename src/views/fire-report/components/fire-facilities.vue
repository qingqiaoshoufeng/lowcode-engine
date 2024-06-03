<script setup>
import { inject } from 'vue'
import { gutter } from '@/utils/constants.js'
// import FieldAnnotation from '@/components/field-annotation/index.vue'

const form = inject('form')

const showPreview = inject('showPreview')

const isRequired = inject('isRequired')

const options = inject('options')

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const onIsFirefightFacility = (e) => {
  if (e === '2') {
    form.value.fireFacilities.autoAlarm.value = undefined
    form.value.fireFacilities.autoAlarmInstall.value = undefined
    form.value.fireFacilities.autoAlarmStart.value = undefined
    form.value.fireFacilities.autoAlarmEffect.value = undefined
    form.value.fireFacilities.autoAlarmNotStart.value = undefined
    form.value.fireFacilities.autoAlarmNotInstall.value = undefined
    form.value.fireFacilities.autoFireFight.value = undefined
    form.value.fireFacilities.autoFireFightInstall.value = undefined
    form.value.fireFacilities.autoFireFightStart.value = undefined
    form.value.fireFacilities.autoFireFightEffect.value = undefined
    form.value.fireFacilities.autoFireFightNotStart.value = undefined
    form.value.fireFacilities.autoFireFightNotInstall.value = undefined
    form.value.fireFacilities.indoorHydrant.value = undefined
    form.value.fireFacilities.indoorHydrantInstall.value = undefined
    form.value.fireFacilities.indoorHydrantStart.value = undefined
    form.value.fireFacilities.indoorHydrantEffect.value = undefined
    form.value.fireFacilities.indoorHydrantNotStart.value = undefined
    form.value.fireFacilities.indoorHydrantNotInstall.value = undefined
    form.value.fireFacilities.smokeControl.value = undefined
    form.value.fireFacilities.smokeControlInstall.value = undefined
    form.value.fireFacilities.smokeControlStart.value = undefined
    form.value.fireFacilities.smokeControlEffect.value = undefined
    form.value.fireFacilities.smokeControlNotStart.value = undefined
    form.value.fireFacilities.smokeControlNotInstall.value = undefined
    form.value.fireFacilities.fireShutter.value = undefined
    form.value.fireFacilities.fireShutterInstall.value = undefined
    form.value.fireFacilities.fireShutterStart.value = undefined
    form.value.fireFacilities.fireShutterEffect.value = undefined
    form.value.fireFacilities.fireShutterNotStart.value = undefined
    form.value.fireFacilities.fireShutterNotInstall.value = undefined
    form.value.fireFacilities.emergencyLight.value = undefined
    form.value.fireFacilities.lightNonConformance.value = undefined
    form.value.fireFacilities.networking.value = undefined
    form.value.fireFacilities.networkAlarm.value = undefined
    form.value.fireFacilities.fireCompartment.value = undefined
    form.value.fireFacilities.compartmentArea.value = ''
    form.value.fireFacilities.fireSeparation.value = undefined
    form.value.fireFacilities.separationMeter.value = ''
    form.value.fireFacilities.escapeRoute.value = undefined
    form.value.fireFacilities.routeNonConformance.value = undefined
    form.value.fireFacilities.emergencyExit.value = undefined
    form.value.fireFacilities.exitNonConformance.value = undefined
  }
}

const onAlarm = () => {
  const { autoAlarm } = form.value.fireFacilities
  if (autoAlarm.value === '1') {
    form.value.fireFacilities.autoAlarmNotInstall.value = undefined
  }
  else {
    form.value.fireFacilities.autoAlarmInstall.value = undefined
    form.value.fireFacilities.autoAlarmStart.value = undefined
    form.value.fireFacilities.autoAlarmEffect.value = undefined
    form.value.fireFacilities.autoAlarmNotStart.value = undefined
  }
}

const onAlarmStart = () => {
  const { autoAlarmStart } = form.value.fireFacilities
  if (autoAlarmStart.value === '1') {
    form.value.fireFacilities.autoAlarmNotStart.value = undefined
  }
  else {
    form.value.fireFacilities.autoAlarmEffect.value = undefined
  }
}

const onFireFight = () => {
  const { autoFireFight } = form.value.fireFacilities
  if (autoFireFight.value === '1') {
    form.value.fireFacilities.autoFireFightNotInstall.value = undefined
  }
  else {
    form.value.fireFacilities.autoFireFightInstall.value = undefined
    form.value.fireFacilities.autoFireFightStart.value = undefined
    form.value.fireFacilities.autoFireFightEffect.value = undefined
    form.value.fireFacilities.autoFireFightNotStart.value = undefined
  }
}

const onFireFightStart = () => {
  const { autoFireFightStart } = form.value.fireFacilities
  if (autoFireFightStart.value === '1') {
    form.value.fireFacilities.autoFireFightNotStart.value = undefined
  }
  else {
    form.value.fireFacilities.autoFireFightEffect.value = undefined
  }
}

const onIndoorHydrant = () => {
  const { indoorHydrant } = form.value.fireFacilities
  if (indoorHydrant.value === '1') {
    form.value.fireFacilities.indoorHydrantNotInstall.value = undefined
  }
  else {
    form.value.fireFacilities.indoorHydrantInstall.value = undefined
    form.value.fireFacilities.indoorHydrantStart.value = undefined
    form.value.fireFacilities.indoorHydrantEffect.value = undefined
    form.value.fireFacilities.indoorHydrantNotStart.value = undefined
  }
}

const onIndoorHydrantStart = () => {
  const { indoorHydrantStart } = form.value.fireFacilities
  if (indoorHydrantStart.value === '1') {
    form.value.fireFacilities.indoorHydrantNotStart.value = undefined
  }
  else {
    form.value.fireFacilities.indoorHydrantEffect.value = undefined
  }
}

const onSmokeControl = () => {
  const { smokeControl } = form.value.fireFacilities
  if (smokeControl.value === '1') {
    form.value.fireFacilities.smokeControlNotInstall.value = undefined
  }
  else {
    form.value.fireFacilities.smokeControlInstall.value = undefined
    form.value.fireFacilities.smokeControlStart.value = undefined
    form.value.fireFacilities.smokeControlEffect.value = undefined
    form.value.fireFacilities.smokeControlNotStart.value = undefined
  }
}

const onSmokeControlStart = () => {
  const { indoorHydrantStart } = form.value.fireFacilities
  if (indoorHydrantStart.value === '1') {
    form.value.fireFacilities.smokeControlNotStart.value = undefined
  }
  else {
    form.value.fireFacilities.smokeControlEffect.value = undefined
  }
}

const onFireShutter = () => {
  const { fireShutter } = form.value.fireFacilities
  if (fireShutter.value === '1') {
    form.value.fireFacilities.fireShutterNotInstall.value = undefined
  }
  else {
    form.value.fireFacilities.fireShutterInstall.value = undefined
    form.value.fireFacilities.fireShutterStart.value = undefined
    form.value.fireFacilities.fireShutterEffect.value = undefined
    form.value.fireFacilities.fireShutterNotStart.value = undefined
  }
}

const onFireShutterStart = () => {
  const { indoorHydrantStart } = form.value.fireFacilities
  if (indoorHydrantStart.value === '1') {
    form.value.fireFacilities.fireShutterNotStart.value = undefined
  }
  else {
    form.value.fireFacilities.fireShutterEffect.value = undefined
  }
}

const onEmergencyLight = () => {
  form.value.fireFacilities.lightNonConformance.value = undefined
}

const onNetworking = () => {
  form.value.fireFacilities.networkAlarm.value = undefined
}

const onEscapeRoute = () => {
  form.value.fireFacilities.routeNonConformance.value = undefined
}

const onEmergencyExit = () => {
  form.value.fireFacilities.exitNonConformance.value = undefined
}
</script>

<template>
  <van-cell-group class="rootform1">

    <div :gutter="gutter">
      <div :span="8">
        <van-field 
          name="fireFacilities.isFirefightFacility.value"
          label="是否安装消防设施："
          :required="isRequired"
          :rules="form.fireFacilities.isFirefightFacility.rules"
          class="field-radio"
          :class="{ 'field-not-required': !isRequired }"
        >
          <template #input>
            <van-radio-group 
              id="isFirefightFacility"
              v-model="form.fireFacilities.isFirefightFacility.value"
              v-preview-text="showPreview"
              @change="onIsFirefightFacility"
              direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
          <template v-slot:label="">
            <FieldAnnotation
              label="是否安装消防设施："
              remark-field="isFirefightFacility"
              field-module="fireFacilities"
              :exist-data="fieldExist?.isFirefightFacility"
              @refresh-callback="refreshField"
            />
          </template>
        </van-field>
      </div>
    </div>
    <template v-if="form.fireFacilities.isFirefightFacility.value === '1'">
      <div :gutter="gutter">
        <div :span="8">
          <SelectSingle
            name="fireFacilities,autoAlarm,value"
            label="自动报警系统（含独立报警）："
            :rules="form.fireFacilities.autoAlarm.rules"
            id="autoAlarm"
            v-model:value="form.fireFacilities.autoAlarm.value"
            :showPreview="showPreview"
            :options="options.install"
            allow-clear
            placeholder="请选择自动报警系统"
            @change="onAlarm"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择自动报警系统"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="自动报警系统（含独立报警）："
                remark-field="autoAlarm"
                field-module="fireFacilities"
                :exist-data="fieldExist?.autoAlarm"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div v-if="form.fireFacilities.autoAlarm.value === '1'" :span="16">
          <div :gutter="gutter" :span="8">
            <div :span="8">
              <SelectSingle
                name="fireFacilities,autoAlarmInstall,value"
                label="安装范围："
                :rules="form.fireFacilities.autoAlarmInstall.rules"
                id="autoAlarmInstall"
                v-model:value="form.fireFacilities.autoAlarmInstall.value"
                :showPreview="showPreview"
                :options="options.installRange"
                :field-names="{ value: 'boDictId', label: 'dictName' }"
                allow-clear
                placeholder="请选择安装范围"
                @change="onAlarm"
                title="请选择自动报警系统"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="安装范围："
                    remark-field="autoAlarmInstall"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.autoAlarmInstall"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.autoAlarmInstall.value" :span="8">
              <SelectSingle
                name="fireFacilities,autoAlarmStart,value"
                label="是否启动："
                :rules="form.fireFacilities.autoAlarmStart.rules"
                id="autoAlarmStart"
                v-model:value="form.fireFacilities.autoAlarmStart.value"
                :showPreview="showPreview"
                :options="options.start"
                allow-clear
                placeholder="请选择是否启动"
                @change="onAlarmStart"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择是否启动"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="是否启动："
                    remark-field="autoAlarmStart"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.autoAlarmStart"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.autoAlarmStart.value === '1'" :span="8">
              <SelectSingle
                name="fireFacilities,autoAlarmEffect,value"
                label="是否有效："
                :rules="form.fireFacilities.autoAlarmEffect.rules"
                id="autoAlarmEffect"
                v-model:value="form.fireFacilities.autoAlarmEffect.value"
                :showPreview="showPreview"
                :options="options.effect"
                allow-clear
                placeholder="请选择是否有效"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择是否有效"
                class="field-not-required"
              >
                <template v-slot:label="">
                    <FieldAnnotation
                      label="是否有效："
                      remark-field="autoAlarmEffect"
                      field-module="fireFacilities"
                      :exist-data="fieldExist?.autoAlarmEffect"
                      @refresh-callback="refreshField"
                    />
                  </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.autoAlarmStart.value === '2'" :span="8">
              <SelectSingle
                name="fireFacilities,autoAlarmNotStart,value"
                label="未启动原因："
                :rules="form.fireFacilities.autoAlarmNotStart.rules"
                id="autoAlarmNotStart"
                v-model:value="form.fireFacilities.autoAlarmNotStart.value"
                :showPreview="showPreview"
                :options="options.notStart"
                allow-clear
                placeholder="请选择未启动原因"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择未启动原因"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="未启动原因："
                    remark-field="autoAlarmNotStart"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.autoAlarmNotStart"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
          </div>
        </div>
        <div v-if="form.fireFacilities.autoAlarm.value === '2'" :span="16">
          <div :gutter="gutter" :span="8">
            <div :span="8">
              <SelectSingle
                name="fireFacilities,autoAlarmNotInstall,value"
                label="未安装原因："
                :rules="form.fireFacilities.autoAlarmNotInstall.rules"
                id="autoAlarmNotInstall"
                v-model:value="form.fireFacilities.autoAlarmNotInstall.value"
                :showPreview="showPreview"
                :options="options.uninstall"
                allow-clear
                placeholder="请选择未安装原因"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择未安装原因"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="未安装原因："
                    remark-field="autoAlarmNotInstall"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.autoAlarmNotInstall"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
          </div>
        </div>
      </div>

      <div :gutter="gutter">
        <div :span="8">
          <SelectSingle
            name="fireFacilities,autoFireFight,value"
            label="自动灭火系统（含简易喷淋）："
            :rules="form.fireFacilities.autoFireFight.rules"
            id="autoFireFight"
            v-model:value="form.fireFacilities.autoFireFight.value"
            :showPreview="showPreview"
            :options="options.install"
            allow-clear
            placeholder="请选择自动灭火系统"
            @change="onFireFight"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择自动灭火系统"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="自动灭火系统（含简易喷淋）："
                remark-field="autoFireFight"
                field-module="fireFacilities"
                :exist-data="fieldExist?.autoFireFight"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div v-if="form.fireFacilities.autoFireFight.value === '1'" :span="16">
          <div :gutter="gutter" :span="8">
            <div :span="8">
              <SelectSingle
                name="fireFacilities,autoFireFightInstall,value"
                label="安装范围："
                :rules="form.fireFacilities.autoFireFightInstall.rules"
                id="autoFireFightInstall"
                v-model:value="form.fireFacilities.autoFireFightInstall.value"
                :showPreview="showPreview"
                :options="options.installRange"
                :field-names="{ value: 'boDictId', label: 'dictName' }"
                allow-clear
                placeholder="请选择安装范围"
                title="请选择安装范围"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="安装范围："
                    remark-field="autoFireFightInstall"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.autoFireFightInstall"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.autoFireFightInstall.value" :span="8">
              <SelectSingle
                label="是否启动："
                :rules="form.fireFacilities.autoFireFightStart.rules"
                name="fireFacilities,autoFireFightStart,value"
                id="autoFireFightStart"
                v-model:value="form.fireFacilities.autoFireFightStart.value"
                :showPreview="showPreview"
                :options="options.start"
                allow-clear
                placeholder="请选择是否启动"
                @change="onFireFightStart"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择是否启动"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="是否启动："
                    remark-field="autoFireFightStart"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.autoFireFightStart"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.autoFireFightStart.value === '1'" :span="8">
              <SelectSingle
                name="fireFacilities,autoFireFightEffect,value"
                label="是否有效："
                :rules="form.fireFacilities.autoFireFightEffect.rules"
                id="autoFireFightEffect"
                v-model:value="form.fireFacilities.autoFireFightEffect.value"
                :showPreview="showPreview"
                :options="options.effect"
                allow-clear
                placeholder="请选择是否有效"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择是否有效"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="是否有效："
                    remark-field="autoFireFightEffect"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.autoFireFightEffect"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.autoFireFightStart.value === '2'" :span="8">
              <SelectSingle
                name="fireFacilities,autoFireFightNotStart,value"
                label="未启动原因："
                :rules="form.fireFacilities.autoFireFightNotStart.rules"
                id="autoFireFightNotStart"
                v-model:value="form.fireFacilities.autoFireFightNotStart.value"
                :showPreview="showPreview"
                :options="options.notStart"
                allow-clear
                placeholder="请选择未启动原因"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择未启动原因"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="未启动原因："
                    remark-field="autoFireFightNotStart"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.autoFireFightNotStart"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
          </div>
        </div>
        <div v-if="form.fireFacilities.autoFireFight.value === '2'" :span="16">
          <div :gutter="gutter" :span="8">
            <div :span="8">
              <SelectSingle
                name="fireFacilities,autoFireFightNotInstall,value"
                label="未安装原因："
                :rules="form.fireFacilities.autoFireFightNotInstall.rules"
                id="autoFireFightNotInstall"
                v-model:value="form.fireFacilities.autoFireFightNotInstall.value"
                :showPreview="showPreview"
                :options="options.uninstall"
                allow-clear
                placeholder="请选择未安装原因"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择未安装原因"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="未安装原因："
                    remark-field="autoFireFightNotInstall"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.autoFireFightNotInstall"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
          </div>
        </div>
      </div>

      <div :gutter="gutter">
        <div :span="8">
          <SelectSingle
            name="fireFacilities,autoFireFightNotInstall,value"
            label="室内消火栓系统："
            :rules="form.fireFacilities.indoorHydrant.rules"
            id="indoorHydrant"
            v-model:value="form.fireFacilities.indoorHydrant.value"
            :showPreview="showPreview"
            :options="options.install"
            allow-clear
            placeholder="请选择室内消火栓系统"
            @change="onIndoorHydrant"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择室内消火栓系统"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="室内消火栓系统："
                remark-field="indoorHydrant"
                field-module="fireFacilities"
                :exist-data="fieldExist?.indoorHydrant"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div v-if="form.fireFacilities.indoorHydrant.value === '1'" :span="16">
          <div :gutter="gutter" :span="8">
            <div :span="8">
              <SelectSingle
                name="fireFacilities,indoorHydrantInstall,value"
                label="安装范围："
                :rules="form.fireFacilities.indoorHydrantInstall.rules"
                id="indoorHydrantInstall"
                v-model:value="form.fireFacilities.indoorHydrantInstall.value"
                :showPreview="showPreview"
                :options="options.installRange"
                :field-names="{ value: 'boDictId', label: 'dictName' }"
                allow-clear
                placeholder="请选择安装范围"
                title="请选择室内消火栓系统"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="安装范围："
                    remark-field="indoorHydrantInstall"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.indoorHydrantInstall"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.indoorHydrantInstall.value" :span="8">
              <SelectSingle
                name="fireFacilities,indoorHydrantStart,value"
                label="是否启动："
                :rules="form.fireFacilities.indoorHydrantStart.rules"
                id="indoorHydrantStart"
                v-model:value="form.fireFacilities.indoorHydrantStart.value"
                :showPreview="showPreview"
                :options="options.start"
                allow-clear
                placeholder="请选择是否启动"
                @change="onIndoorHydrantStart"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择是否启动"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="是否启动："
                    remark-field="indoorHydrantStart"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.indoorHydrantStart"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.indoorHydrantStart.value === '1'" :span="8">
              <SelectSingle
                name="fireFacilities,indoorHydrantEffect,value"
                label="是否有效："
                :rules="form.fireFacilities.indoorHydrantEffect.rules"
                id="indoorHydrantEffect"
                v-model:value="form.fireFacilities.indoorHydrantEffect.value"
                :showPreview="showPreview"
                :options="options.effect"
                allow-clear
                placeholder="请选择是否有效"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择是否有效"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="是否有效："
                    remark-field="indoorHydrantEffect"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.indoorHydrantEffect"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.indoorHydrantStart.value === '2'" :span="8">
              <SelectSingle
                name="fireFacilities,indoorHydrantNotStart,value"
                label="未启动原因："
                :rules="form.fireFacilities.indoorHydrantNotStart.rules"
                id="indoorHydrantNotStart"
                v-model:value="form.fireFacilities.indoorHydrantNotStart.value"
                :showPreview="showPreview"
                :options="options.notStart"
                allow-clear
                placeholder="请选择未启动原因"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择未启动原因"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="未启动原因："
                    remark-field="indoorHydrantNotStart"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.indoorHydrantNotStart"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
          </div>
        </div>
        <div v-if="form.fireFacilities.indoorHydrant.value === '2'" :span="16">
          <div :gutter="gutter" :span="8">
            <div :span="8">
              <SelectSingle
                name="fireFacilities,indoorHydrantNotInstall,value"
                label="未安装原因："
                :rules="form.fireFacilities.indoorHydrantNotInstall.rules"
                id="indoorHydrantNotInstall"
                v-model:value="form.fireFacilities.indoorHydrantNotInstall.value"
                :showPreview="showPreview"
                :options="options.uninstall"
                allow-clear
                placeholder="请选择未安装原因"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择未安装原因"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="未安装原因："
                    remark-field="indoorHydrantNotInstall"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.indoorHydrantNotInstall"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
          </div>
        </div>
      </div>

      <div :gutter="gutter">
        <div :span="8">
            <SelectSingle
              name="fireFacilities,smokeControl,value"
              label="防排烟系统："
              :rules="form.fireFacilities.smokeControl.rules"
              id="smokeControl"
              v-model:value="form.fireFacilities.smokeControl.value"
              :showPreview="showPreview"
              :options="options.install"
              allow-clear
              placeholder="请选择防排烟系统"
              @change="onSmokeControl"
              :field-names="{ value: 'value', label: 'label' }"
              title="请选择防排烟系统"
            >
              <template v-slot:label="">
                <FieldAnnotation
                  label="防排烟系统："
                  remark-field="smokeControl"
                  field-module="fireFacilities"
                  :exist-data="fieldExist?.smokeControl"
                  @refresh-callback="refreshField"
                />
              </template>
            </SelectSingle>
        </div>
        <div v-if="form.fireFacilities.smokeControl.value === '1'" :span="16">
          <div :gutter="gutter" :span="8">
            <div :span="8">
              <SelectSingle
                name="fireFacilities,smokeControlInstall,value"
                label="安装范围："
                :rules="form.fireFacilities.smokeControlInstall.rules"
                id="smokeControlInstall"
                v-model:value="form.fireFacilities.smokeControlInstall.value"
                :showPreview="showPreview"
                :options="options.installRange"
                :field-names="{ value: 'boDictId', label: 'dictName' }"
                allow-clear
                placeholder="请选择安装范围"
                @change="onSmokeControl"
                title="请选择安装范围"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="安装范围："
                    remark-field="smokeControlInstall"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.smokeControlInstall"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.smokeControlInstall.value" :span="8">
              <SelectSingle
                name="fireFacilities,smokeControlStart,value"
                label="是否启动："
                :rules="form.fireFacilities.smokeControlStart.rules"
                id="smokeControlStart"
                v-model:value="form.fireFacilities.smokeControlStart.value"
                :showPreview="showPreview"
                :options="options.start"
                allow-clear
                placeholder="请选择是否启动"
                @change="onSmokeControlStart"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择是否启动"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="是否启动："
                    remark-field="smokeControlStart"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.smokeControlStart"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.smokeControlStart.value === '1'" :span="8">
              <SelectSingle
                name="fireFacilities,smokeControlEffect,value"
                label="是否有效："
                :rules="form.fireFacilities.smokeControlEffect.rules"
                id="smokeControlEffect"
                v-model:value="form.fireFacilities.smokeControlEffect.value"
                :showPreview="showPreview"
                :options="options.effect"
                allow-clear
                placeholder="请选择是否有效"
                @change="onSmokeControlStart"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择是否有效"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="是否有效："
                    remark-field="smokeControlEffect"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.smokeControlEffect"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.smokeControlStart.value === '2'" :span="8">
              <SelectSingle
                name="fireFacilities,smokeControlNotStart,value"
                label="未启动原因："
                :rules="form.fireFacilities.smokeControlNotStart.rules"
                id="smokeControlNotStart"
                v-model:value="form.fireFacilities.smokeControlNotStart.value"
                :showPreview="showPreview"
                :options="options.notStart"
                allow-clear
                placeholder="请选择未启动原因"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择未启动原因"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="未启动原因："
                    remark-field="smokeControlNotStart"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.smokeControlNotStart"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
          </div>
        </div>
        <div v-if="form.fireFacilities.smokeControl.value === '2'" :span="16">
          <div :gutter="gutter" :span="8">
            <div :span="8">
              <SelectSingle
                name="fireFacilities,smokeControlNotInstall,value"
                label="未安装原因："
                :rules="form.fireFacilities.smokeControlNotInstall.rules"
                id="smokeControlNotInstall"
                v-model:value="form.fireFacilities.smokeControlNotInstall.value"
                :showPreview="showPreview"
                :options="options.uninstall"
                allow-clear
                placeholder="请选择未安装原因"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择未安装原因"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="未安装原因："
                    remark-field="smokeControlNotInstall"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.smokeControlNotInstall"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
          </div>
        </div>
      </div>

      <div :gutter="gutter">
        <div :span="8">
          <SelectSingle
            name="fireFacilities,fireShutter,value"
            label="防火卷帘："
            :rules="form.fireFacilities.fireShutter.rules"
            id="fireShutter"
            v-model:value="form.fireFacilities.fireShutter.value"
            :showPreview="showPreview"
            :options="options.install"
            allow-clear
            placeholder="请选择防火卷帘"
            @change="onFireShutter"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择防火卷帘"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="防火卷帘："
                remark-field="fireShutter"
                field-module="fireFacilities"
                :exist-data="fieldExist?.fireShutter"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div v-if="form.fireFacilities.fireShutter.value === '1'" :span="16">
          <div :gutter="gutter" :span="8">
            <div :span="8">
              <SelectSingle
                name="fireFacilities,fireShutterInstall,value"
                label="安装范围："
                :rules="form.fireFacilities.fireShutterInstall.rules"
                id="fireShutterInstall"
                v-model:value="form.fireFacilities.fireShutterInstall.value"
                :showPreview="showPreview"
                :options="options.installRange"
                allow-clear
                placeholder="请选择安装范围"
                :field-names="{ value: 'boDictId', label: 'dictName' }"
                title="请选择安装范围"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="安装范围："
                    remark-field="fireShutterInstall"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.fireShutterInstall"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.fireShutterInstall.value" :span="8">
              <SelectSingle
                name="fireFacilities,fireShutterStart,value"
                label="是否启动："
                :rules="form.fireFacilities.fireShutterStart.rules"
                id="fireShutterStart"
                v-model:value="form.fireFacilities.fireShutterStart.value"
                :showPreview="showPreview"
                :options="options.start"
                allow-clear
                placeholder="请选择是否启动"
                @change="onFireShutterStart"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择是否启动"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="是否启动："
                    remark-field="fireShutterStart"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.fireShutterStart"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.fireShutterStart.value === '1'" :span="8">
              <SelectSingle
                name="fireFacilities,fireShutterEffect,value"
                label="是否有效："
                :rules="form.fireFacilities.fireShutterEffect.rules"
                id="fireShutterEffect"
                v-model:value="form.fireFacilities.fireShutterEffect.value"
                :showPreview="showPreview"
                :options="options.effect"
                allow-clear
                placeholder="请选择是否有效"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择是否有效"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="是否有效："
                    remark-field="fireShutterEffect"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.fireShutterEffect"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
            <div v-if="form.fireFacilities.fireShutterStart.value === '2'" :span="8">
              <SelectSingle
                name="fireFacilities,fireShutterNotStart,value"
                label="未启动原因："
                :rules="form.fireFacilities.fireShutterNotStart.rules"
                id="fireShutterNotStart"
                v-model:value="form.fireFacilities.fireShutterNotStart.value"
                :showPreview="showPreview"
                :options="options.notStart"
                allow-clear
                placeholder="请选择未启动原因"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择未启动原因"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="未启动原因："
                    remark-field="fireShutterNotStart"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.fireShutterNotStart"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
          </div>
        </div>
        <div v-if="form.fireFacilities.fireShutter.value === '2'" :span="16">
          <div :gutter="gutter" :span="8">
            <div :span="8">
              <SelectSingle
                name="fireFacilities,fireShutterNotInstall,value"
                label="未安装原因："
                :rules="form.fireFacilities.fireShutterNotInstall.rules"
                id="fireShutterNotInstall"
                v-model:value="form.fireFacilities.fireShutterNotInstall.value"
                :showPreview="showPreview"
                :options="options.uninstall"
                allow-clear
                placeholder="请选择未安装原因"
                :field-names="{ value: 'value', label: 'label' }"
                title="请选择未安装原因"
                class="field-not-required"
              >
                <template v-slot:label="">
                  <FieldAnnotation
                    label="未安装原因："
                    remark-field="fireShutterNotInstall"
                    field-module="fireFacilities"
                    :exist-data="fieldExist?.fireShutterNotInstall"
                    @refresh-callback="refreshField"
                  />
                </template>
              </SelectSingle>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="form.fireFacilities.isFirefightFacility.value === '1'">
      <div :gutter="gutter">
        <div :span="8">
          <SelectSingle
            name="fireFacilities,emergencyLight,value"
            label="应急疏散照明："
            :rules="form.fireFacilities.emergencyLight.rules"
            id="emergencyLight"
            v-model:value="form.fireFacilities.emergencyLight.value"
            :showPreview="showPreview"
            :options="options.regulation"
            allow-clear
            placeholder="请选择应急疏散照明"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择应急疏散照明"
            @change="onEmergencyLight"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="应急疏散照明："
                remark-field="emergencyLight"
                field-module="fireFacilities"
                :exist-data="fieldExist?.emergencyLight"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div v-if="form.fireFacilities.emergencyLight.value === '2'" :span="8">
          <SelectSingle
            name="fireFacilities,lightNonConformance,value"
            label="不符合规定原因："
            :rules="form.fireFacilities.lightNonConformance.rules"
            id="lightNonConformance"
            v-model:value="form.fireFacilities.lightNonConformance.value"
            :showPreview="showPreview"
            :options="options.lightNonConformance"
            allow-clear
            placeholder="请选择不符合规定原因"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择不符合规定原因"
            class="field-not-required"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="不符合规定原因："
                remark-field="lightNonConformance"
                field-module="fireFacilities"
                :exist-data="fieldExist?.lightNonConformance"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
      </div>

      <div :gutter="gutter">
        <div :span="8">
          <SelectSingle
            name="fireFacilities,networking,value"
            label="联网情况："
            :rules="form.fireFacilities.networking.rules"
            id="networking"
            v-model:value="form.fireFacilities.networking.value"
            :showPreview="showPreview"
            allow-clear
            :options="options.networking"
            placeholder="请选择联网情况"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择联网情况"
            @change="onNetworking"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="联网情况："
                remark-field="networking"
                field-module="fireFacilities"
                :exist-data="fieldExist?.networking"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div v-if="form.fireFacilities.networking.value === '1'" :span="8">
          <SelectSingle
            name="fireFacilities,networkAlarm,value"
            label="联网报警方式："
            label-width="124px"
            :rules="form.fireFacilities.networkAlarm.rules"
            id="networkAlarm"
            v-model:value="form.fireFacilities.networkAlarm.value"
            :showPreview="showPreview"
            :options="options.networkAlarm"
            allow-clear
            placeholder="请选择联网报警方式"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择联网报警方式"
            class="field-not-required"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="联网报警方式："
                remark-field="networkAlarm"
                field-module="fireFacilities"
                :exist-data="fieldExist?.networkAlarm"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
      </div>

      <div :gutter="gutter">
        <div :span="8">
          <SelectSingle
            name="fireFacilities,fireCompartment,value"
            label="防火分区："
            :rules="form.fireFacilities.fireCompartment.rules"
            id="fireCompartment"
            v-model:value="form.fireFacilities.fireCompartment.value"
            :showPreview="showPreview"
            :options="options.regulation"
            allow-clear
            placeholder="请选择防火分区"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择防火分区"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="防火分区："
                remark-field="fireCompartment"
                field-module="fireFacilities"
                :exist-data="fieldExist?.fireCompartment"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <van-field 
            name="fireBuilding,compartmentArea,value"
            label="分区面积（m2）："
            label-width="136px"
            :rules="form.fireFacilities.compartmentArea.rules"
            id="compartmentArea"
            v-model="form.fireFacilities.compartmentArea.value"
            v-preview-text="showPreview"
            style="width: 100%"
            allow-clear
            :maxlength="10"
            aria-autocomplete="none"
            placeholder="请输入分区面积"
            type="number" 
            class="field-not-required"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="分区面积（m2）："
                remark-field="compartmentArea"
                field-module="fireFacilities"
                :exist-data="fieldExist?.compartmentArea"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field >
        </div>
      </div>

      <div :gutter="gutter">
        <div :span="8">
          <SelectSingle
            name="fireFacilities,fireSeparation,value"
            label="防火间距："
            :rules="form.fireFacilities.fireSeparation.rules"
            id="fireSeparation"
            v-model:value="form.fireFacilities.fireSeparation.value"
            :showPreview="showPreview"
            :options="options.regulation"
            allow-clear
            placeholder="请选择防火间距"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择防火间距"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="防火间距："
                remark-field="fireSeparation"
                field-module="fireFacilities"
                :exist-data="fieldExist?.fireSeparation"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div :span="8">
          <van-field 
            name="fireBuilding,separationMeter,value"
            label="间距（m）："
            label-width="112px"
            :rules="form.fireFacilities.separationMeter.rules"
            id="separationMeter"
            v-model="form.fireFacilities.separationMeter.value"
            v-preview-text="showPreview"
            allow-clear
            style="width: 100%"
            :maxlength="10"
            aria-autocomplete="none"
            placeholder="请输入间距"
            type="number"
            class="field-not-required"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="间距（m）："
                remark-field="separationMeter"
                field-module="fireFacilities"
                :exist-data="fieldExist?.separationMeter"
                @refresh-callback="refreshField"
              />
            </template>
          </van-field >
        </div>
      </div>

      <div :gutter="gutter">
        <div :span="8">
          <SelectSingle
            name="fireFacilities,escapeRoute,value"
            label="疏散通道："
            :rules="form.fireFacilities.escapeRoute.rules"
            id="escapeRoute"
            v-model:value="form.fireFacilities.escapeRoute.value"
            :showPreview="showPreview"
            :options="options.regulation"
            allow-clear
            placeholder="请选择疏散通道"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择疏散通道"
            @change="onEscapeRoute"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="疏散通道："
                remark-field="escapeRoute"
                field-module="fireFacilities"
                :exist-data="fieldExist?.escapeRoute"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div v-if="form.fireFacilities.escapeRoute.value === '2'" :span="8">
          <SelectSingle
            name="fireFacilities,routeNonConformance,value"
            label="不符合规定原因："
            :rules="form.fireFacilities.routeNonConformance.rules"
            id="routeNonConformance"
            v-model:value="form.fireFacilities.routeNonConformance.value"
            :showPreview="showPreview"
            :options="options.routeNonConformance"
            allow-clear
            placeholder="请选择不符合规定原因"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择不符合规定原因"
            class="field-not-required"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="不符合规定原因："
                remark-field="routeNonConformance"
                field-module="fireFacilities"
                :exist-data="fieldExist?.routeNonConformance"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
      </div>

      <div :gutter="gutter">
        <div :span="8">
          <SelectSingle
            name="fireFacilities,emergencyExit,value"
            label="紧急出口："
            :rules="form.fireFacilities.emergencyExit.rules"
            id="emergencyExit"
            v-model:value="form.fireFacilities.emergencyExit.value"
            :showPreview="showPreview"
            :options="options.regulation"
            allow-clear
            placeholder="请选择紧急出口"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择紧急出口"
            @change="onEmergencyExit"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="紧急出口："
                remark-field="emergencyExit"
                field-module="fireFacilities"
                :exist-data="fieldExist?.emergencyExit"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
        <div v-if="form.fireFacilities.emergencyExit.value === '2'" :span="8">
          <SelectSingle
            name="fireFacilities,exitNonConformance,value"
            label="不符合规定原因："
            :rules="form.fireFacilities.exitNonConformance.rules"
            id="exitNonConformance"
            v-model:value="form.fireFacilities.exitNonConformance.value"
            :showPreview="showPreview"
            :options="options.exitNonConformance"
            allow-clear
            placeholder="请选择不符合规定原因"
            :field-names="{ value: 'value', label: 'label' }"
            title="请选择不符合规定原因"
            class="field-not-required"
          >
            <template v-slot:label="">
              <FieldAnnotation
                label="不符合规定原因："
                remark-field="exitNonConformance"
                field-module="fireFacilities"
                :exist-data="fieldExist?.exitNonConformance"
                @refresh-callback="refreshField"
              />
            </template>
          </SelectSingle>
        </div>
      </div>
    </template>
  </van-cell-group>
</template>
