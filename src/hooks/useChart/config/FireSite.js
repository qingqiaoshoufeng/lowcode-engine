import { isType } from '@/utils/types.js'

const mockData = [
  [320, 332, 301, 334, 390],
]

const options = {
  tooltip: {},
  grid: {
    left: 100,
    top: 10,
  },
  yAxis: {
    data: ['居住场所', '交通工具', '厂房', '工地', '办公场所'],
    axisLine: {
      show: false,
    },
    axisLabel: {
      align: 'right',
      // rotate: 30,
      // margin: 28,
      fontSize: 11,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
    rotate: 30,
  },
  xAxis: [
    {
      // name:'(起数)',
      nameLocation: 'end',
      nameTextStyle: {
        align: 'right',
      },
      // offset:'10',
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
  ],
  series: [
    {
      name: '火灾起数',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20],
      barWidth: 10,
      color: '#5088EC',
      // barGap: 0,
    },
    // {
    //   name: '亡人数',
    //   yAxisIndex:1,
    //   type: 'bar',
    //   data: [5, 20, 36, 10, 10, 20],
    //   barWidth:10,
    //   color:'#4C81D3',
    // }
  ],
}

export default {
  name: 'FireSite',
  getOptions(val = mockData) {
    if (!isType(val, 'Array')) {
      return {}
    }
    const data = val.reduce((current, item) => {
      const { hzCount, firePlace } = item
      current[0].push(hzCount)
      current[1].push(firePlace)
      return current
    }, [
      [],
      [],
    ])
    Array.from(Array(1).keys()).forEach((index) => {
      options.series[index].data = data[index]
    })
    options.yAxis.data = data[1]
    return options
  },
}
