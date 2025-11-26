import { Modal, ModalBody } from 'reactstrap'
import { useStorePopup } from '~/app/shared/popup.shared'
import styles from './popup-confirm-component.module.scss'
import classNames from 'classnames/bind'
import { Button } from '~/app/components/ui/button' 
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

const cx = classNames.bind(styles)

export default function PopupConfirm() {
    const { title, isOpen, message, onSuccess, closeModal, error } = useStorePopup()
    const { getLangKey } = useLang()

    return (
        <Modal centered isOpen={isOpen} toggle={closeModal}>
            <ModalBody className={cx('modal')}>
                <div className={cx('modalHeader')}>
                    <span className={cx('modalTitle')}>{title ?? ''}</span>
                    <span className={cx('ri-close-line', 'modalIcon')} onClick={closeModal}></span>
                </div>
                <div className={cx('modalBody')}>
                    {error && <span className={cx('titleError')}>{getLangKey(error) ?? ''}</span>}
                    <span className={cx('modalMessage')}>{message}</span>
                </div>
                <div className={cx('modalFooter')}>
                    <Button variant='default' size='lg' onClick={() => onSuccess?.()}>
                        {getLangKey(CONFIG_LANG_KEY.ERP365_YES)}
                    </Button>
                    <Button variant='outline' size='lg' onClick={closeModal}>
                        {getLangKey(CONFIG_LANG_KEY.ERP365_CLOSE)}
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    )
}
