<script setup>
import { inject, onMounted } from 'vue'
import SelectSingle from "@/component/SelectSingle/index";
import ProCard from "@/component/ProCard/index.vue";

const form = inject('form')

const showDraft = inject('showDraft')

const isEdit = inject('isEdit')

const isDetail = inject('isDetail')

const options = inject('options')

const showPreview = inject('showPreview')

const deptMembersOptions = inject('deptMembersOptions')

const handleAddTechnician = () => {
  form.value.personInfo.technician.push({
    name: '',
  })
}

const handleDeleteTechnician = (index) => {
  form.value.personInfo.technician = form.value.personInfo.technician.filter((item, i) => i !== index)
}

const handleAddHeader = () => {
  form.value.personInfo.commandLeader.push({
    headerName: undefined,
    position: undefined,
  })
}

const handleDeleteHeader = (index) => {
  const { commandLeader } = form.value.personInfo
  form.value.personInfo.commandLeader = commandLeader.filter((item, i) => i !== index)
}

const onHaveProfessor = (e) => {
  if (e === '2') {
    form.value.personInfo.technician = []
  }
  else {
    form.value.personInfo.technician.push({ name: '' })
  }
}

onMounted(() => {
  if (!isDetail && !showDraft && form.value.personInfo.commandLeader?.length <= 0) {
    form.value.personInfo.commandLeader.push({
      headerName: undefined,
      position: undefined,
    })
  }
})
</script>

<template>
  <ProCard title="人员信息" id="personInfo" :showOpenClose="!showPreview">
    <van-cell-group>
      <div class="block-dynamic">
        <div v-for="(item, index) in form.personInfo.commandLeader" :key="index" class="block-dynamic-item">
          <div class="title">指挥员{{ index + 1}}<van-icon name="cross" v-if="!isDetail && index !== 0" @click="handleDeleteHeader(index)" /></div>
          <SelectSingle
            v-model:value="item.headerName"
            :showPreview="showPreview"
            :readonly="true"
            name="headerName"
            required
            :options="deptMembersOptions"
            :field-names="{ value: 'userId', label: 'userNameJob' }"
            title="请选择指挥员姓名"
            label="指挥员姓名："
            label-width="108px"
            placeholder="请选择指挥员姓名"
            :rules="form.personInfo.headerName.rules"
          />
          <SelectSingle
            v-model:value="item.position"
            :showPreview="showPreview"
            :readonly="true"
            name="position"
            required
            :options="options.position"
            :field-names="{ value: 'boDictId', label: 'dictName' }"
            title="请选择指挥角色"
            label="指挥角色："
            placeholder="请选择指挥角色"
            :rules="form.personInfo.position.rules"
          />
        </div>
        <template v-if="!isDetail">
          <van-button type="default" icon="plus" size="small" style="margin: 0 20px" @click="handleAddHeader">
            新增指挥员
          </van-button>
        </template>
      </div>
      <van-cell title="是否有社会技术专家：" required v-preview-text="showPreview" class="field-radio-label">
        <template #default>
          <van-radio-group
            v-model="form.personInfo.haveProfessor.value"
            icon-size="16px"
            direction="horizontal"
            @change="onHaveProfessor"
          >
            <van-radio name="1">是</van-radio>
            <van-radio name="2">否</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <div v-if="form.personInfo.haveProfessor.value === '1'" class="block-dynamic">
        <div v-for="(item, index) in form.personInfo.technician" :key="index" class="block-dynamic-item">
          <div class="title">技术专家{{ index + 1}}<van-icon name="cross" v-if="!isDetail && index !== 0" @click="handleDeleteTechnician(index)" /></div>
          <van-field
            v-model="item.name"
            v-preview-text="showPreview"
            :readonly="showPreview"
            required
            maxlength="50"
            name="name"
            label="技术专家(社会)："
            label-width="128px"
            placeholder="请输入技术专家"
            :rules="form.personInfo.name.rules"
          />
        </div>
        <template v-if="!isDetail">
          <van-button type="default" icon="plus" size="small" style="margin: 0 20px" @click="handleAddTechnician">
            新增技术专家
          </van-button>
        </template>
      </div>
    </van-cell-group>
  </ProCard>
</template>

<style lang="scss" scoped>
.block-dynamic {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 0 10px 0;
  .block-dynamic-item {
    border: 1px solid #ebebeb;
    margin: 10px 10px;
    .title {
      display: flex;
      align-items: center;
      margin: 10px 20px 0 20px;
    }
    .title i {
      margin-left: auto;
    }
  }
}
.field-radio-label {
  :deep(.van-cell__title) {
    flex: unset;
    margin-right: 10px;
  }
}
</style>
