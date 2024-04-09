import {isType} from '@/utils/types.js'
const mockData = [
  [
    {value:0,name:'<10分钟'}, 
    {value:0,name:'10-20分钟'}, 
    {value:0,name:'30-60分钟'}, 
    {value:0,name:'60-90分钟'},
    {value:0,name:'90-120分钟'}, 
    {value:0,name:'>=120分钟'}
  ],
]
const legendData = ['<10分钟', '10-20分钟', '30-60分钟', '60-90分钟', '90-120分钟','>=120分钟']

let realDataMap = {}
const options = {
  tooltip: {
    formatter: '<span style="font-size: 14px;font-weight: 400;">{b}：</span>{c}队次',
  },
  grid:{
    left:0,
    top:10,
  },
  legend: {
    orient: 'vertical',
    right: 20,
    top: 50,
    bottom: 20,
    data: legendData,
    icon:'circle',
    itemWidth:10,
    itemHeight:10,
    formatter: (val) => {
      const item = realDataMap.find(item => item.name === val) 
      return `${val}  ${item.value}(队次)`
    },
  },
  series: [
    {
      name: '姓名',
      type: 'pie',
      center:['33%','50%'],
      radius: ['44%', '60%'],
      labelLine:{
        show:false,
      },
      label:{
        show:false
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
    if(!isType(val,'Array')) return options
    Array.from(Array(1).keys()).map(index=>{
      options.series[index].data = realDataMap = val[index].map((itm,idx)=>{
        return {
          name:legendData[idx],
          value:itm
        }
      })
    })
    return options
  }
}