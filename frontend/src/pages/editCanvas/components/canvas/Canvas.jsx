import { useEffect } from "react"
import { mmToPx } from "../../../../stores/canvas.store"

const Canvas = ({ reference, width, height, textList, textSize = 14 }) => {
  const pxWidth = mmToPx(width)
  const pxHeith = mmToPx(height)
  const drawText = (context, textList, textSize) => {
    context.fillStyle = 'black'

    textList.forEach(e => {
      context.font = `${e.textSize ?? textSize}px Arial`
      context.fillText(e.text, mmToPx(e.posX), mmToPx(e.posY))
    })
  }
  useEffect(() => {
    const canvas = reference.current
    if (!canvas) return
    const context = canvas.getContext('2d')

    context.clearRect(0, 0, pxWidth, pxHeith)


    context.fillStyle = 'white'
    context.fillRect(0, 0, pxWidth, pxHeith)
    drawText(context, textList, textSize)
  }, [width, height, textList, textSize])
  return (
    <canvas
      ref={reference}
      width={pxWidth}
      height={pxHeith}
    ></canvas>
  )
}

export default Canvas