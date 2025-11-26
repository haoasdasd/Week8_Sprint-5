/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames/bind'
import { Fragment } from 'react'
import languages from '~/app/constants/languages.constant'
import styles from './toggle-language.module.scss'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import ButtonIcon from '~/app/components/button/button-icon-component'
import useTranslationStore from '~/app/shared/lang.shared'
import Dropdown from '~/app/components/dropdown-component'

const cx = classNames.bind(styles)
export default function ToggleLanguage() {
    const { i18n } = useTranslation()
    const { setLanguage } = useTranslationStore()

    const handleChangeLanguage = (lang: any) => {
        i18n.changeLanguage(lang)
        setLanguage(lang === 'vn' ? 'langVN' : 'langEN')
    }

    const options = Object.keys(languages).map((key) => ({
        key: key,
        label: (
            <Fragment>
                <img src={get(languages, `${key}.flag`)} alt='Skote' height='18' />
                <span>{get(languages, `${key}.label`)}</span>
            </Fragment>
        )
    }))

    return (
        <Dropdown
            options={options}
            classDropdown={cx('dropdownLanguage')}
            classDropdownMenu={cx('dropdownLanguageMenu')}
            onChange={handleChangeLanguage}
        >
            <ButtonIcon icon='ri-global-line' />
        </Dropdown>
    )
}
