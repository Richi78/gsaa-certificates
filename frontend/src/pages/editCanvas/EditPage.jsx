import { useEffect, useRef, useState } from 'react'
import styles from './EditPage.module.css'
import Canvas from './components/canvas/Canvas'
import PlusIcon from '../../icons/PlusIcon'
import ListElement from './components/listElement/ListElement'
import useCanvasStore from '../../stores/canvas.store'


const EditPage = () => {
  const canvasRef = useRef(null)
  const canvasList = useCanvasStore(state => state.canvasList)
  const addCanvas = useCanvasStore(state => state.addCanvas)
  const [active, setActive] = useState(0)

  const handleActive = (index) => {
    setActive(index)
  }
  return (
    <article className={styles.container}>
      <section className={styles.left}>
        <div className={styles.title}>
          <h3>Certificados (<strong>{canvasList.length}</strong>)</h3>
          <button onClick={addCanvas}>
            <PlusIcon />
          </button>
        </div>
        <div className={styles.listContainer}>
          {
            canvasList.map(
              (e, index) =>
                <div key={e.id} >
                  <h4
                    className={
                      `${styles.textBtn} ${index === active ? styles.active : ''}`
                    }
                    onClick={() => handleActive(index)}
                  >
                    Certificado {index + 1}
                  </h4>
                  <ListElement
                    element={e}
                    canvasRef={canvasRef}
                  />
                </div>
            )
          }
        </div>
      </section>
      <section className={styles.right}>
        <Canvas
          reference={canvasRef}
          width={canvasList[active].width}
          height={canvasList[active].height}
          textList={canvasList[active].textList}
        />
      </section>
    </article>
  )
}

export default EditPage