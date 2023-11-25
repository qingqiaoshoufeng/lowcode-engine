<script setup>
import { computed, inject, nextTick, ref, watch } from 'vue'
// import { message } from '@castle/ant-design-vue'
import { formatYmdHm } from '@/utils/tools.js'
import { addFieldAnnotation, deleteFormFieldAnnotation, getFieldAnnotationList } from '@/apis/index.js'
import { showToast,showConfirmDialog  } from 'vant';
import DialogInfo from '../DialogInfo/index'

const props = defineProps({
  label:{
    type:String
  },
  id: {
    type: String,
    default: '',
  },
  remarkField: {
    type: String,
    default: '',
  },
  remarkField2: {
    type: String,
    default: '',
  },
  remarkField2Id: {
    type: Number,
    default: -1,
  },
  fieldModule: {
    type: String,
    default: '',
  },
  existData: { // 是否存在填报数据，存在则一直显示
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['refreshCallback'])

const showVisible = ref(false)

const showVisible1 = ref(false)

const showDraft = inject('showDraft', false)

const showPreview = inject('showPreview', false)

const fieldByState = inject('fieldByState', '')

const localFireWarningId = inject('localFireWarningId', '')

const localFireInfoId = inject('localFireInfoId', '')

const localFireDispatchId = inject('localFireDispatchId', '')

const localFieldRemarkId = computed(() => {
  return props.id || localFireDispatchId.value || localFireInfoId.value || localFireWarningId.value
})

const dataType = inject('dataType', 1)

const showAdd = computed(() => {
  return ((fieldByState.value !== '已归档' && fieldByState.value !== '已作废') || showVisible.value) && !showPreview.value
})

const formRef = ref(null)

const form = ref({
  remarkContent: '',
})

const remarkList = ref([])

const initList = () => {
  const params = {
    dataId: localFieldRemarkId.value,
    dataType,
    remarkField: props.remarkField,
    remarkField2: props.remarkField2,
  }
  if (props.remarkField2Id > -1) {
    params.remarkField2Id = props.remarkField2Id
  }
  getFieldAnnotationList(params).then((res) => {
    if (res) {
      remarkList.value = res
    }
  })
}

const handleCancel = () => {
  showVisible.value = false
}

const handleConfirm = () => {
  formRef.value.validate().then(async (values) => {
    const params = {
        dataId: localFieldRemarkId.value,
        dataType,
        remarkField: props.remarkField,
        remarkField2: props.remarkField2,
        remarkContent: form.value.remarkContent,
        fieldModule: props.fieldModule,
      }
      if (props.remarkField2Id > -1) {
        params.remarkField2Id = props.remarkField2Id
      }
      addFieldAnnotation(params).then((res) => {
        if (res) {
          form.value.remarkContent = ''
          showVisible.value = false
          initList()
          emits('refreshCallback')
        }
      })
  })
}

const touchstart = ()=>{
  console.log(1111);
  showVisible1.value = true
}

watch(() => showVisible.value, () => {
  if (showVisible.value) {
    nextTick(() => {
      initList()
    })
  }
})

const handleDelete = async (item) => {

showConfirmDialog({
  title: '提示',
  message:
    '确定删除该备注？',
})
  .then(async() => {
      const res = await deleteFormFieldAnnotation({
      delType: 1,
      boFieldRemarkIds: [item.boFieldRemarkId],
      dataId: item.dataId,
      dataType: item.dataType,
    })
    if (res?.data?.code === 200) {
      showVisible.value = true
      // message.success('删除成功')
      showToast('删除成功')
      initList()
      emits('refreshCallback')
    }
  })
  .catch(() => {
    // on cancel
  }); 

}
</script>
<script>
export default {
  name:'FieldAnnotation'
}
</script>

<template>
  <div class="field-annotation">
    <DialogInfo
      v-model:visible="showVisible"
      title="添加备注"
      :show-confirm-button="false"
      :show-cancel-button="false"
    >
      <template v-slot="{setHandleOk}">
        <div class="field-content" @click.stop>
          <div v-for="item in remarkList" :key="item.id" class="remark-item">
            <div class="remark-item-info">
              <!-- <a-tooltip :title="`${item.createOrgName} | ${item.createUserName}`"> -->
                <div class="info-title">
                   {{ item.createUserName }}
                </div>
              <!-- </a-tooltip> -->

              <div class="info-time">
                {{ formatYmdHm(item.updateDate) }}
              </div>
            </div>
            <div class="remark-item-content">
              <span class="content">{{ item.remarkContent }}</span>
              <span class="cha" @click.stop="handleDelete(item)">×</span>
              <!-- <template v-if="item.flag === '1'">
                <a-popconfirm
                  title="确定删除该备注？"
                  ok-text="确定"
                  cancel-text="取消"
                  :get-popup-container="triggerNode => triggerNode.ownerDocument.body"
                  @confirm="handleDelete(item)"
                >
                  <close-outlined style="color: #2F6BFF;margin: 5px 0 0 auto;" />
                </a-popconfirm>
              </template> -->
            </div>
          </div>
          <van-form
            v-if="showAdd"
            ref="formRef"
            label-align="left"
            layout="vertical"
            :model="form" autocomplete="off"
          >
          <van-field
              name="remarkContent"
              :rules="[{ required: true, message: '请输入备注内容' }]"
              v-model="form.remarkContent"
              placeholder="请输入备注内容"
              max-length="100"
            />
            <!-- <a-form-item
              name="remarkContent"
              :rules="[{ required: true, message: '请输入备注内容' }]"
            >
              <a-input
                v-model:value="form.remarkContent"
                placeholder="请输入备注内容"
                max-length="100"
              />
            </a-form-item> -->
          </van-form>
          <div v-if="showAdd" class="field-btn">
            <van-button @click="handleCancel" size="small">
              取消
            </van-button>
            <van-button type="primary" size="small" style="margin-left: 10px" @click="handleConfirm">
              确定
            </van-button>
          </div>
        </div>
      </template>
    </DialogInfo>
      <img v-if="existData" class="field-exist" src="@/assets/images/icon-edit.png" @click.stop="showVisible = true">
      <!-- <img v-else-if="showAdd" class="field-icon" :class="{ 'field-icon-show': showVisible1 }" src="@/assets/images/icon-add.png" @click.stop="showVisible = true"> -->
      <div class="label" @click.stop="showVisible = true" @touchstart.stop="touchstart" @mouseenter.stop="touchstart">{{ label }}</div>
  </div>
</template>

<style lang="scss" scoped>
.field-annotation {
  position: relative;
  // position: absolute;
  // top: -28px;
  // right: -8px;
  img{
    position: absolute;
    right: 0;
    scale: 0.8;
    top: -10px;
  }
  .field-content {
    // width: 320px;
    width: 100%;
    display: flex;
    flex-direction: column;
    :deep(.ant-col.ant-form-item-control) {
      padding: 0 0;
      background-color: white;
    }
  }
  .remark-item {
    // width: 320px;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    &-info {
      display: flex;
      align-items: center;
      .remark-item-info{
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
      .info-title {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #48556A;
        line-height: 20px;
      }
      .info-time {
        font-size: 11px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #7989A1;
        line-height: 16px;
        margin-left: auto;
      }
    }
    &-content {
      color: #48556a;
      display: flex;
      word-break: break-all;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #48556A;
      line-height: 20px;
    }
  }
  .remark-item-content{
    display: flex;
    .content{
      flex: 1;
    }
    .cha{
      color:rgba(46, 106, 253, 1);
      display: block;
      width: 20px;
      text-align: center;
      height: 20px;
    }
  }
  .field-btn {
    // display: flex;
    margin-left: auto;
    padding-bottom:20px ;
  }
  .field-icon-show {
    visibility: visible !important;
  }
  .field-exist, .field-icon {
    width: 20px;
    height: 18px;
    // visibility: hidden;
  }
}
</style>
