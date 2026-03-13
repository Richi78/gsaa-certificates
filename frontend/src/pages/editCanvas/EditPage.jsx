import { useEffect, useRef, useState } from 'react'
import styles from './EditPage.module.css'
import Canvas from './components/canvas/Canvas'
import PlusIcon from '../../icons/PlusIcon'
import TrashIcon from '../../icons/TrashIcon'
import ListElement from './components/listElement/ListElement'
import useCanvasStore from '../../stores/canvas.store'


const EditPage = () => {
  const canvasRef = useRef(null)
  const canvasList = useCanvasStore(state => state.canvasList)
  const addCanvas = useCanvasStore(state => state.addCanvas)
  const removeCanvas = useCanvasStore(state => state.removeCanvas)
  const [active, setActive] = useState(0)
  const [expandedItems, setExpandedItems] = useState({})

  const selectedCanvas = canvasList[active] ?? canvasList[0]

  useEffect(() => {
    if (!canvasList.length) return
    if (active > canvasList.length - 1) {
      setActive(canvasList.length - 1)
    }
  }, [active, canvasList.length])

  useEffect(() => {
    setExpandedItems(prev => {
      const next = {}

      canvasList.forEach(item => {
        next[item.id] = prev[item.id] ?? true
      })

      return next
    })
  }, [canvasList])

  const handleActive = (index) => {
    setActive(index)
  }

  const handleToggleAccordion = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !(prev[id] ?? true)
    }))
  }

  const handleRemove = (id, index) => {
    removeCanvas(id)
    setActive(prev => {
      if (index < prev) return prev - 1
      return prev
    })
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
              (e, index) => {
                const isExpanded = expandedItems[e.id] ?? true

                return <div key={e.id} className={styles.itemCard}>
                  <div className={styles.itemHeader}>
                    <h4
                      className={
                        `${styles.textBtn} ${index === active ? styles.active : ''}`
                      }
                      onClick={() => handleActive(index)}
                    >
                      Certificado {index + 1}
                    </h4>
                    <div className={styles.itemActions}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleRemove(e.id, index)}
                        disabled={canvasList.length === 1}
                        aria-label='Eliminar certificado'
                        title='Eliminar'
                      >
                        <TrashIcon />
                      </button>
                      <button
                        className={styles.accordionBtn}
                        onClick={() => handleToggleAccordion(e.id)}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Plegar certificado' : 'Desplegar certificado'}
                        title={isExpanded ? 'Plegar' : 'Desplegar'}
                      >
                        <span className={styles.chevron} aria-hidden='true'>
                          {isExpanded ? '▾' : '▸'}
                        </span>
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <ListElement
                      element={e}
                    />
                  )}
                </div>
              }
            )
          }
        </div>
      </section>
      <section className={styles.right}>
        {
          selectedCanvas &&
          <Canvas
            reference={canvasRef}
            width={selectedCanvas.width}
            height={selectedCanvas.height}
            textList={selectedCanvas.textList}
          />
        }
      </section>
    </article>
  )
}

export default EditPage