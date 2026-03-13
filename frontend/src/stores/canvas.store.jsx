import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT = {
  id: 1,
  width: "208",
  height: "144",
  textList: [
    {
      id: 1,
      text: 'PONER NOMBRE',
      posX: 74,
      posY: 81,
    },
  ]
}

export const mmToPx = (mm) => {
  return parseInt(mm * 96 / 26)
}

const useCanvasStore = create(
  persist(
    (set, get) => ({
      canvasList: [DEFAULT],

      addCanvas: () =>
        set(state => ({
          canvasList: [
            ...state.canvasList,
            { ...DEFAULT, id: Date.now() }
          ]
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

    }),
    {
      name: 'canvas-store'
    }
  )
)



export default useCanvasStore