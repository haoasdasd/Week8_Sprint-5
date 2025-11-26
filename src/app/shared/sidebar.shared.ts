import { create } from 'zustand'
import { STORAGE_KEY } from '~/app/configs/storage-key.config'

interface StoreSidebar {
    stateLevel0: number
    stateLevel1: number
    stateLevel2: number
    setStateLevel0: (id: number) => void
    setStateLevel1: (id: number) => void
    setStateLevel2: (id: number) => void
    size: number
    isMobile: boolean
    setSize: (size: number) => void
    setIsMobile: (open: boolean) => void
    mode: 'vertical' | 'horizontal'
    setMode: (mode: 'vertical' | 'horizontal') => void
}

export const useStoreSidebar = create<StoreSidebar>((set) => ({
    mode: 'vertical',
    stateLevel0: 0,
    stateLevel1: 0,
    stateLevel2: 0,
    setStateLevel0: (id: number) => {
        set({ stateLevel0: id, stateLevel1: 0, stateLevel2: 0 })
        sessionStorage.setItem(STORAGE_KEY.SESSION_STATE_LEVEL_0, id.toString())
    },
    setStateLevel1: (id: number) => {
        set({ stateLevel1: id, stateLevel2: 0 })
        sessionStorage.setItem(STORAGE_KEY.SESSION_STATE_LEVEL_1, id.toString())
    },
    setStateLevel2: (id: number) => {
        set({ stateLevel2: id })
        sessionStorage.setItem(STORAGE_KEY.SESSION_STATE_LEVEL_2, id.toString())
    },
    size: 0,
    isMobile: false,
    setSize: (size: number) => set({ size }),
    setIsMobile: (isMobile: boolean) => set({ isMobile }),
    setMode: (mode: 'vertical' | 'horizontal') => set({ mode })
}))
