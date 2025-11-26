import { useQuery } from '@tanstack/react-query'
import { langQueryApi } from '~/app/apis/lang/query/lang.query.api'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import useTranslationStore from '~/app/shared/lang.shared'
import { LangType } from '~/app/types/lang/response/lang.type'

export const useLang = () => {
    const { language } = useTranslationStore()

    const { data: langs, isLoading: isLoadingLang } = useQuery<LangType[]>({
        queryKey: [TANSTACK_KEY.LANG_ALL],
        queryFn: () => langQueryApi.getAllLang(),
        retry: 1
    })

    const getLangKey = (key: string) => {
        const lang = langs?.find((item) => item.id === key)
        return lang ? lang[language] : key
    }

    return { getLangKey, isLoadingLang, language, langs }
}
