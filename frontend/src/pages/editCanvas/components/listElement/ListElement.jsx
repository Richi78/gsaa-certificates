import useCanvasStore from '../../../../stores/canvas.store'
import styles from './ListElement.module.css'
import { downloadPDF, printCanvas } from '../../../../utils/utils'

const ListElement = ({ element }) => {

  const updateWidth = useCanvasStore(state => state.updateWidth)
  const updateHeight = useCanvasStore(state => state.updateHeight)
  const updateText = useCanvasStore(state => state.updateText)
  const updatePosX = useCanvasStore(state => state.updatePosX)
  const updatePosY = useCanvasStore(state => state.updatePosY)

  const handleWidth = (e) => {
    const value = e.target.value
    if (isNaN(Number(value))) return
    updateWidth(element.id, value)
  }
  const handleHeight = (e) => {
    const value = e.target.value
    if (isNaN(Number(value))) return
    updateHeight(element.id, value)
  }
  const handleText = (event, elementId, textId) => {
    updateText(elementId, textId, event.target.value)
  }
  const handlePosX = (event, elementId, textId) => {
    const value = event.target.value
    if (isNaN(value)) return
    updatePosX(elementId, textId, value)
  }
  const handlePosY = (event, elementId, textId) => {
    const value = event.target.value
    if (isNaN(value)) return
    updatePosY(elementId, textId, value)
  }
  const handlePDF = () => {
    downloadPDF(
      { ...element, name: element.textList[0].text }
    )
  }
  const handlePrint = () => {
    printCanvas(element)
  }
  return (
    <article className={styles.container}>
      <section className={styles.dimension}>
        <label >
          <p>Ancho (mm)</p>
          <input
            type="text"
            value={element.width}
            onChange={handleWidth}
            placeholder='Ancho'
          />
        </label>
        <label >
          <p>Alto (mm)</p>
          <input
            type="text"
            value={element.height}
            onChange={handleHeight}
            placeholder='Alto'
          />
        </label>
      </section>
      <section>
        {
          element.textList.map(
            e =>
              <div key={e.id}>
                <label>
                  <p>Texto</p>
                  <input
                    type="text"
                    value={e.text}
                    placeholder='Escribe un texto'
                    onChange={(event) => handleText(event, element.id, e.id)}
                  />
                </label>
                <div className={styles.axis}>
                  <label>
                    <p>Mover X (mm)</p>
                    <input
                      type="text"
                      value={e.posX}
                      placeholder='En eje X'
                      onChange={(event) => handlePosX(event, element.id, e.id)}
                    />
                  </label>
                  <label>
                    <p>Mover Y (mm)</p>
                    <input
                      type="text"
                      value={e.posY}
                      placeholder='En eje Y'
                      onChange={(event) => handlePosY(event, element.id, e.id)}
                    />
                  </label>
                </div>
              </div>
          )
        }
      </section>
      <section className={styles.btnSection}>
        <button
          className={styles.btn}
          onClick={handlePDF}
        >
          Descargar PDF
        </button>
        <button
          className={styles.btn}
          onClick={handlePrint}
        >
          Imprimir
        </button>
      </section>
    </article>
  )
}

export default ListElement