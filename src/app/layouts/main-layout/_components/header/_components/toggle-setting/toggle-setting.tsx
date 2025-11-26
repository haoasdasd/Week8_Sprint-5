import ButtonIcon from '~/app/components/button/button-icon-component'
import Dropdown from '~/app/components/dropdown-component'
import styles from './toggle-setting.module.scss'
import classNames from 'classnames/bind'
import { useStoreSidebar } from '~/app/shared/sidebar.shared'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

const cx = classNames.bind(styles)
export default function ToggleSetting() {
    const { mode, setMode } = useStoreSidebar()
    const { getLangKey } = useLang()

    const handleMode = (mode: 'vertical' | 'horizontal') => {
        setMode(mode)
    }

    const renderMenuItem = (
        <div className={cx('dropdownRender')}>
            <span className={cx('title')}>{getLangKey(CONFIG_LANG_KEY.ERP365_LAYOUT)}</span>
            <span className={cx('subTitle')}>{getLangKey(CONFIG_LANG_KEY.ERP365_CHOOSE_YOUR_LAYOUT)}</span>
            <div className={cx('layouts')}>
                <div className={cx('layoutItemVer')} onClick={() => handleMode('vertical')}>
                    <div className={cx('layoutVertical', { active: mode === 'vertical' })}>
                        <div className={cx('layoutVerticalSidebar')}>
                            <div className={cx('layoutVerticalSidebarImage')}></div>
                            <div className={cx('layoutVerticalSidebarMenu')}></div>
                            <div className={cx('layoutVerticalSidebarMenu')}></div>
                            <div className={cx('layoutVerticalSidebarMenu')}></div>
                        </div>
                        <div className={cx('layoutVerticalContent')}>
                            <div className={cx('layoutVerticalContentHeader')}></div>
                            <div className={cx('layoutVerticalContentFooter')}></div>
                        </div>
                    </div>
                    <span className={cx('layoutVerticalText')}>{getLangKey(CONFIG_LANG_KEY.ERP365_VERTICAL)}</span>
                </div>
                <div className={cx('layoutItemHor')} onClick={() => handleMode('horizontal')}>
                    <div className={cx('layoutHorizontal', { active: mode === 'horizontal' })}>
                        <div className={cx('layoutHorizontalSidebar')}>
                            <div className={cx('layoutHorizontalSidebarImage')}></div>
                        </div>
                        <div className={cx('layoutHorizontalContent')}>
                            <div className={cx('layoutHorizontalContentHeader')}></div>
                            <div className={cx('layoutHorizontalContentSubHeader')}>
                                <div className={cx('layoutHorizontalContentSubHeaderMenu')}></div>
                                <div className={cx('layoutHorizontalContentSubHeaderMenu')}></div>
                                <div className={cx('layoutHorizontalContentSubHeaderMenu')}></div>
                            </div>
                            <div className={cx('layoutHorizontalContentFooter')}></div>
                        </div>
                    </div>
                    <span className={cx('layoutHorizontalText')}>{getLangKey(CONFIG_LANG_KEY.ERP365_HORIZONTAL)}</span>
                </div>
            </div>
        </div>
    )
    return (
        <Dropdown
            options={[]}
            renderMenuItem={renderMenuItem}
            classDropdown={cx('dropdownSetting')}
            classDropdownMenu={cx('dropdownMenuSetting')}
        >
            <ButtonIcon icon='ri-settings-4-line' />
        </Dropdown>
    )
}
