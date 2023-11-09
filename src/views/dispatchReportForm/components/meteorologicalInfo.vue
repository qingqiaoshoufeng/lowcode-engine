<script setup>
import { inject } from "vue";
import SelectSingle from "@/component/SelectSingle/index";

const form = inject("form");

const showPreview = inject("showPreview");

const options = inject("options");
</script>

<template>
  <SelectSingle
    v-model:value="form.basicInformation.weather.value"
    :showPreview="showPreview"
    :readonly="true"
    name="weather"
    required
    :options="options.weather"
    :field-names="{ value: 'boDictId', label: 'dictName' }"
    title="请选择天气"
    label="天气："
    placeholder="请选择天气"
    :rules="form.basicInformation.weather.rules"
  />
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
  </van-field>
  <SelectSingle
    v-model:value="form.basicInformation.windDirection.value"
    :showPreview="showPreview"
    :readonly="true"
    name="windDirection"
    required
    :options="options.windDirection"
    :field-names="{ value: 'boDictId', label: 'dictName' }"
    title="请选择风向"
    label="风向："
    placeholder="请选择风向"
    :rules="form.basicInformation.windDirection.rules"
  />
  <SelectSingle
    v-model:value="form.basicInformation.wind.value"
    :showPreview="showPreview"
    :readonly="true"
    name="wind"
    required
    :options="options.wind"
    :field-names="{ value: 'boDictId', label: 'dictName' }"
    title="请选择风力"
    label="风力："
    placeholder="请选择风力"
    :rules="form.basicInformation.wind.rules"
  />
</template>