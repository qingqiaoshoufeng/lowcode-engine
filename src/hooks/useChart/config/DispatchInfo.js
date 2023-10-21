import {isType} from '@/utils/types.js'

const mockData = [
  [320, 332, 301, 334, 390,10],
]


const options = {
  tooltip: {},
  grid:{
    top:35,
  },
  dataZoom:{
    type: 'inside',
    xAxisIndex: [0],
    start: 0,
    end: 15,
    zoomLock:true,
  },
  xAxis: {
    data: ['下级单位简称1', '下级单位简称2', '下级单位简称3', '下级单位简称4', '下级单位简称5', '下级单位简称6'],
    axisLine:{
      show:false,
    },
    axisLabel:{
      align: "center",
      rotate: 30,
      margin: 28,
      fontSize:10,
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
  yAxis: [
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
      name: '火灾起数',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20],
      barWidth:18,
      color:'#5CC97C',
    },
  ]
}

export default {
  name:'DispatchInfo',
  getOptions(val ){
    if(!isType(val,'Array')) return {}
    const data = val.reduce((current,item)=>{
      const {avgTime,orgName} = item
      current[0].push(Number(avgTime))
      current[1].push(orgName)
      return current
    },[
      [],
      [],
    ])
    Array.from(Array(1).keys()).map(index=>{
      options.series[index].data = data[index]
    })
    options.xAxis.data = data[1]
    options.dataZoom.end = Math.floor(100*(3/data[1].length))
    return options
  }
}