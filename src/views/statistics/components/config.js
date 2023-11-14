import { ref } from 'vue'

export const useExcelConfig = () => {
  const luckyOption = ref({
    container: 'my-define-box', // 容器的ID
    title: 'bi', // 工作簿名称
    lang: 'zh', // 设定表格语言 国际化设置，允许设置表格的语言，支持中文("zh")和英文("en")
    forceCalculation: false,
    allowCopy: false, // 是否允许拷贝
    showtoolbar: false, // 是否显示工具栏
    showinfobar: false, // 是否显示顶部信息栏
    showsheetbar: false, // 是否显示底部sheet页按钮
    showstatisticBar: false, // 是否显示底部计数栏
    sheetBottomConfig: false, // sheet页下方的添加行按钮和回到顶部按钮配置
    allowEdit: false, // 是否允许前台编辑
    enableAddRow: false, // 允许增加行
    enableAddCol: false, // 允许增加列
    userInfo: false, // 右上角的用户信息展示样式
    showRowBar: false, // 是否显示行号区域
    showColumnBar: false, // 是否显示列号区域
    sheetFormulaBar: false, // 是否显示公式栏
    enableAddBackTop: false, // 返回头部按钮
    rowHeaderWidth: 0, // 纵坐标
    columnHeaderHeight: 0, // 横坐标
    showstatisticBarConfig: {
      count: false,
      view: false,
      zoom: false,
    },
    showsheetbarConfig: {
      add: false, // 新增sheet
      menu: false, // sheet管理菜单
      sheet: false, // sheet页显示
    },
  })

  return { luckyOption }
}
