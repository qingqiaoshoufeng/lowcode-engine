
const handlePreview = (el, binding, vnode) => {
  const parentNode = el.parentNode
  if (!parentNode || !binding.value) {
    return
  }

  let renderText = null
  let textValue = ''
  const renderDom = document.createElement('p')
  const wrapper = vnode.el.querySelector('.van-field__value')
  const cell = vnode.el.querySelector('.van-cell__value')
  const radioGroup = vnode.el.querySelector('.van-cell__value .van-radio-group') || el.className.includes('van-radio-group') 

  if (vnode.el.querySelector('.van-field__body')?.querySelector('input')) {
    textValue = vnode.el.querySelector('.van-field__body')?.querySelector('input')?.value
  } else if (vnode.el.querySelector('.van-field__body')?.querySelector('textarea')) {
    textValue = vnode.el.querySelector('.van-field__body')?.querySelector('textarea')?.value
  } else if (radioGroup) {
    textValue = vnode.el.querySelector('.van-radio-group')?.querySelector('[aria-checked="true"]')?.querySelector('.van-radio__label')?.innerText || el.querySelector('[aria-checked="true"]')?.querySelector('.van-radio__label')?.innerText
    if (!vnode.el.querySelector('.van-radio-group')?.querySelector('[aria-checked="true"]') && !el.querySelector('[aria-checked="true"]')) {
      textValue = ' '
    }
  }
  if(el.className.includes('muti-check')){
    const context = Array.from(el.querySelectorAll('[aria-checked="true"]')).map(item=>{
      return item.children[1].innerText
    }).join()
    el.innerText = context
  }
  // if(el.className.includes('cascader-single')){
  //   // const context = el.querySelector('input').value
  //   const icon = el.querySelector('i')
  //   console.log('icon',icon);
  //   if(icon){
  //     debugger
  //     el.removeChild(icon)
     
  //     console.log('icon',icon);
  //   }
  //   el.classList.add('p_e_n')
  //   // right.innerText = context
  // }

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
  } else if (textValue && radioGroup && cell) {
    // 多次渲染要先移除
    if (cell.querySelectorAll('.preview-text-wrapper')?.length > 0) {
      cell.querySelectorAll('.preview-text-wrapper')?.forEach(e => cell.removeChild(e))
    }
    renderText = document.createTextNode(`${textValue}`)
    renderDom.appendChild(renderText)
    // 设置样式
    renderDom.style = 'color: #323233;text-align: left;word-break: break-all;'
    renderDom.className = 'preview-text-wrapper'
    // 添加到容器节点
    cell.appendChild(renderDom)
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
  if (vnode.el.querySelector('.van-radio-group')) {
    vnode.el.querySelector('.van-radio-group').style.display = 'none'
  }
  
  // 屏蔽点击事件
  vnode.el.addEventListener('click', (event) => {
    vnode.el.style.pointEvent='none'
    // event.stopPropagation();
    // event.preventDefault();
  }, true)
  if(textValue && el.children[0] && el.children[0].ariaChecked){
    el.innerText = textValue
  }
}

export default {
  mounted: handlePreview,
  updated: handlePreview,
}
