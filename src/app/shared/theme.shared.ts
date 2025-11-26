import { create } from 'zustand'
import { STORAGE_KEY } from '~/app/configs/storage-key.config'

interface ThemeStore {
    theme: 'light' | 'dark'
    setTheme: (theme: 'light' | 'dark') => void
}

const useStoreTheme = create<ThemeStore>((set) => ({
    theme: 'light',
    setTheme: (theme) => {
        localStorage.setItem(STORAGE_KEY.LOCAL_THEME, theme)
        set({ theme })
    }
}))

export default useStoreTheme
