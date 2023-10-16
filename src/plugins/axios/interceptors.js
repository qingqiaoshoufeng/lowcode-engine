import { Toast } from 'vant'


export const requestInterceptors = (config) => {
    debugger;
    config.headers.token = localStorage.token
    return config
}


export const responseInterceptors = (response) => {
    console.log(111);
    debugger;
    const { data, config } = response
    const { code, data: resData } = data

    if (config.noErrorHandler) {
        return response
    }
    else if (code !== 200 && code !== 302) {
        if (code === 403) {
            Toast.error({
                message: '无权限',
                description: data.message || data.msg,
            })
        }
        else if (code === 406) {
            Toast.info({
                message: '非法参数',
                description: data.message || data.msg,
            })
        }
        else if (code === 500) {
            Toast.error({
                message: '系统内部错误',
                description: data.message || data.msg,
            })
        }
        else {
            Toast.error({
                message: data.message || data.msg || '未知错误',
            })
        }

        return Promise.reject(new Error(data.message || data.msg || 'Error'))
    }

    return resData
}


export const responseError = (err) => {
    debugger;
    if (error.response?.status === 401) {
        const text = error.response?.data?.msg || '用户信息输入有误，请重新输入！'
        Toast.error({
            message: text,
        })
        loginError(text)
    }
    else if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BAD_REQUEST') {
        Toast.error({
            message: '操作未授权，请重新登录',
        })
        localStorage.clear()
        setTimeout(() => location.reload(), 500)
    }
    else if (error.response?.status === 404) {
        Toast.error({
            message: error.response?.data?.error || '非法请求，请重试！',
        })
    }
    else if (error.response) {
        const { status, statusText, data } = error.response
        const { message } = data

        if (status === 401 || status === 302) {
            Toast.error({
                message: '操作未授权',
                description: message || '授权验证失败',
            })
        }
        else {
            Toast.error({
                message: `${status} ${statusText}` || '请求失败',
                description: message || getCodeMessages(status) || `未知错误 ${statusText}`,
            })
        }
    }

    return Promise.reject(error)
}