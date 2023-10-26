import { isType } from '@/utils/types.js'

const mockData = [
  [{ value: 320, name: '主战' }, { value: 320, name: '市内增援' }, { value: 320, name: '跨市增援' }, { value: 320, name: '跨省增援' }],
]
const legendData = ['主战', '市内增援', '跨市增援', '跨省增援']

const options = {
  tooltip: {},
  grid: {
    left: 0,
    top: 10,
  },
  legend: {
    show: false,
    orient: 'vertical',
    right: 10,
    top: 20,
    bottom: 20,
    data: legendData,
  },
  series: [
    {
      name: '姓名',
      type: 'pie',
      // center:['40%','40%'],
      radius: ['0', '50%'],
      label: {
        // height:25,
        // lineHeight: 100,
        rich: {
          a: {
            fontSize: 14,
            color: '#000',
            fontWeight: 500,
            lineHeight: 50,
            align: 'right',
          },
        },
        width: 200,
        padding: [-40, 0, -15, 0],
        distanceToLabelLine: -80,
        // formatter:'{b}: {c}:{"人"}'
        formatter(val) {
          // debugger;
          const { name, value } = val.data
          return `${name}:${value}`
        },
      },

      labelLine: {
        length: 20,
        length2: 90,
        show: true,
        lineStyle: {
          color: '#4DBBFF ',
        },
      },
      data: mockData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
  color: ['#176AFF', '#20C6FF', '#3BD38A', '#F2D24E', '#FFA961', '#C162FF'],
}

export default {
  name: 'FireArea',
  getOptions(val) {
    if (!isType(val, 'Array')) {
      return {}
    }
    Array.from(Array(1).keys()).forEach((index) => {
      options.series[index].data = val.map((item) => {
        return {
          value: item.total, name: item.dictName,
        }
      })
    })
    return options
  },
}
