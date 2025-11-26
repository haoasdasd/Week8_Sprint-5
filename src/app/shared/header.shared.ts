import { create } from 'zustand'

interface HeaderSidebar {
    isLoading: boolean
    btnSubmit: string
    setBtnSubmit: (btnSubmit: string, onSubmit: () => void) => void
    titleSubmit: string
    setIsLoading: (isLoading: boolean) => void
    titleClose: string
    onCancel: () => void
    onSubmit: () => void
    setSubmit: (titleSubmit: string, onSubmit: () => void, onCancel: () => void, titleClose?: string) => void
    closeSubmit: () => void
}

export const useStoreHeader = create<HeaderSidebar>((set) => ({
    isLoading: false,
    btnSubmit: '',
    setBtnSubmit: (btnSubmit, onSubmit) => set({ btnSubmit, onSubmit }),
    titleSubmit: '',
    setIsLoading: (isLoading) => set({ isLoading }),
    titleClose: '',
    onCancel: () => {},
    onSubmit: () => {},
    setSubmit: (titleSubmit, onSubmit, onCancel, titleClose) => set({ titleSubmit, onSubmit, onCancel, titleClose }),
    closeSubmit: () => set({ titleSubmit: '', onSubmit: () => {}, onCancel: () => {}, isLoading: false, titleClose: '' })
}))
