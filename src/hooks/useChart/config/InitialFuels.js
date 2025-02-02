import { isType } from '@/utils/types.js'


const colorList = ['#FFC44B', '#3773FF', '#FB6716', '#16B9F3', '#CF2226', '#FF8F00', '#0A85FC']
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
      return options
    }
    Array.from(Array(1).keys()).forEach((index) => {
      options.series[index].data = val?.map((val) => {
        return {
          name: val.dictName,
          value: val.hzCount,
        }
      })
    })
    options.tooltip.formatter = (v) => {
      const index = v.dataIndex
      return `<span style="font-size: 14px;font-weight: 400;">起数：</span>${val[index].hzCount}
              <span style="font-size: 14px;font-weight: 400;">占比：</span>${val[index].hzCountPro}%
              `
    }
    return options
  },
}
