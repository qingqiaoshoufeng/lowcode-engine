document.addEventListener("deviceready", checkAppVersion, false);
function checkAppVersion(isProd = true) {
  const updateUrl = `http://223.4.79.9:31201/foodreserver-apps/${
    isProd ? "" : "dev-"
  }fire-alarm-version.xml?t=${new Date().getTime()}`;
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
