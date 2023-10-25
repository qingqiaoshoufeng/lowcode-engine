const handlePreview = (el, binding, vnode) => {
  const parentNode = el.parentNode
  if (!parentNode || !binding.value) {
    return
  }

  let renderText = null
  let textValue = ''
  const renderDom = document.createElement('span')
  const wrapper = vnode.el.querySelector('.van-field__value')

  if (vnode.el.querySelector('.van-field__body')?.querySelector('input')) {
    textValue = vnode.el.querySelector('.van-field__body')?.querySelector('input')?.value
  } else if (vnode.el.querySelector('.van-field__body')?.querySelector('textarea')) {
    textValue = vnode.el.querySelector('.van-field__body')?.querySelector('textarea')?.value
  }

  if (textValue && wrapper) {
    // 多次渲染要先移除
    if (wrapper.querySelectorAll('.preview-text-wrapper')?.length > 0) {
      wrapper.querySelectorAll('.preview-text-wrapper')?.forEach(e => wrapper.removeChild(e))
    }
    renderText = document.createTextNode(`${textValue}`)
    renderDom.appendChild(renderText)
    // 设置样式
    renderDom.style = 'color: #323233;text-align: left;word-break: break-all;'
    renderDom.className = 'preview-text-wrapper'
    // 添加到容器节点
    wrapper.appendChild(renderDom)
  }

  if (vnode.el.querySelector('.van-icon-arrow')) { // 隐藏右向箭头
    vnode.el.querySelector('.van-icon-arrow').style.display = 'none'
  }
  if (vnode.el.querySelector('.van-field__word-limit')) { // 隐藏数字
    vnode.el.querySelector('.van-field__word-limit').style.display = 'none'
  }
  vnode.el.classList.remove('van-cell--clickable') // 移除 van-cell--clickable 样式
  if (vnode.el.querySelector('.van-field__body')) {
    vnode.el.querySelector('.van-field__body').style.display = 'none'
  }
  if (vnode.el.querySelector('.van-field__value')) {
    vnode.el.querySelector('.van-field__value').style.display = 'flex'
  }

  // 屏蔽点击事件
  vnode.el.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
  }, true)
}

export default {
  mounted: handlePreview,
  updated: handlePreview,
}
