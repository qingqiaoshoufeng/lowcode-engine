import JSEncrypt from 'jsencrypt'
import dayjs from 'dayjs'

export const treeToArray = (data, list = []) => {
    if (!Array.isArray(data)) {
        return []
    }
    data.forEach((item) => {
        if (item.children && item.children.length) {
            treeToArray(item.children, list)
        }
        else {
            list.push(item)
        }
    })
    return list
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

export const findNodeFromTreeById = (root, id, key = 'id') => {
    if (!root || !id) {
        return null
    }
    let result = null
    if (root) {
        const type = Object.prototype.toString.call(root).slice(8, -1)
        if (type === 'Object') {
            if (root[key] && root[key] === id) {
                result = root
            }
            else {
                const node = root.children || null
                findNodeFromTreeById(node, id)
            }
        }
        else if (type === 'Array') {
            const needNode = root.find(x => !!x === true && x[key] === id)
            if (needNode) {
                result = needNode
            }
            else {
                root && root.forEach((item) => {
                    if (item && item.children && item.children.length) {
                        findNodeFromTreeById(item.children, id)
                    }
                })
            }
        }
    }
    return result
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
    return [dayjs().subtract(1, 'month').startOf('day').add(1, 'day'), dayjs().endOf('day')]
}
