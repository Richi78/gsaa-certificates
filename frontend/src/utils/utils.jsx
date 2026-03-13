import { jsPDF } from "jspdf"
import { mmToPx } from "../stores/canvas.store"

const downloadPDF = ({ name, width, height, textList }) => {
  const pxWidth = mmToPx(width)
  const pxHeight = mmToPx(height)
  const canvas = document.createElement("canvas")
  canvas.width = pxWidth
  canvas.height = pxHeight
  const ctx = canvas.getContext("2d")
  // fondo
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, pxWidth, pxHeight)

  // dibujar textos
  ctx.fillStyle = "black"
  ctx.font = "16px Arial"

  textList.forEach(t => {
    ctx.fillText(
      t.text,
      mmToPx(t.posX),
      mmToPx(t.posY)
    )
  })

  const imgData = canvas.toDataURL("image/png")


  const pdf = new jsPDF({
    orientation: width > height ? "landscape" : "portrait",
    unit: "mm",
    format: [width, height]
  })

  pdf.addImage(imgData, "PNG", 0, 0, width, height)

  pdf.save(`${name}.pdf`)
}

const printCanvas = ({ width, height, textList }) => {
  const pxWidth = mmToPx(width)
  const pxHeight = mmToPx(height)
  const canvas = document.createElement("canvas")
  canvas.width = pxWidth
  canvas.height = pxHeight
  const ctx = canvas.getContext("2d")
  // fondo
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, pxWidth, pxHeight)

  // dibujar textos
  ctx.fillStyle = "black"
  ctx.font = "16px Arial"

  textList.forEach(t => {
    ctx.fillText(
      t.text,
      mmToPx(t.posX),
      mmToPx(t.posY)
    )
  })

  const dataUrl = canvas.toDataURL("image/png")

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

export { downloadPDF, printCanvas }