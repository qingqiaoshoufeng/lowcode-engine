const mockData = [
  [320, 332, 301, 334, 390,10],
]


const options = {
  tooltip: {},
  grid:{
    top:35,
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
  getOptions(val = mockData){
    Array.from(Array(1).keys()).map(index=>{
      options.series[index].data = val[index]
    })
    return options
  }
}