import JSEncrypt from 'jsencrypt'
import dayjs from 'dayjs'

export const treeToArray = (data) => {
  if (!Array.isArray(data) || !data.length) {
    return []
  }
  const res = []
  data.forEach((v) => {
    // tree的每个元素都 放入到 res里面
    res.push(v)
    if (v.children) {
      // 有children 就把 children数据递归 返回  依次放到 res里面
      res.push(...treeToArray(v.children))
    }
  })
  return res
}

/**
 * 加密
 */
export const encrypt = (str) => {
  const encryptor = new JSEncrypt()
  const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAODbtXat5c8fR04+lW29giSeYF6nSorQ5QX4ew77vzk9XrmM9S6hWJbMWErlY09X9xKPhUU17/L35KRALWjK1uECAwEAAQ=='
  encryptor.setPublicKey(publicKey)
  return encryptor.encrypt(str)
}

export function findNodeFromTreeById(rootNode, targetId, key = 'id') {
  // 如果根节点就是目标节点，直接返回
  if (rootNode[key] === targetId) {
    return rootNode;
  }
  
  // 遍历子节点，查找目标节点
  for (let i = 0; i < rootNode.children?.length; i++) {
    const childNode = rootNode.children[i];
    // 递归查找子节点
    const resultNode = findNodeFromTreeById(childNode, targetId, key);
    // 如果找到目标节点，则返回
    if (resultNode !== null) {
      return resultNode;
    }
  }
  
  // 没有找到目标节点，返回null
  return null;
}

// 找到所有父节点的函数
export function findParentNodes(root, targetValue) {
  // 存储找到的父节点
  const parentNodes = []

  // 递归遍历树节点
  function traverse(node, targetValue, parents) {
    if (node.boDictId === targetValue) {
      // 当前节点为目标节点，将其父节点加入结果数组
      parentNodes.push(...parents)
    }
    else {
      // 当前节点不是目标节点，继续递归遍历子节点
      parents.push(node)
      if (node?.children) {
        for (const child of node.children) {
          traverse(child, targetValue, parents)
        }
      }
      parents.pop()
    }
  }

  // 从根节点开始遍历
  traverse(root, targetValue, [])

  return parentNodes
}

// 表单验证失败，滚动到失败项：https://www.jianshu.com/p/59d90ae35c86
export const scrollFormFailed = () => {
  const errorList = document.querySelectorAll('.ant-form-item-has-error')
  errorList[0]?.scrollIntoView({
    block: 'center',
    behavior: 'smooth',
  })
}

// 获取近一个月
export const getLastMonth = () => {
  return [dayjs().subtract(1, 'month').startOf('day').add(1, 'day'), dayjs().endOf('day'), '近一月']
}

// 根据 key, value 生成数组对象，比如：列表返回了状态key，状态value
export const generateByKeyValue = (keys, values, fields, keyType) => {
  if (!keys || !values) {
    return
  }
  const key = keys.split(',')
  const value = values.split(',')
  return key.map((item, index) => {
    const object = {}
    object[fields.key] = item
    object[fields.value] = keyType ? Number(value[index]) : value[index]
    return object
  })
}

// 不同状态颜色
export const generateColorByState = (state) => {
  switch (state) {
  case '编辑中':
  case '填报中':
  case '复核中':
  case '审核中':
  case '待填报':
  case '更正中':
  case '待完善':
  case '待审批':
  case '审批中':
  case '待处理':
  case '确认中':
  case '1': // 待审核
  case '2': // 审核中
  case 'running': // 正在审批
    return { 'state-wait': true } // 橙黄
  case '已作废':
  case '被驳回':
  case '被退回':
  case '被终止':
  case '被终结':
  case '待更正':
  case '已挂起':
  case '4': // 被终止
    return { 'state-reject': true } // 红色
  case '已派发':
  case '已填报':
  case '已审核':
  case '已归档':
  case '已审批':
  case '已挂接':
  case '已转派':
  case '3': // 已审核
  case 'completed': // 已完成
    return { 'state-finish': true } // 绿色
  default:
    return ''
  }
}

// 不同状态颜色
export const generateTextByState = (state) => {
  switch (state) {
  case '编辑中':
  case '填报中':
  case '复核中':
  case '审核中':
  case '待填报':
  case '更正中':
  case '待完善':
  case '待审批':
  case '审批中':
  case '确认中':
  case '1': // 待审核
  case '2': // 审核中
  case 'running': // 正在审批
    return { 'state-wait-text': true } // 橙黄
  case '已作废':
  case '被驳回':
  case '被退回':
  case '被终止':
  case '被终结':
  case '待更正':
  case '4': // 被终止
    return { 'state-reject-text': true } // 红色
  case '已派发':
  case '已填报':
  case '已审核':
  case '已归档':
  case '已审批':
  case '3': // 已审核
  case 'completed': // 已完成
    return { 'state-finish-text': true } // 绿色
  default:
    return ''
  }
}

export const generateTextByStatus = (state) => {
  switch (state) {
  case '1':
    return '待审批'
  case '2':
    return '审批中'
  case '3':
    return '已审批'
  case '4':
    return '被终结'
  case 'running':
    return '正在审批'
  case 'completed':
    return '已完成'
  default:
    return ''
  }
}

export const generateColorByType = (state) => {
  switch (state) {
  case '重要信息更正':
  case '不同意':
  case 'running':
  case '审核中':
    return { 'state-important': true } // 红色
  case '普通信息更正':
  case '同意更正':
  case '同意作废':
  case 'completed':
  case '已审核':
    return { 'state-common': true } // 绿色
  case '其他':
    return { 'state-other': true } // 灰色
  default:
    return ''
  }
}

export const generateColorByVisible = (state) => {
  switch (state) {
  case '2':
  case '派生':
    return { 'state-important': true } // 红色
  case '1':
  case '通用':
    return { 'state-common': true } // 绿色
  default:
    return { 'state-important': true } // 红色
  }
}

export const checkPoliceChangeState = (status, updatePermission) => {
  return ['已派发', '填报中', '已填报', '已审核'].includes(status) && updatePermission
}

export const checkDispatchChangeState = (status, updatePermission) => {
  return ['已审核'].includes(status) && updatePermission
}

export const checkFireChangeState = (status, updatePermission) => {
  return ['已审核'].includes(status) && updatePermission
}

export const checkAbolishState = (status, updatePermission) => {
  return ['已派发', '被退回', '填报中', '已填报', '已审核', '被驳回', '复核中', '确认中'].includes(status) && updatePermission
}

export const checkRejectState = (status) => {
  return !['已归档', '已作废', '被驳回'].includes(status)
}

export const checkInputRejectState = (status) => {
  return ['已审核'].includes(status)
}

export const checkDispatchApproval = (status) => {
  return ['待填报', '审核中', '被退回'].includes(status)
}

export const checkFireApproval = (status) => {
  return ['待填报', '审核中'].includes(status)
}

// 补零函数
export const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 格式化时间：YYYY-MM-DD HH:mm
export const formatYmdHm = (date, type = 'YYYY-MM-DD HH:mm') => {
  if (!date) {
    return ''
  }
  return dayjs(date).format(type)
}

// 时间差
export const formatDiff = (startTime, endTime) => {
  if (!endTime || !startTime || startTime >= endTime) {
    return ''
  }
  const diffTime = dayjs.duration(endTime - startTime)
  const day = diffTime.days() // 天
  const hours = diffTime.hours() // 小时
  const minutes = diffTime.minutes() // 分
  return `${formatNumber(day * 24 + hours)}小时${formatNumber(minutes)}分钟`
}

export const renderLayoutHeight = () => {
  return `${document.body.clientHeight - 157}px`
}

export const getTagsKeyValue = (tags) => {
  if (!tags || tags.length < 0) {
    return {}
  }
  const result = {}
  tags.forEach((item) => {
    result[item.key] = 1
  })
  return result
}

// 根据 key 获取 label。
export const getNameByKey = (arr, key, field) => {
  if (!arr || arr.length <= 0) {
    return ''
  }
  const filter = arr.filter(item => item[field.key] === key)
  return filter?.length > 0 ? filter[0][field.label] : ''
}

// 根据身份证获取年龄、性别
export const getInfoByCard = (idCard) => {
  let birthday = ''
  let sex = ''
  if (idCard.length === 15) {
    birthday = `19${idCard.substring(6, 8)}-${idCard.substring(
      8,
      10,
    )}-${idCard.substring(10, 12)}`
    sex = idCard[14] % 2 === 0 ? '2' : '1'
  }
  else {
    birthday = `${idCard.substring(6, 10)}-${idCard.substring(
      10,
      12,
    )}-${idCard.substring(12, 14)}`
    sex = idCard[16] % 2 === 0 ? '2' : '1'
  }
  return {
    age: dayjs().diff(dayjs(birthday), 'year'),
    sex,
  }
}

// 车辆节点
export const fixCarInfo = (list) => {
  if (!list || list?.length <= 0) {
    return undefined
  }
  return list.map((item) => {
    return {
      ...item,
      key: item.boFireTruckId,
      value: item.boFireTruckId,
      label: item.truckNumber,
    }
  })
}

// 车辆参数
export const fixCarParams = (list) => {
  if (!list || list?.length <= 0) {
    return []
  }
  return list.map((item) => {
    return { truckNumber: item.label, boFireTruckId: item.value }
  })
}

// 从字典获取警情类型中文
export const getTypeText = (warningType, options) => {
  if (!warningType || warningType.length <= 0 || !options) {
    return []
  }
  const list = treeToArray(options)
  const result = []
  warningType.forEach((item) => {
    const filter = list.filter(temp => temp.boDictId === item)
    if (filter?.length > 0) {
      result.push(filter[0].dictName)
    }
  })
  return result
}

// 交换数组中两个元素位置
export const changeArrayPosition = (array, index1, index2) => {
  const temp = array[index1]
  array[index1] = array[index2]
  array[index2] = temp
  return array
}

// 下载文件
export function downloadFile(obj, name, mimeType) {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.setAttribute('download', `${name}`)
  // 字符内容转变成blob地址
  let url = null
  if (mimeType) {
    url = window.URL.createObjectURL(new Blob([obj], { type: mimeType }))
  }
  else {
    url = window.URL.createObjectURL(new Blob([obj]))
  }
  link.href = url
  // 自动触发点击
  document.body.appendChild(link)
  link.click()
  // 然后移除
  document.body.removeChild(link)
}

export const traverseTree = (node, callback) => {
  // 调用回调函数，对节点进行处理
  callback(node)

  // 遍历子节点
  if (node.children && node.children.length) {
    for (let i = 0; i < node.children.length; i++) {
      traverseTree(node.children[i], callback)
    }
  }
}

// 数字转汉字
export const toChineseNumber = (number) => {
  const CHINESE_NUMBERS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const CHINESE_UNITS = ['', '十', '百', '千']

  if (number === 0) {
    return '零'
  }

  const [integer, decimal] = number.toString().split('.')
  let integerPart = ''
  let decimalPart = ''

  if (integer !== '0') {
    integerPart = integer.split('').reverse().map((value, index) => {
      return CHINESE_NUMBERS[value] + (value === '0' ? '' : CHINESE_UNITS[index % 4])
    }).reverse().join('').replace(/零+/g, '零').replace(/零$/g, '')
    if (number > 9 && number < 20) {
      integerPart = integerPart.replace('一', '')
    }
  }

  if (decimal) {
    decimalPart = decimal.split('').map(value => CHINESE_NUMBERS[value]).join('')
  }

  return integerPart + (decimalPart ? `点${decimalPart}` : '') || '零'
}

export const getPreviousColumn = (column) => {
  // 将列字母转换为大写形式
  column = column.toUpperCase()
  const length = column.length - 1
  // 逐个处理每个字符
  let i = column.length - 1
  while (i >= 0) {
    const charCode = column.charCodeAt(i)
    let len = column.length - 1
    // 如果当前字符为 A，则将其替换为 Z，并向前进位
    if (charCode === 65) {
      const charArray = column.split('')
      if (charArray[i - 1] === 'A' && len === length) {
        len--
      }
      else {
        charArray[i] = 'Z'
      }
      column = charArray.join('').substring(0, len + 1)
      i--
    }
    else {
      // 将当前字符的 ASCII 码减去 1，然后将结果替换回字母表示
      const previousChar = String.fromCharCode(charCode - 1)
      const charArray = column.split('')
      charArray[i] = previousChar
      column = charArray.join('')
      break
    }
  }
  return column
}

// 超时时间超过阈值，显示样式
export const checkTimeout = (time, threshold = 24) => {
  if (time && time.includes('时')) {
    const num = time?.slice(0, time.indexOf('时'))
    return Number(num) > threshold
  }
  return false
}

export const initBackLogin = () => {
  let timeoutId = setTimeout(() => {
    Modal.confirm({
      title: '您已长时间未操作，请重新登录！',
      icon: createVNode(ExclamationCircleOutlined),
      cancelButtonProps: {
        style: { display: 'none' },
      },
      onOk: async () => {
        localStorage.clear()
        location.reload()
      },
    })
  }, 1800 * 1000)
  document.getElementById('app').addEventListener('click', () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      Modal.confirm({
        title: '您已长时间未操作，请重新登录！',
        icon: createVNode(ExclamationCircleOutlined),
        cancelButtonProps: {
          style: { display: 'none' },
        },
        onOk: async () => {
          localStorage.clear()
          location.reload()
        },
      })
    }, 1800 * 1000)
  }, false)
}

// 将 base64 数据转换为 Blob 对象
export const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}
