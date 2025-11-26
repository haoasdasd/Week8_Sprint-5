import { create } from 'zustand'

interface StoreExample {
    count: number
    increment: () => void
    decrement: () => void
}

export const useStoreExample = create<StoreExample>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 }))
}))
