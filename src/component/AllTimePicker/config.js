import Time from '@/utils/time.js'
export const genarateDefaultColumns = (formatter,val =(-20))=>{
  const currentYear = Time.of().getYear()
  const otherYear = currentYear + val
  const max = Math.max(currentYear,otherYear)
  const min = Math.min(currentYear,otherYear)
  const yearColums = []
  for(let i = max;min <= i && i <= max; i--){
    yearColums.push(formatter('year',i))
  }
  return [
    {
      values:[...yearColums],
    },
    {
      values:['全年',...Array.from(Array(13).keys()).filter(item =>item).map(item =>(formatter('month',item)))]
    }
  ]
}


