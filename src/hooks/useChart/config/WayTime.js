import {isType} from '@/utils/types.js'

const mockData = [
  [320, 332, 301, 334, 390],
]


const options = {
  tooltip: {},
  grid:{
    left:45,
    top:35,
  },
  yAxis: {
    name:'分钟',
    nameTextStyle:{
      align:'right',
      verticalAlign:'top'
    },
    data: ['<3', '3-10', '10-20', '>=20'].reverse(),
    axisLine:{
      show:false,
    },
    axisLabel:{
      align: "right",
      // rotate: 30,
      // margin: 28,
      fontSize:11,
    },
    axisTick:{
      show:false
    },
    splitLine:{
      lineStyle:{
        type:'dashed'
      }
    },
    rotate:30
  },
  xAxis: [
    {
      nameLocation:'end',
      nameTextStyle:{
        align:'right',
      },
      splitLine:{
        lineStyle:{
          type:'dashed'
        }
      }
    }
  ],
  series: [
    {
      name: '途中时长',
      type: 'bar',
      data: [],
      barWidth:14,
      color:'#5088EC',
    },
  ]
}

export default {
  name:'WayTime',
  getOptions(val = mockData){
    if(!isType(val,'Array')) return options
    Array.from(Array(1).keys()).map(index=>{
      options.series[index].data = val[index]
    })
    return options
  }
}