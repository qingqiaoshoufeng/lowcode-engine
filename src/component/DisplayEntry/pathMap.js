export const pathMap = {
  "jingqingluru":'/policeEntryList',
  "jingqingxiugai": "/policeManageEdit",
  "jingqingguanli": "/policeManageList",
  "chudongtianbao": "/dispatchReportList",
  "chudongxiugai": "/dispatchReportEdit",
  "chudongguanli": "/dispatchReportManage",
  "chudongshenhe": "/dispatchReportReview",
  'huozaitianbao': "/fire-report",
  'huozaiguanli': "/fire-manage",
  'huozaixiugai': "/fire-edit",
  'huozaishenhe':"/fire-review",
  "jingqinggengzhengshenpi": "/policeRecheckApproval",
  "jingqingzuofeishenpi": "/policeAbolishApproval",
  "chudonggengzhengshenpi": "/dispatchRecheckApproval",
  "huozaigengzhengshenpi": "/fireRecheckApproval",
  "shenqingjilu": "/applyRecord",
  "jingqingzhiliangjiandu":"/police-supervision",
  "huozaizhiliangjiandu":"/fire-supervision",
  "chudongzhiliangjiandu":'/dispatch-supervision',
  "jingqingchaoshitongji":"/police-timeout",
  "huozaichaoshitongji":"/fire-timeout",
  "chudongchaoshitongji":"/dispatch-timeout",
  // 已办
  "weitianbaoduizhantongji":"/station-timeout",
  "policeDispatched":'have-done-info/policeDispatched',
  "policeRejected":'have-done-info/policeRejected',
  "policeAmend":'have-done-info/policeAmend',
  "policeInvalid":'have-done-info/policeInvalid',
  "policeConfirmed":'have-done-info/policeConfirmed',
  "policeDispatchArea":'have-done-info/policeDispatchArea',
  "dispatchFilled":'have-done-info/dispatchFilled',
  "dispatchReviewed":'have-done-info/dispatchReviewed',
  "dispatchIdRejected":'have-done-info/dispatchIdRejected',
  "dispatchAmend":'have-done-info/dispatchAmend',
  "fireFilled":'have-done-info/fireFilled',
  "fireReviewed":'have-done-info/fireReviewed',
  "fireReject":'have-done-info/fireReject',
  "fireAmend":'have-done-info/fireAmend',
  "jingqingqueren": '/policeConfirm',
  "jingqingzhuanpai": '/policeTransfer',
  "jingqingzuofei":'/police-delete',
  "huozaizuofei":'/fire-delete',
  'huozaizuofeishenpi':'/fire-abolish-approval',
}

export const permission={
  "jingqingluru":["admin", "police-entry"],
  "jingqingxiugai": ["admin", "police-manage"],
  "jingqingguanli": ["admin", "police-manage"],
  "chudongtianbao": ["admin", "dispatch-report"],
  "chudongxiugai": ["admin", "dispatch-manage"],
  "chudongguanli": ["admin", "dispatch-manage"],
  "chudongshenhe": ["admin", "dispatch-review"],
  'huozaitianbao': ["admin", "fire-report"],
  'huozaiguanli': ["admin", "fire-manage"],
  'huozaixiugai': ["admin", "fire-manage"],
  'huozaishenhe':["admin", "fire-review"],
  "jingqinggengzhengshenpi": ["admin", "police-recheck-approval"],
  "jingqingzuofeishenpi": ["admin", "police-abolish-approval"],
  "chudonggengzhengshenpi": ["admin", "dispatch-recheck-approval"],
  "huozaigengzhengshenpi": ["admin", "fire-recheck-approval"],
  "shenqingjilu": ["admin", "apply-record"],
  "jingqingqueren":["admin", "police-confirm"],
  "jingqingzhuanpai":["admin", "police-redeploy"],
  "jingqingzhiliangjiandu": ["admin", "police-supervision"],
  "huozaizhiliangjiandu":["admin", "fire-supervision"],
  "chudongzhiliangjiandu":["admin", "dispatch-supervision"],
  "jingqingchaoshitongji":["admin", "police-timeout"],
  "huozaichaoshitongji":["admin", "fire-timeout"],
  "chudongchaoshitongji":["admin", "dispatch-timeout"],
  "jingqingzuofei":["admin", "police-delete"],
  "weitianbaoduizhantongji":["admin", "station-timeout"]
}
  