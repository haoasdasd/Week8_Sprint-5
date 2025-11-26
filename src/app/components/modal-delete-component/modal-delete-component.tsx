import classNames from 'classnames/bind'
import styles from './modal-delete-component.module.scss'
import { Button, Modal, ModalBody } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalDeleteProps {
    show?: boolean
    onDeleteClick?: () => void
    onCloseClick?: () => void
    recordId?: string
    error?: string
}

const cx = classNames.bind(styles)
export default function ModalDelete({ show, onDeleteClick, onCloseClick, recordId, error }: ModalDeleteProps) {
    const { getLangKey } = useLang()

    const closeBtn = <span onClick={() => onCloseClick?.()} className={cx('closeBtn', 'ri-close-large-line')} />

    return (
        <Modal fade={true} isOpen={show} centered={true}>
            <ModalBody className={cx('py-3 px-5', 'modalBody')}>
                <div className={cx('modalHeader')}>{closeBtn}</div>
                {error && <span className='titleError'>{error}</span>}
                <div className={'mt-2 text-center'}>
                    <lord-icon
                        src='https://cdn.lordicon.com/hwjcdycb.json'
                        trigger='loop'
                        delay='500'
                        colors='primary:#f7b84b,secondary:#f06548'
                        style={{ width: '100px', height: '100px' }}
                    ></lord-icon>
                    <div className={cx('modalBodyHeadTitle')}>
                        <h4>{getLangKey(CONFIG_LANG_KEY.ERP365_TITLE_MESSAGE_DELETE)}</h4>
                        <p className={cx('textColor')}>
                            {getLangKey(CONFIG_LANG_KEY.ERP365_SUB_TITLE_MESSAGE_DELETE)} {recordId ? recordId : ''} ?
                        </p>
                    </div>
                </div>
                <div className={cx('modalFooter')}>
                    <Button
                        type='button'
                        color='light'
                        size='lg'
                        className={cx('btn')}
                        data-bs-dismiss='modal'
                        onClick={() => onCloseClick?.()}
                    >
                        {getLangKey(CONFIG_LANG_KEY.ERP365_CLOSE)}
                    </Button>
                    <Button type='button' color='danger' size='lg' className={cx('btn')} onClick={onDeleteClick}>
                        {getLangKey(CONFIG_LANG_KEY.ERP365_YES)}
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    )
}
