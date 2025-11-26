import classNames from 'classnames/bind'
import styles from './toggle-profile.module.scss'
import avatar from '~/app/assets/images/avatar.jpg'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORAGE_KEY } from '~/app/configs/storage-key.config'
import Image from '~/app/components/image-component'
import useAuthStore from '~/app/shared/auth.shared'
import ModalChangePassword from '../modal-change-password/modal-change-password'

const cx = classNames.bind(styles)
export default function ToggleProfile() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Get Info Company
    const { profileEmployee } = useAuthStore()

    // Temp fix
    const handleLogout = () => {
        sessionStorage.removeItem(STORAGE_KEY.SESSION_PROFILE)
        // remove active menu
        sessionStorage.removeItem(STORAGE_KEY.SESSION_STATE_LEVEL_0)
        sessionStorage.removeItem(STORAGE_KEY.SESSION_STATE_LEVEL_1)
        navigate('/login')
    }

    const [isModalChangePassword, setIsModalChangePassword] = useState(false)

    const toggleModalChangePassword = () => {
        setIsModalChangePassword(!isModalChangePassword)
    }
    return (
        <Fragment>
            <div className={cx('dropdown')} ref={dropdownRef}>
                <div className={cx('profileBox')} onClick={() => setIsOpen(!isOpen)}>
                    <Image className={cx('profileBoxImg')} src={profileEmployee?.empImage ?? avatar} alt='Header Avatar' />
                </div>

                <ul className={cx('dropdownMenu', { isOpen })}>
                    <div className={cx('dropdownMenuInfo')}>
                        <Image src={profileEmployee.empImage} alt='Header Avatar' />
                        <span className={cx('name')}>{profileEmployee.empFirstName + ' ' + profileEmployee.empLastName}</span>
                        <span className={cx('tax')}>{profileEmployee.empCode}</span>
                    </div>
                    <li
                        className={cx('dropdownMenuItem')}
                        onClick={() => {
                            setIsOpen(!isOpen)
                            toggleModalChangePassword()
                        }}
                    >
                        <i className='ri-lock-2-line' /> Đổi mật khẩu
                    </li>
                    <li className={cx('dropdownMenuItem')} onClick={() => setIsOpen(!isOpen)}>
                        <i className='ri-user-settings-line' /> Thiết lập tài khoản
                    </li>
                    <div className={cx('dropdownMenuLogout')} onClick={handleLogout}>
                        <i className='ri-logout-box-r-line' />
                        <span>Đăng xuất</span>
                    </div>
                </ul>
            </div>
            <ModalChangePassword modal={isModalChangePassword} toggle={toggleModalChangePassword} />
        </Fragment>
    )
}
