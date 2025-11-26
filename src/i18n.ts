import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { STORAGE_KEY } from '~/app/configs/storage-key.config'

import translationEN from '~/app/locales/en.json'
import translationVN from '~/app/locales/vn.json'

const resources = {
    en: { translation: translationEN },
    vn: { translation: translationVN }
}

i18n.use(initReactI18next).init({
    resources,
    lng: 'vn', // Ngôn ngữ mặc định
    fallbackLng: 'vn', // Nếu không tìm thấy ngôn ngữ, sử dụng tiếng Anh
    interpolation: {
        escapeValue: false // Không escape các ký tự đặc biệt
    }
})

i18n.on('languageChanged', (lng) => {
    localStorage.setItem(STORAGE_KEY.LOCAL_LANGUAGE, lng)
})

export default i18n
