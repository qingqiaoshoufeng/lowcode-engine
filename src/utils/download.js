export const downLoad =({url,name})=>{
  if(window.cordova){
    cordova.InAppBrowser.open(encodeURI(url), "_system");
    return 
  }
  const link = document.createElement('a')
  link.style.display = 'none'
  link.setAttribute('download', `${name}`)
  link.setAttribute('href', `${url}`)
  link.click()
}