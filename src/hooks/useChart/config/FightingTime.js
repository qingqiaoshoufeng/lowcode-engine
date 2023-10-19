const mockData = [
  [
    {value:320,name:'<10分钟'}, 
    {value:320,name:'10-20分钟'}, 
    {value:320,name:'30-60分钟'}, 
    {value:320,name:'60-90分钟'},
    {value:320,name:'90-120分钟'}, 
    {value:320,name:'>=120分钟'}
  ],
]
const legendData = ['<10分钟', '10-20分钟', '30-60分钟', '60-90分钟', '90-120分钟','>=120分钟']


const options = {
  tooltip: {},
  grid:{
    left:0,
    top:10,
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 20,
    bottom: 20,
    data: legendData
  },
  series: [
    {
      name: '姓名',
      type: 'pie',
      center:['23%','40%'],
      radius: ['34%', '50%'],
      labelLine:{
        show:false,
      },
      data: mockData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ],
  color:['#176AFF', '#20C6FF', '#3BD38A', '#F2D24E', '#FFA961', '#C162FF']
}

export default {
  name:'FightingTime',
  getOptions(val = mockData){
    Array.from(Array(1).keys()).map(index=>{
      options.series[index].data = val[index]
    })
    return options
  }
}