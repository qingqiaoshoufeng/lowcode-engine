import dayjs from 'dayjs'

// 格式化时间：YYYY-MM-DD HH:mm
export const formatYmdHm = (date, type = 'YYYY-MM-DD HH:mm') => {
  if (!date) {
    return ''
  }
  return dayjs(date).format(type)
}

export const formatDispatchType = (row) => {
  switch (row.dispatchType) {
  case '1':
    return '主战'
  case '2':
    return '增援'
  case '3':
    return '指挥'
  }
}

export const formatShow = (visible) => {
  switch (visible) {
  case '1':
    return '显示'
  default:
    return '隐藏'
  }
}

export const formatMenuType = (menuType) => {
  switch (menuType) {
  case 'M':
    return '目录'
  case 'C':
    return '菜单'
  default:
    return '按钮'
  }
}

export const formatUserType = (userType) => {
  switch (userType) {
  case '1':
    return '指挥员'
  case '2':
    return '消防员'
  case '3':
    return '文员'
  }
}
