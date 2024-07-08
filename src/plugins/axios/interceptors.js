import { showFailToast } from 'vant'
import { getCodeMessages } from '@/utils/http-code-messages.js'
import { loginError } from '@/apis/index.js'
import { getCookie } from '@/utils/tools.js'
import { resetLocalStorage } from '@/utils/tools.js'
import { whiteList } from './white.js'

export const requestInterceptors = (config) => {
  config.headers.token = localStorage.token
  config.headers.platform = localStorage.platform || 'App'
  config.headers['client-version'] = '1.3.7-1-20240711'
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
  if (whiteList.includes(error?.config?.url)) {
    return Promise.reject(error)
  }
  else if (whiteList.includes(error?.response?.config?.url)) {
    return Promise.reject(error)
  }
  if (error.response?.status === 401) {
    const text = error.response?.data?.msg || '用户信息输入有误，请重新输入！'
    showFailToast({
      message: text,
    })
    const captcha_cookie = getCookie('captcha_cookie')
    if (captcha) {
      loginError(text)
    }
  }
  else if (error.response?.data?.path === '/acws/login.jsp') {
    showFailToast({
      message: '操作未授权，请重新登录',
    })
    resetLocalStorage()
    if (window.ecpot) {
      window.ecpot.close()
    } else {
      setTimeout(() => location.reload(), 500)
    }
  }
  else if (error.message === 'Network Error' && !error.response && error.isAxiosError) {
    showFailToast({
      message: '操作未授权，请重新登录',
    })
    resetLocalStorage()
    if (window.ecpot) {
      window.ecpot.close()
    } else {
      setTimeout(() => location.reload(), 500)
    }
  }
  else if (error.response?.status === 302) {
    showFailToast({
      message: '操作未授权，请重新登录',
    })
    resetLocalStorage()
    if (window.ecpot) {
      window.ecpot.close()
    } else {
      setTimeout(() => location.reload(), 500)
    }
  }
  else if (error.response?.status === 404) {
    showFailToast({
      message: error.response?.data?.error || '非法请求，请重试！',
    })
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
