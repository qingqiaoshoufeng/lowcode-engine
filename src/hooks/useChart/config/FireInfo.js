import {isType} from '@/utils/types.js'

const mockData = [
  [320, 332, 301, 334, 390],
  [320, 332, 301, 334, 390],
]


const options = {
  dataZoom:{
    type: 'inside',
    xAxisIndex: [0],
    start: 0,
    end: 15,
    zoomLock:true,
  },
  tooltip: {},
  grid:{
    top:35,
  },
  legend: {
    data: ['火灾起数','亡人数'],
    itemWidth:11,
    itemHeight:11,
    icon:'rect',
    top:'2',
    // formatter: function (name) {
    // debugger;
    // return 'Legend ' + name;
    // }
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
      name:'(起数)',
      nameLocation:'end',
      nameTextStyle:{
        align:'right',
      },
      // offset:'10',
      splitLine:{
        lineStyle:{
          type:'dashed'
        }
      }
    },
    {
      name:'(人数)',
      nameLocation:'end',
      nameTextStyle:{
        align:'left',
      },
      // offset:'10',
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
      data: [],
      barWidth:10,
      color:'#FF8A42',
      barGap: 0,
    },
    {
      name: '亡人数',
      yAxisIndex:1,
      type: 'bar',
      data: [],
      barWidth:10,
      color:'#4C81D3',
    }
  ]
}

export default {
  name:'FireInfo',
  getOptions(val){
    if(!isType(val,'Array')) return options
    const data = val.reduce((current,item)=>{
      const {hzCount,deCount,county} = item
      current[0].push(hzCount)
      current[1].push(deCount)
      current[2].push(county)
      return current
    },[
      [],
      [],
      [],
    ])
    Array.from(Array(2).keys()).map(index=>{
      options.series[index].data = data[index]
    })
    options.xAxis.data = data[2]
    options.dataZoom.end = Math.floor(100*(6/data[2].length))
    options.grid.left = `${Math.max(...data[0].map(item=>`${item}`.length))}` * 10 + 30
    return options
  }
}