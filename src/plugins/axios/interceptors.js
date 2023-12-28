import { showFailToast } from 'vant'
import { getCodeMessages } from '@/utils/http-code-messages.js'
import { loginError } from '@/apis/index.js'

export const requestInterceptors = (config) => {
  config.headers.token = localStorage.token
  return config
}


export const responseInterceptors = (response) => {
  const { data, config } = response
  const { code, data: resData } = data

  if (config.noErrorHandler) {
    return response
  }
  else if (code !== 200 && code !== 302) {
    if (code === 403) {
      showFailToast({
        message: '无权限',
        description: data.message || data.msg,
      })
    }
    else if (code === 406) {
      showFailToast({
        message: '非法参数',
        description: data.message || data.msg,
      })
    }
    else if (code === 500) {
      showFailToast({
        message: '系统内部错误',
        description: data.message || data.msg,
      })
    }
    else {
      showFailToast({
        message: data.message || data.msg || '未知错误',
      })
    }

    return Promise.reject(new Error(data.message || data.msg || 'Error'))
  }

  return resData
}


export const responseError = (error) => {
  if (error.response?.status === 401) {
    const text = error.response?.data?.msg || '用户信息输入有误，请重新输入！'
    showFailToast({
      message: text,
    })
    loginError(text)
  }
  else if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BAD_REQUEST' || error.message === 'Network Error') {
    showFailToast({
      message: '操作未授权，请重新登录',
    })
    localStorage.clear()
    setTimeout(() => location.reload(), 500)
  }
  else if (error.response?.status === 302) {
    localStorage.clear()
    setTimeout(() => location.reload(), 500)
  }
  else if (error.response?.status === 404) {
    if (error.response?.path === '/acws/login.jsp') {
      localStorage.clear()
      setTimeout(() => location.reload(), 500)
    } else {
      showFailToast({
        message: error.response?.data?.error || '非法请求，请重试！',
      })
    }
  }
  else if (error.response) {
    const { status, statusText, data } = error.response
    const { message } = data
    showFailToast({
      message: `${status} ${statusText}` || '请求失败',
      description: message || getCodeMessages(status) || `未知错误 ${statusText}`,
    })
  }

  return Promise.reject(error)
}
