import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import styles from './modal-common-component.module.scss'
import classNames from 'classnames/bind'
import { Button } from '~/app/components/ui/button'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalCommonProps {
    size?: string
    modal: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    titleFooter?: string
    onSubmit?: () => void
    disabled?: boolean
    width?: string
    footerRight?: React.ReactNode
    headerButtons?: React.ReactNode
    hideCloseButton?: boolean
    height?: string
    noPadding?: boolean
}

const cx = classNames.bind(styles)
export default function ModalCommon({
    size,
    modal,
    onClose,
    title,
    children,
    onSubmit,
    titleFooter,
    width,
    disabled = false,
    footerRight,
    headerButtons,
    hideCloseButton = false,
    height,
    noPadding = false
}: ModalCommonProps) {
    const { getLangKey } = useLang()
    const closeBtn = hideCloseButton ? null : <span onClick={() => onClose()} className={cx('closeBtn', 'ri-close-large-line')} />

    return (
        <Modal
            centered
            isOpen={modal}
            className={cx('modal')}
            size={size ?? ''}
            style={{ width: width ?? '100%', height: height ?? 'auto' }}
        >
            <ModalHeader
                className={cx('modalHeader', { headerButton: headerButtons })}
                toggle={hideCloseButton ? undefined : onClose}
                close={closeBtn}
            >
                <div className='d-flex justify-content-between align-items-center w-100'>
                    <span>{title}</span>
                    {headerButtons && <div>{headerButtons}</div>}
                </div>
            </ModalHeader>
            <ModalBody className={cx('modalBody', { noPadding })}>
                {children}
                <div className={cx('modalFooter')}>
                    {footerRight}
                    {!headerButtons && (
                        <div className={cx('action')}>
                            <Button
                                variant='outline'
                                size='lg'
                                className={cx('btnSize')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onClose()
                                    }
                                }}
                                onClick={onClose}
                            >
                                {getLangKey(CONFIG_LANG_KEY.ERP365_CLOSE)}
                            </Button>
                            {onSubmit && (
                                <Button
                                    variant='default'
                                    size='lg'
                                    className={cx('btnSize')}
                                    disabled={disabled}
                                    onClick={onSubmit}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onSubmit()
                                        }
                                    }}
                                >
                                    {titleFooter ?? getLangKey(CONFIG_LANG_KEY.ERP365_SAVE)}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </ModalBody>
        </Modal>
    )
}
