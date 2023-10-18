import Time from '@/utils/time.js'


const getMinDate = ()=>{
  // 获取近二十年
  const year = Time.of().getYear() - 20
  const MinDate =  new Date(year, 0)
  return MinDate
}

const getMaxDate = ()=>{
  const year = Time.of().getYear()
  const maxDate =  new Date(year, 11)
  return maxDate
}

export const genarateDefaultColumns = (val = -20,formatter)=>{
  const currentYear = Time.of().getYear()
  const otherYear = currentYear + val
  const max = Math.max(currentYear,otherYear)
  const min = Math.min(currentYear,otherYear)
  const yearColums = []
  for(let i = max;min <= i <= max; i--){
    yearColums.push(formatter('year',i))
  }
  return [
    {
      values:[yearColums],
    },
    {
      values:['全部',...Array.from(Array(12).keys()).filter(item =>!item).map(item =>(formatter(item)))]
    }
  ]
}


