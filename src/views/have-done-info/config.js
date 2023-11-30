import {
  getDispatchManageList,
  getDispatchReviewList,
  getFinish,
  getFireManageList,
  getFireReviewList,
  getFireWarningAbolishApproval,
  getFireWarningEditApproval,
  getFireWarningManage,
  getPoliceConfirmList,
  getPoliceRedeployList,
} from '@/apis/index.js'

export const getInitInfo =(type,orgLevel)=>{ 
  const map = { 
    policeDispatched:{
      name: '已派发',
      value: '1',
      getListFn: getFireWarningManage,
      // columns: policeManageColumns,
      rowKey: 'boFireWarningId',
      childrenColumnName: 'dispatchList',
      query: {
        // time: time.value,
        finishQueryFlag: '1',
      },
    },
  
    policeRejected:{
      name: '已驳回',
      value: '2',
      getListFn: getFireWarningManage,
      // columns: policeManageColumns,
      rowKey: 'boFireWarningId',
      childrenColumnName: 'dispatchList',
      query: {
        // time: time.value,
        finishQueryFlag: '2',
      },
    },
    policeAmend:{
      name: '更正已审批',
      value: '3',
      getListFn: getFireWarningEditApproval,
      // columns: policeRecheckColumns,
      rowKey: 'boFireRecheckId',
      query: {
        // time: time.value,
        recheckType: 1,
        state: 'completed',
      },
    },
    policeInvalid:{
      name: '作废已审批',
      value: '4',
      getListFn: getFireWarningAbolishApproval,
      // columns: policeAbolishColumns,
      rowKey: 'boFireRecheckId',
      query: {
        // time: time.value,
        recheckType: 1,
        state: 'completed',
      },
    },
    policeConfirmed:{
      name: '已确认（跨区）',
      value: '5',
      getListFn: getPoliceConfirmList,
      // // columns: policeConfirmColumns,
      rowKey: 'boFireWarningId',
      query: {
        confirmFlag: 2,
      },
    },
    policeDispatchArea:{
      name: '已转派（跨区）',
      value: '6',
      getListFn: getPoliceRedeployList,
      // // columns: policeRedeployColumns,
      rowKey: 'boFireWarningId',
      query: orgLevel === 2
        ? {
          provinceFlag: '1',
          provinceTransfer: '1',
        }
        : {
          cityFlag: '1',
          cityTransfer: '1',
        },
    }, 
    dispatchFilled:{
      name: '已填报',
      value: '1',
      getListFn: getDispatchManageList,
      // // columns: dispatchManageColumns,
      rowKey: 'boFireDispatchId',
      query: {
        // time: time.value,
        finishQueryFlag: '1',
      },
    },
    dispatchReviewed:{
      name: '已审核',
      value: '2',
      getListFn: getDispatchReviewList,
      // // columns: dispatchReviewColumns,
      rowKey: 'boFireDispatchId',
      query: {
        // time: time.value,
        reviewType: 1,
        state: 'completed',
      },
    },
    dispatchIdRejected:{
      name: '已驳回',
      value: '3',
      getListFn: getDispatchManageList,
      // // columns: dispatchManageColumns,
      rowKey: 'boFireDispatchId',
      query: {
        // time: time.value,
        finishQueryFlag: '2',
      },
    },
    dispatchAmend:{
      name: '更正已审批',
      value: '4',
      getListFn: getFireWarningEditApproval,
      // // columns: dispatchRecheckColumns,
      rowKey: 'boFireDispatchId',
      query: {
        // time: time.value,
        recheckType: 2,
        state: 'completed',
      },
    },
    fireFilled:{
      name: '已填报',
      value: '1',
      getListFn: getFireManageList,
      // // columns: fireManageColumns,
      rowKey: 'boFireInfoId',
      query: {
        // time: time.value,
        finishQueryFlag: '1',
      },
    },
    fireReviewed:{
      name: '已审核',
      value: '2',
      getListFn: getFireReviewList,
      // // columns: fireReviewColumns,
      rowKey: 'boFireInfoId',
      query: {
        // time: time.value,
        reviewType: 2,
        state: 'completed',
      },
    },
    fireReject:{
      name: '已驳回',
      value: '3',
      getListFn: getFireManageList,
      // // columns: fireManageColumns,
      rowKey: 'boFireInfoId',
      query: {
        // time: time.value,
        finishQueryFlag: '2',
      },
    },
    fireAmend:{
      name: '更正已审批',
      value: '4',
      getListFn: getFireWarningEditApproval,
      // // columns: fireRecheckColumns,
      rowKey: 'boFireInfoId',
      query: {
        // time: time.value,
        recheckType: 3,
        state: 'completed',
      },
    }
  }
  return map[type]
}
