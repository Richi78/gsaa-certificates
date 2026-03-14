import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const DEFAULT = {
  id: 1,
  width: "208",
  height: "144",
  textList: [
    {
      id: 1,
      text: 'NOMBRE1 NOMBRE2 APELLIDO1 APELLIDO2',
      posX: 74,
      posY: 81,
      textSize: 16,
    },
    {
      id: 2,
      text: 'Por haber participado del ACAMPANGLO 2026 "NOMBRE CAMPAMENTO"',
      posX: 41,
      posY: 86,
      textSize: 14,
    },
    {
      id: 3,
      text: 'en calidad de Comisión Organizadora. Realizado del XX al YY de MES de AÑO',
      posX: 39,
      posY: 91,
      textSize: 14,
    },
    {
      id: 4,
      text: 'en el Campo Escuela "Germán Rocha M." - Arani',
      posX: 63,
      posY: 96,
      textSize: 14,
    },
    {
      id: 5,
      text: 'Nombre Apellido1 Apellido2',
      posX: 81,
      posY: 124,
      textSize: 14,
    },
    {
      id: 6,
      text: 'Responsable de Grupo A.A.',
      posX: 82,
      posY: 129,
      textSize: 14,
    }
  ]
}

export const mmToPx = (mm) => {
  return parseInt(mm * 96 / 26)
}

const generateCanvasId = () => Date.now()

const cloneCanvas = (canvas, id = generateCanvasId()) => ({
  ...canvas,
  id,
  textList: canvas.textList.map(text => ({ ...text }))
})

const useCanvasStore = create(
  persist(
    (set, get) => ({
      canvasList: [DEFAULT],

      addCanvas: () =>
        set(state => ({
          canvasList: [
            ...state.canvasList,
            cloneCanvas(DEFAULT)
          ]
        })),

      duplicateCanvas: (id) =>
        set(state => {
          const selectedCanvas = state.canvasList.find(e => e.id === id)

          if (!selectedCanvas) {
            return state
          }

          return {
            canvasList: [
              ...state.canvasList,
              cloneCanvas(selectedCanvas)
            ]
          }
        }),

      removeCanvas: (id) =>
        set(state => ({
          canvasList: state.canvasList.length === 1
            ? state.canvasList
            : state.canvasList.filter(e => e.id !== id)
        })),

      updateWidth: (id, width) =>
        set(state => ({
          canvasList: state.canvasList.map(
            e => e.id === id
              ? { ...e, width }
              : e
          )
        })),

      updateHeight: (id, height) =>
        set(state => ({
          canvasList: state.canvasList.map(
            e => e.id === id
              ? { ...e, height }
              : e
          )
        })),

      addText: (elementId) =>
        set(state => ({
          canvasList: state.canvasList.map(
            e => {
              if (e.id !== elementId) {
                return e
              }

              const nextTextId = e.textList.length
                ? Math.max(...e.textList.map(t => t.id)) + 1
                : 1

              return {
                ...e,
                textList: [
                  ...e.textList,
                  {
                    id: nextTextId,
                    text: '',
                    posX: 0,
                    posY: 0,
                    textSize: 14,
                  },
                ]
              }
            }
          )
        })),

      removeText: (elementId, textId) =>
        set(state => ({
          canvasList: state.canvasList.map(
            e => {
              if (e.id !== elementId) {
                return e
              }

              if (e.textList.length === 1) {
                return e
              }

              return {
                ...e,
                textList: e.textList.filter(t => t.id !== textId)
              }
            }
          )
        })),

      updateText: (elementId, textId, value) =>
        set(state => ({
          canvasList: state.canvasList.map(
            e => e.id === elementId
              ? {
                ...e,
                textList: e.textList.map(
                  t => t.id === textId
                    ? { ...t, text: value }
                    : t
                )
              }
              : e
          )
        })),

      updatePosX: (elementId, textId, value) =>
        set(state => ({
          canvasList: state.canvasList.map(
            e => e.id === elementId
              ? {
                ...e,
                textList: e.textList.map(
                  t => t.id === textId
                    ? { ...t, posX: value }
                    : t
                )
              }
              : e
          )
        })),


      updatePosY: (elementId, textId, value) =>
        set(state => ({
          canvasList: state.canvasList.map(
            e => e.id === elementId
              ? {
                ...e,
                textList: e.textList.map(
                  t => t.id === textId
                    ? { ...t, posY: value }
                    : t
                )
              }
              : e
          )
        })),

      updateTextSize: (elementId, textId, value) =>
        set(state => ({
          canvasList: state.canvasList.map(
            e => e.id === elementId
              ? {
                ...e,
                textList: e.textList.map(
                  t => t.id === textId
                    ? { ...t, textSize: value }
                    : t
                )
              }
              : e
          )
        })),

    }),
    {
      name: 'canvas-store'
    }
  )
)



export default useCanvasStore