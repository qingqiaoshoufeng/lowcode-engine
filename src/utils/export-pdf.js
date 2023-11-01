import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

// 导出pdf
export const exportPdf = (className, fileName) => {
  return new Promise((resolve) => {
    html2Canvas(document.querySelector(className), {
      allowTaint: false,
      useCORS: true, // allowTaint、useCORS只能够出现一个
      imageTimeout: 0,
      dpi: 300, // 像素
      scale: 2, // 图片大小
    }).then((canvas) => {
      // 用于将canvas对象转换为base64位编码
      const pageData = canvas.toDataURL('image/jpeg', 1.0)
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      const concentWidth = 500
      const concentHeight = Math.round(
        (concentWidth / canvasWidth) * canvasHeight,
      )
      let position = 72
      const pageHeight = 892
      let height = concentHeight
      // 新建一个new JsPDF，A3的像素大小 842*1191，A4的像素大小 592*841。这个px像素不准确，不清楚他们的像素大小来源如何
      const PDF = new JsPDF('p', 'px', 'a3')
      if (height <= pageHeight) {
        // 添加图片
        PDF.addImage(pageData, 'JPEG', 68, position, concentWidth, concentHeight)
      }
      else {
        while (height > 0) {
          PDF.addImage(pageData, 'JPEG', 68, position, concentWidth, concentHeight)
          height -= pageHeight
          position -= pageHeight
          if (height > 0) {
            PDF.addPage()
          }
        }
      }
      // 保存 pdf 文档
      PDF.save(fileName)
      resolve(true)
    })
  })
}
