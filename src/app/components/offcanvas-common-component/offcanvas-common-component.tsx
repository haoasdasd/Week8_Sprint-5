import { Offcanvas } from 'reactstrap'
import styles from './offcanvas-common-component.module.scss'
import classNames from 'classnames/bind'
import { Button } from '~/app/components/ui/button' // Shadcn UI Button
import { useTranslation } from 'react-i18next'
import Scrollbar from '~/app/components/scrollbar-component'

interface OffcanvasCommonProps {
    isOpen: boolean
    toggle: () => void
    title: string
    children: React.ReactNode
    onSubmit?: () => void
    disabled?: boolean
}

const cx = classNames.bind(styles)

export default function OffcanvasCommon({ isOpen, toggle, title, onSubmit, children, disabled = false }: OffcanvasCommonProps) {
    const { t } = useTranslation()

    return (
        <Offcanvas className={cx('offCanvasContent')} isOpen={isOpen} toggle={toggle} direction="end">
            <div className={cx('offCanvasHeader')}>
                <h2>{title}</h2>
                <span onClick={toggle} className={cx('ri-close-line', 'offCanvasHeaderToggle')}></span>
            </div>

            <Scrollbar height="600px">{children}</Scrollbar>

            <div className={cx('offCanvasFooter')}>
                {onSubmit && (
                    <Button
                        disabled={disabled}
                        size="lg"
                        variant="default"
                        className={cx('btnSave')}
                        onClick={onSubmit}
                    >
                        {t('Save')}
                    </Button>
                )}
                <Button
                    size="lg"
                    variant="destructive"
                    className={cx('btnSave')}
                    onClick={toggle}
                >
                    {t('Close')}
                </Button>
            </div>
        </Offcanvas>
    )
}
