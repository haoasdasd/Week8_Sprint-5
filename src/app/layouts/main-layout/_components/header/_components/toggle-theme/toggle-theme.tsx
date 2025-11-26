import ButtonIcon from '~/app/components/button/button-icon-component'
import useStoreTheme from '~/app/shared/theme.shared'

export default function ToggleTheme() {
    const { theme, setTheme } = useStoreTheme()
    const handleChangeTheme = () => {
        if (theme == 'light') {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }

    return theme == 'light' ? (
        <ButtonIcon icon='ri-sun-line' onClick={handleChangeTheme} />
    ) : (
        <ButtonIcon icon='ri-moon-line' onClick={handleChangeTheme} />
    )
}
