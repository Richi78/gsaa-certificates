import { jsPDF } from "jspdf"
import JSZip from "jszip"
import useCanvasStore, { DEFAULT, mmToPx } from "../stores/canvas.store"

const readFileAsText = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      resolve(event.target?.result ?? "")
    }

    reader.onerror = () => reject(new Error("No se pudo leer el archivo CSV"))
    reader.readAsText(file)
  })

const parseCSVLine = (line, delimiter) => {
  const values = []
  let current = ""
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === delimiter && !inQuotes) {
      values.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

const parseCSVContent = (csvContent, preferredDelimiter = ",") => {
  const normalized = csvContent.replace(/^\uFEFF/, "")
  const lines = normalized
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

  if (!lines.length) return []

  return lines
    .flatMap(line => parseCSVLine(line, preferredDelimiter))
    .map(value => value.trim())
    .filter(Boolean)
}

const importCanvasStoreFromCSV = async (csvFile, options = {}) => {
  if (!csvFile) throw new Error("Debes enviar un archivo .csv")

  const csvContent = typeof csvFile === "string"
    ? csvFile
    : await readFileAsText(csvFile)

  const sentences = parseCSVContent(csvContent, options.delimiter ?? ",")
  if (!sentences.length) return { canvasCount: 0, textCount: 0 }

  const defaultTextList = Array.isArray(DEFAULT.textList) ? DEFAULT.textList : []
  const firstDefaultText = defaultTextList[0] ?? { id: 1, text: "", posX: 0, posY: 0 }
  const currentCanvasList = useCanvasStore.getState().canvasList ?? []
  const idSeed = Date.now() + currentCanvasList.length

  const canvasList = sentences.map((sentence, index) => {
    const textList = defaultTextList.length
      ? defaultTextList.map(text => ({ ...text }))
      : [{ ...firstDefaultText }]

    textList[0] = {
      ...firstDefaultText,
      text: sentence
    }

    return {
      id: idSeed + index,
      width: DEFAULT.width,
      height: DEFAULT.height,
      textList
    }
  })

  if (!canvasList.length) return { canvasCount: 0, textCount: 0 }

  useCanvasStore.setState({ canvasList: [...currentCanvasList, ...canvasList] })

  return {
    canvasCount: canvasList.length,
    textCount: canvasList.reduce((acc, canvas) => acc + canvas.textList.length, 0)
  }
}

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

export { downloadPDF, downloadPDFsZip, printCanvas, importCanvasStoreFromCSV }