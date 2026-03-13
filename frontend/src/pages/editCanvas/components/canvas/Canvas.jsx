import { useEffect } from "react"
import { mmToPx } from "../../../../stores/canvas.store"

const Canvas = ({ reference, width, height, textList }) => {
  const pxWidth = mmToPx(width)
  const pxHeith = mmToPx(height)
  const drawText = (context, textList) => {
    context.fillStyle = 'black'
    context.font = '16px Arial'

    textList.forEach(e => {
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
    drawText(context, textList)
  }, [width, height, textList])
  return (
    <canvas
      ref={reference}
      width={pxWidth}
      height={pxHeith}
    ></canvas>
  )
}

export default Canvas