
import {reactive,toRefs} from 'vue'


const getOptionsMap= () => {
  let files = []
  let optionsMap = {}
  files = require.context('./config', true, /\.js$/)
  files.keys().forEach((key) => {
    const { name, getOptions } = files(key).default
    optionsMap[name] = getOptions
  })
  return optionsMap
}
const optionsMap = getOptionsMap()

export default function useChart({dom,type}){
  const state = reactive({
    chart:null
  })
  const init = ()=>{
    state.chart = echarts.init(dom)
  }
  const render = (data)=>{
    myChart.setOption(optionsMap[type](data));
  }
  return {
    ...toRefs(state),
    init,
    render
  }
}