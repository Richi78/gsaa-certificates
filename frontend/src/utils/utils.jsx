import { jsPDF } from "jspdf"
import JSZip from "jszip"
import { mmToPx } from "../stores/canvas.store"

const createCanvasImageData = ({ width, height, textList }) => {
  const pxWidth = mmToPx(width)
  const pxHeight = mmToPx(height)
  const canvas = document.createElement("canvas")
  canvas.width = pxWidth
  canvas.height = pxHeight
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, pxWidth, pxHeight)

  ctx.fillStyle = "black"
  ctx.font = "16px Arial"

  textList.forEach(t => {
    ctx.fillText(
      t.text,
      mmToPx(t.posX),
      mmToPx(t.posY)
    )
  })

  return canvas.toDataURL("image/png")
}

const createPDF = ({ width, height, textList }) => {
  const imgData = createCanvasImageData({ width, height, textList })

  const pdf = new jsPDF({
    orientation: width > height ? "landscape" : "portrait",
    unit: "mm",
    format: [width, height]
  })

  pdf.addImage(imgData, "PNG", 0, 0, width, height)

  return pdf
}

const downloadPDF = ({ name, width, height, textList }) => {
  const pdf = createPDF({ width, height, textList })

  pdf.save(`${name}.pdf`)
}

const downloadPDFsZip = async (items, zipName = "certificados") => {
  if (!Array.isArray(items) || items.length === 0) return

  const zip = new JSZip()

  items.forEach((item, index) => {
    const itemHeight = item.height ?? item.hetight
    if (!item.width || !itemHeight || !Array.isArray(item.textList)) return

    const fileName = `${item.name || `documento-${index + 1}`}.pdf`
    const pdf = createPDF({
      width: item.width,
      height: itemHeight,
      textList: item.textList
    })

    zip.file(fileName, pdf.output("arraybuffer"))
  })

  const zipBlob = await zip.generateAsync({ type: "blob" })
  const zipUrl = URL.createObjectURL(zipBlob)
  const anchor = document.createElement("a")
  anchor.href = zipUrl
  anchor.download = `${zipName}.zip`
  anchor.click()
  URL.revokeObjectURL(zipUrl)
}

const printCanvas = ({ width, height, textList }) => {
  const dataUrl = createCanvasImageData({ width, height, textList })

  const printWindow = window.open("", "_blank")

  printWindow.document.write(`
    <html>
      <head>
        <style>
          @page {
            size: ${width}mm ${height}mm;
            margin: 0;
          }

          body {
            margin: 0;
          }

          img {
            width: ${width}mm;
            height: ${height}mm;
            display:block;
          }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
      </body>
    </html>
  `)

  printWindow.document.close()

  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }
}

export { downloadPDF, downloadPDFsZip, printCanvas }