import { create } from 'zustand'

interface StorePopup {
    title: string | null
    isOpen: boolean
    isLoading: boolean
    error: string | null
    setError: (error: string) => void
    message: string | null
    setIsLoading: (isLoading: boolean) => void
    onSuccess: (() => void) | null
    openModal: (title: string, message: string, onSuccess: () => void) => void
    closeModal: () => void
}

export const useStorePopup = create<StorePopup>((set) => ({
    title: null,
    isOpen: false,
    isLoading: false,
    error: null,
    setError: (error) => set({ error }),
    message: null,
    setIsLoading: (isLoading) => set({ isLoading }),
    onSuccess: null,
    openModal: (title, message, onSuccess) => set({ isOpen: true, title, message, onSuccess }),
    closeModal: () => set({ isOpen: false, message: null, onSuccess: null, error: null, isLoading: false })
}))
