import { ReactNode, useEffect, useRef, useState } from 'react'
import styles from './dropdown-component.module.scss'
import classNames from 'classnames/bind'

interface DropdownProps {
    children: ReactNode
    options: { key: string; label: ReactNode | string }[]
    hover?: boolean
    onChange?: (key: string) => void
    isActive?: boolean
    classDropdown?: string
    classDropdownMenu?: string
    renderMenuItem?: ReactNode
}

const cx = classNames.bind(styles)
export default function Dropdown({
    children,
    options,
    hover = false,
    onChange,
    isActive = true,
    classDropdown,
    classDropdownMenu,
    renderMenuItem
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeKey, setActiveKey] = useState('1')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const dropdownMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen && dropdownRef.current && dropdownMenuRef.current) {
            const dropdownRect = dropdownRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight
            if (dropdownRect.bottom + 200 > windowHeight) {
                dropdownMenuRef.current.style.bottom = '100%'
                dropdownMenuRef.current.style.transformOrigin = 'bottom'
            } else {
                dropdownMenuRef.current.style.top = '100%'
                dropdownMenuRef.current.style.transformOrigin = 'top'
            }
        }
    }, [isOpen])

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

    return (
        <div ref={dropdownRef} className={cx('dropdown')}>
            <div
                className={cx('dropdownToggle', { isOpen }, classDropdown)}
                onMouseEnter={() => hover && setIsOpen(true)}
                onClick={() => !hover && setIsOpen(!isOpen)}
            >
                {children}
            </div>
            <div ref={dropdownMenuRef} className={cx('dropdownMenu', { isOpen }, classDropdownMenu)}>
                {renderMenuItem
                    ? renderMenuItem
                    : options.map((item) => (
                          <div
                              className={cx('dropdownMenuItem', { active: activeKey === item.key && isActive })}
                              key={item.key}
                              onClick={() => {
                                  setActiveKey(item.key)
                                  if (isActive) {
                                      setIsOpen(false)
                                  }
                                  onChange?.(item.key)
                              }}
                          >
                              {item.label}
                          </div>
                      ))}
            </div>
        </div>
    )
}
