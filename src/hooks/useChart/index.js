
import {reactive,toRefs,markRaw} from 'vue'
import * as echarts from 'echarts';
import 'echarts-wordcloud'
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
    state.chart = markRaw(echarts.init(dom.value))
  }
  const render = (data)=>{
    if(!state.chart){
      init()
    }
    state.chart.setOption(optionsMap[type](data));
  }
  return {
    ...toRefs(state),
    init,
    render
  }
}