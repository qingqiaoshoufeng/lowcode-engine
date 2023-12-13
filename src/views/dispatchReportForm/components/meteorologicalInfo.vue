<script setup>
import { inject } from "vue";
import SelectSingle from "@/component/SelectSingle/index";

const form = inject("form");

const fieldExist = inject('fieldExist')

const refreshField = inject('refreshField')

const showPreview = inject("showPreview");

const options = inject("options");
</script>

<template>
  <SelectSingle
    v-model:value="form.basicInformation.weather.value"
    :showPreview="showPreview"
    name="weather"
    required
    :options="options.weather"
    :field-names="{ value: 'boDictId', label: 'dictName' }"
    title="请选择天气"
    label="天气："
    placeholder="请选择天气"
    :rules="form.basicInformation.weather.rules"
  >
    <template v-slot:label="">
      <FieldAnnotation
        label="天气："
        remark-field="weather"
        field-module="basicInformation"
        :exist-data="fieldExist?.weather"
        @refresh-callback="refreshField"
      />
    </template>
  </SelectSingle>
  <van-field
    v-model="form.basicInformation.temperature.value"
    v-preview-text="showPreview"
    :readonly="showPreview"
    type="number"
    maxlength="5"
    required
    name="temperature"
    label="气温："
    placeholder="请输入气温"
    :rules="form.basicInformation.temperature.rules"
  >
    <template #extra>°C</template>
    <template v-slot:label="">
      <FieldAnnotation
        label="气温："
        remark-field="temperature"
        field-module="basicInformation"
        :exist-data="fieldExist?.temperature"
        @refresh-callback="refreshField"
      />
    </template>
  </van-field>
  <SelectSingle
    v-model:value="form.basicInformation.windDirection.value"
    :showPreview="showPreview"
    name="windDirection"
    required
    :options="options.windDirection"
    :field-names="{ value: 'boDictId', label: 'dictName' }"
    title="请选择风向"
    label="风向："
    placeholder="请选择风向"
    :rules="form.basicInformation.windDirection.rules"
  >
    <template v-slot:label="">
      <FieldAnnotation
        label="风向："
        remark-field="windDirection"
        field-module="basicInformation"
        :exist-data="fieldExist?.windDirection"
        @refresh-callback="refreshField"
      />
    </template>
  </SelectSingle>
  <SelectSingle
    v-model:value="form.basicInformation.wind.value"
    :showPreview="showPreview"
    name="wind"
    required
    :options="options.wind"
    :field-names="{ value: 'boDictId', label: 'dictName' }"
    title="请选择风力"
    label="风力："
    placeholder="请选择风力"
    :rules="form.basicInformation.wind.rules"
  >
    <template v-slot:label="">
      <FieldAnnotation
        label="风力："
        remark-field="wind"
        field-module="basicInformation"
        :exist-data="fieldExist?.wind"
        @refresh-callback="refreshField"
      />
    </template>
  </SelectSingle>
</template>