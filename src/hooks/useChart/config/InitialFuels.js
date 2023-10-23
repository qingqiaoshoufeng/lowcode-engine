import { isType } from '@/utils/types.js'

// const mockData = [
//   {
//     "lvl5Id": null,
//     "lvl5Name": null,
//     "cd": null,
//     "hzCount": 146,
//     dictName: '属于彩钢顶棚',
//     "parentDictId": null,
//     "boDictId": null,
//     "dateAnalysisEightResultList": null,
//     "dateAnalysisEightResultListYe": null,
//     "dateAnalysisEightResultListDc": null,
//     "dateAnalysisEightResultFireList": null
//   },
//   {
//     "lvl5Id": null,
//     "lvl5Name": null,
//     "cd": null,
//     "hzCount": 12,
//     dictName: '建筑外墙',
//     "parentDictId": null,
//     "boDictId": null,
//     "dateAnalysisEightResultList": null,
//     "dateAnalysisEightResultListYe": null,
//     "dateAnalysisEightResultListDc": null,
//     "dateAnalysisEightResultFireList": null
//   },
//   {
//     "lvl5Id": null,
//     "lvl5Name": null,
//     "cd": null,
//     "hzCount": 9,
//     dictName: '建筑内墙',
//     "parentDictId": null,
//     "boDictId": null,
//     "dateAnalysisEightResultList": null,
//     "dateAnalysisEightResultListYe": null,
//     "dateAnalysisEightResultListDc": null,
//     "dateAnalysisEightResultFireList": null
//   },
//   {
//     "lvl5Id": null,
//     "lvl5Name": null,
//     "cd": null,
//     "hzCount": 7,
//     dictName: '木质家具及制品',
//     "parentDictId": null,
//     "boDictId": null,
//     "dateAnalysisEightResultList": null,
//     "dateAnalysisEightResultListYe": null,
//     "dateAnalysisEightResultListDc": null,
//     "dateAnalysisEightResultFireList": null
//   },
//   {
//     "lvl5Id": null,
//     "lvl5Name": null,
//     "cd": null,
//     "hzCount": 7,
//     dictName: '软体家具及制品',
//     "parentDictId": null,
//     "boDictId": null,
//     "dateAnalysisEightResultList": null,
//     "dateAnalysisEightResultListYe": null,
//     "dateAnalysisEightResultListDc": null,
//     "dateAnalysisEightResultFireList": null
//   },
//   {
//     "lvl5Id": null,
//     "lvl5Name": null,
//     "cd": null,
//     "hzCount": 3,
//     dictName: '开关、保护设备',
//     "parentDictId": null,
//     "boDictId": null,
//     "dateAnalysisEightResultList": null,
//     "dateAnalysisEightResultListYe": null,
//     "dateAnalysisEightResultListDc": null,
//     "dateAnalysisEightResultFireList": null
//   },
//   {
//     "lvl5Id": null,
//     "lvl5Name": null,
//     "cd": null,
//     "hzCount": 3,
//     dictName: '电线电缆',
//     "parentDictId": null,
//     "boDictId": null,
//     "dateAnalysisEightResultList": null,
//     "dateAnalysisEightResultListYe": null,
//     "dateAnalysisEightResultListDc": null,
//     "dateAnalysisEightResultFireList": null
//   },
//   {
//     "lvl5Id": null,
//     "lvl5Name": null,
//     "cd": null,
//     "hzCount": 2,
//     dictName: '建构筑物构件、材料',
//     "parentDictId": null,
//     "boDictId": null,
//     "dateAnalysisEightResultList": null,
//     "dateAnalysisEightResultListYe": null,
//     "dateAnalysisEightResultListDc": null,
//     "dateAnalysisEightResultFireList": null
//   },
//   {
//     "lvl5Id": null,
//     "lvl5Name": null,
//     "cd": null,
//     "hzCount": 2,
//     dictName: '屋顶',
//     "parentDictId": null,
//     "boDictId": null,
//     "dateAnalysisEightResultList": null,
//     "dateAnalysisEightResultListYe": null,
//     "dateAnalysisEightResultListDc": null,
//     "dateAnalysisEightResultFireList": null
//   },
//   {
//     "lvl5Id": null,
//     "lvl5Name": null,
//     "cd": null,
//     "hzCount": 2,
//     dictName: '其他起火物类型',
//     "parentDictId": null,
//     "boDictId": null,
//     "dateAnalysisEightResultList": null,
//     "dateAnalysisEightResultListYe": null,
//     "dateAnalysisEightResultListDc": null,
//     "dateAnalysisEightResultFireList": null
//   }
// ]

const colorList = ['#DFEEFF', '#FFC44B', '#3773FF', '#FB6716', '#16B9F3', '#62ECFE', '#CF2226', '#FF8F00', '#0A85FC']
const options = {
  tooltip: {
    show: true,
    backgroundColor: 'rgba(0,0,0,0.7)',
    shadowColor: 'rgba(31,110,173,0.8)',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 10,
    borderWidth: 0,
    textStyle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      lineHeight: 20,
    },
    formatter: '<span style="font-size: 14px;font-weight: 400;">{b}：</span>{c}',
  },
  series: [{
    type: 'wordCloud',
    gridSize: 20,
    sizeRange: [14, 28],
    rotationRange: [0, 0],
    textStyle: {
      fontFamily: 'SourceHanSansCN-Bold',
      fontWeight: 'bold',
      color() {
        const index = Math.floor(Math.random() * colorList.length)
        return colorList[index]
      },
    },
    shape: function shapeSquare(theta) {
      return Math.min(
        1 / Math.abs(Math.cos(theta)),
        1 / Math.abs(Math.sin(theta)),
      )
    },
    emphasis: {
      focus: 'self',
    },
    drawOutOfBound: true,
    layoutAnimation: true,
    width: '100%',
    height: '100%',
  }],
}

export default {
  name: 'InitialFuels',
  getOptions(val) {
    if (!isType(val, 'Array')) {
      return []
    }
    Array.from(Array(1).keys()).forEach((index) => {
      options.series[index].data = val?.map((val) => {
        return {
          name: val.dictName,
          value: val.hzCount,
        }
      })
    })
    return options
  },
}
