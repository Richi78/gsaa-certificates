import { jsPDF } from "jspdf"
import JSZip from "jszip"
import useCanvasStore, { DEFAULT } from "../stores/canvas.store"

const DEFAULT_EXPORT_DPI = 300
const BASE_PREVIEW_DPI = 96

const mmToPxAtDpi = (mm, dpi = DEFAULT_EXPORT_DPI) => {
  const numericMm = Number(mm)
  const numericDpi = Number(dpi)

  if (!Number.isFinite(numericMm) || !Number.isFinite(numericDpi) || numericDpi <= 0) {
    return 0
  }

  return Math.round((numericMm * numericDpi) / 25.4)
}

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

const createCanvasImageData = ({ width, height, textList, dpi = DEFAULT_EXPORT_DPI }) => {
  const numericWidth = Number(width)
  const numericHeight = Number(height)
  const pxWidth = mmToPxAtDpi(numericWidth, dpi)
  const pxHeight = mmToPxAtDpi(numericHeight, dpi)
  const canvas = document.createElement("canvas")
  canvas.width = pxWidth
  canvas.height = pxHeight
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, pxWidth, pxHeight)

  ctx.fillStyle = "black"

  textList.forEach(t => {
    const textSize = Number.isFinite(Number(t.textSize))
      ? Number(t.textSize)
      : 14

    const scaledFontSize = Math.max(1, Math.round((textSize * dpi) / BASE_PREVIEW_DPI))
    ctx.font = `${scaledFontSize}px Arial`
    ctx.fillText(
      t.text,
      mmToPxAtDpi(t.posX, dpi),
      mmToPxAtDpi(t.posY, dpi)
    )
  })

  return canvas.toDataURL("image/png")
}

const createPDF = ({ width, height, textList, dpi = DEFAULT_EXPORT_DPI }) => {
  const numericWidth = Number(width)
  const numericHeight = Number(height)
  const imgData = createCanvasImageData({ width: numericWidth, height: numericHeight, textList, dpi })

  const pdf = new jsPDF({
    orientation: numericWidth > numericHeight ? "landscape" : "portrait",
    unit: "mm",
    format: [numericWidth, numericHeight]
  })

  pdf.addImage(imgData, "PNG", 0, 0, numericWidth, numericHeight)

  return pdf
}

const downloadPDF = ({ name, width, height, textList, dpi = DEFAULT_EXPORT_DPI }) => {
  const pdf = createPDF({ width, height, textList, dpi })

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
      textList: item.textList,
      dpi: item.dpi ?? DEFAULT_EXPORT_DPI
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

const printCanvas = ({ width, height, textList, dpi = DEFAULT_EXPORT_DPI }) => {
  const numericWidth = Number(width)
  const numericHeight = Number(height)
  const dataUrl = createCanvasImageData({ width: numericWidth, height: numericHeight, textList, dpi })

  const printWindow = window.open("", "_blank")

  printWindow.document.write(`
    <html>
      <head>
        <style>
          @page {
            size: ${numericWidth}mm ${numericHeight}mm;
            margin: 0;
          }

          body {
            margin: 0;
          }

          img {
            width: ${numericWidth}mm;
            height: ${numericHeight}mm;
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