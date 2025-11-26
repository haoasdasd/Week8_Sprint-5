import { create } from 'zustand'

type Language = 'langVN' | 'langEN'

interface LangStore {
    language: Language
    setLanguage: (lang: Language) => void
}

const useTranslationStore = create<LangStore>((set) => ({
    language: 'langVN',
    setLanguage: (lang) => set({ language: lang })
}))

export default useTranslationStore
