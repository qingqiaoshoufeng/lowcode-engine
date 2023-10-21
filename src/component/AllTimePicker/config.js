import Time from '@/utils/time.js'
export const genarateDefaultColumns = (formatter,val =(-20))=>{
  const currentYear = Time.of().getYear()
  const otherYear = currentYear + val
  const max = Math.max(currentYear,otherYear)
  const min = Math.min(currentYear,otherYear)
  const yearColums = []
  for(let i = max;min <= i && i <= max; i--){
    yearColums.push(i)
  }
  return [
    [...yearColums].map((item)=>{
      return {
        text:formatter('year',item),
        value:item
      }
    }),
    ['全年',...Array.from(Array(13).keys()).filter(item =>item).map(item =>(item))].map((item)=>{
      return {
        text:formatter('month',item),
        value:item
      }
    })
  ]
}


