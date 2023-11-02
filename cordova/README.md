打包

npm run build:app

cd cordova

cordova build

模拟器调试

cordova emulate

真机调试

cordova run android

列出本地的模拟器
emulator -list-avds
打开模拟器 emulator -avd avd_name

！！！重新执行 cordova platform add android 之后，记得修改 project.properties 文件中的内容
