import {isType} from '@/utils/types.js'

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
    preventDefaultMouseMove:false,
  },
  xAxis: {
    data: [],
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
      name: '到场时长(分钟)',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20],
      barWidth:10,
      color:'#5CC97C',
      markLine: {
        data: [{
          yAxis: 0,
          symbol: 'none',
          name: '平均值',
        }]
      }
    },
  ],
}

export default {
  name:'DispatchInfo',
  getOptions(val ){
    if(!isType(val,'Array')) return options
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
    let average = 0;
    if (data[0]) {
      average = data[0].reduce((a, b) => a + b, 0) / data[0].length
    }
    options.series[0].markLine = {
      data: [{
        yAxis: average,
        symbol: 'none',
        name: '平均值',
      }]
    }
    options.dataZoom.end = Math.floor(100*(8/data[1].length))
    return options
  }
}