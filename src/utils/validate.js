export const telephoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/

export const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/

export const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const deskReg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,6})?$/

// 非零正整数
export const nonZeroPositiveInteger = /^[1-9]\d*$/

// 正整数
export const positiveIntegerReg = /^[0-9]\d*$/

// 整数
export const integerReg = /^-?[1-9]\d*$/

// 非负浮点数
export const nonnegativeNumberReg = /^(\d+(\.\d+)?)?$/

export const pwdReg = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,20}$/

// 手机号、座机的校验
export const validateTelePhone = (str) => {
  if (str && str.length === 11 && str.startsWith('1')) {
    return telephoneReg.test(str)
  }
  else if (str && str.startsWith('0')) {
    return deskReg.test(str)
  }
  return false
}

// 手机号码的校验
export const validatePhone = (str) => {
  if (str) {
    return phoneReg.test(str)
  }
  return false
}

// 邮箱的校验
export const validateEmails = (str) => {
  if (str) {
    return emailReg.test(str)
  }
  return false
}

// 校验经度
export const validateLongitude = (longitude) => {
  // 校验经度范围：-180 到 180
  if (longitude < -180 || longitude > 180) {
    return false
  }
  // 校验经度格式：十进制小数或度分秒格式
  const longitudeRegex = /^-?(?:1[0-7]|[1-9])?\d(?:\.\d+)?|180(?:\.0+)?$/
  if (!longitudeRegex.test(longitude)) {
    return false
  }

  return true
}

export const validateLatitude = (latitude) => {
  // 校验纬度范围：-90 到 90
  if (latitude < -90 || latitude > 90) {
    return false
  }
  // 校验纬度格式：十进制小数或度分秒格式
  const latitudeRegex = /^-?([1-8]?\d(?:\.\d+)?|90(?:\.0+)?)$/
  if (!latitudeRegex.test(latitude)) {
    return false
  }

  return true
}

// 校验身份证
export const validIdCode = (code) => {
  const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 ',
  }
  let pass = true
  if (
    !code
    || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/i.test(
      code,
    )
  ) {
    pass = false
  }
  else if (!city[code.substr(0, 2)]) {
    pass = false
  }
  else {
    // 18位身份证需要验证最后一位校验位
    code = code.toUpperCase()
    if (code.length === 18) {
      code = code.split('')
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      let sum = 0
      let ai = 0
      let wi = 0
      for (let i = 0; i < 17; i++) {
        ai = code[i]
        wi = factor[i]
        sum += ai * wi
      }
      const last = parity[sum % 11]
      if (`${last}` !== `${code[17]}`) {
        pass = false
      }
    }
  }
  return pass
}

// 密码的校验
export const validatePwd = (str) => {
  if (str) {
    return pwdReg.test(str)
  }
  return false
}
