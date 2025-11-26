import { create } from 'zustand'

interface PreviousUrlStore {
    previousUrl: string
    setPreviousUrl: (previousUrl: string) => void
}

const usePreviousUrlStore = create<PreviousUrlStore>((set) => ({
    previousUrl: '',
    setPreviousUrl: (previousUrl: string) => set({ previousUrl })
}))

export default usePreviousUrlStore
