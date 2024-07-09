/* eslint-disable no-console */
document.addEventListener("deviceready", checkAppVersion, false);
function checkAppVersion(isProd = true) {
  if (window._SYSTEM_CURRENT_ENV === 'test') {
    isProd = false
  }
  const updateUrl = `https://stat.119.gov.cn/minio/foodreserver-apps/${isProd ? "" : "dev-"}fire-alarm-version.xml?t=${new Date().getTime()}`;
  console.log("updateUrl: ", updateUrl);
  fetch(updateUrl)
    .then((res) => res.text())
    .then((data) => {
      console.log("远程服务器APP版本信息：", data);
    });
  window.AppUpdate?.checkAppUpdate(onSuccess, onFail, updateUrl);

  function onFail() {
    console.log("fail", JSON.stringify(arguments), arguments);
  }
  function onSuccess() {
    console.log("success", JSON.stringify(arguments), arguments);
  }
}
window.__appInfo = {};
console.log("当前APP版本信息：", JSON.stringify(__appInfo));
