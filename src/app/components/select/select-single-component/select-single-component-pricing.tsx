import classNames from 'classnames/bind'
import styles from './select-single-component-pricing.module.scss'
import { ReactNode, useEffect, useRef, useState } from 'react'
import Scrollbar from '~/app/components/scrollbar-component'
import { Input, Label, FormGroup, Col } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { FieldErrors } from 'react-hook-form'
import lodash from 'lodash'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface Option {
    value: string
    label: string
    level?: number
}

interface SelectSinglePricingProps {
    onChange?: (option: Option | null) => void
    disabled?: boolean
    initialOptions: Option[]
    errors?: FieldErrors
    name?: string
    customError?: string | null
    selected?: string
    customClass?: string
    footer?: ReactNode
    label?: string
    horizontal?: boolean
    // Row
    colLabel?: number
    colInput?: number
    width?: string
}

const cx = classNames.bind(styles)
export default function SelectSinglePricing({
    onChange,
    disabled,
    initialOptions,
    name,
    errors,
    selected,
    customError,
    customClass,
    footer,
    label,
    colLabel = 3,
    colInput = 9,
    horizontal = false,
    width = 'auto'
}: SelectSinglePricingProps) {
    const [selectedOption, setSelectedOption] = useState<Option | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(initialOptions)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const dropdownMenuRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const [highLightIdx, setHighLightIdx] = useState<number>(-1)
    const optionRefs = useRef<(HTMLLIElement | null)[]>([])
    const [isAsc, setIsAsc] = useState(true)
    const { getLangKey } = useLang()
    const { t } = useTranslation()

    useEffect(() => {
        if (selected && initialOptions) {
            const newSelect = initialOptions.find((option) => option.value === selected)
            if (newSelect) {
                setSelectedOption(initialOptions.filter((option) => option.value === selected)[0])
            }
        }
    }, [selected])

    useEffect(() => {
        setFilteredOptions(initialOptions)
        const selectedOptionIndex = lodash.findKey(initialOptions, { value: selected })

        if (selectedOptionIndex === undefined) {
            setSelectedOption(null)
        } else {
            if (selected) {
                setSelectedOption(initialOptions.filter((option) => option.value === selected)[0]) // Remove the selected option from the filtered optionS
            }
        }
    }, [initialOptions])

    // Close dropdown when click outside
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

    useEffect(() => {
        if (isOpen) {
            if (dropdownRef.current && dropdownMenuRef.current) {
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
            if (searchInputRef.current) {
                searchInputRef.current.focus()
            }
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen && highLightIdx >= 0 && optionRefs.current && optionRefs.current[highLightIdx]) {
            optionRefs.current[highLightIdx]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }
    }, [highLightIdx, isOpen])

    // Handle selecting an option
    const handleSelect = (option: Option) => {
        setSelectedOption(option)
        onChange?.(option)
        setIsOpen(false)
    }

    // Search filter options
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value
        setSearchTerm(search)
        let filtered = initialOptions.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
        filtered = lodash.orderBy(filtered, ['label'], [isAsc ? 'asc' : 'desc'])
        setFilteredOptions(filtered)
    }

    const toggleSortOrder = () => {
        setIsAsc((prev) => !prev)
        setFilteredOptions((prev) => lodash.orderBy(prev, ['label'], [!isAsc ? 'asc' : 'desc']))
    }

    // Open / Close dropdown
    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return
        if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
            e.stopPropagation()
            setIsOpen(true)
        }
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        if (disabled) return
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setHighLightIdx((prev) => (prev + 1) % filteredOptions.length)
                break

            case 'ArrowUp':
                e.preventDefault()
                setHighLightIdx((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length)
                break

            case 'Enter':
                e.preventDefault()
                if (filteredOptions[highLightIdx]) {
                    handleSelect(filteredOptions[highLightIdx])
                }
                break

            case 'Escape':
                e.preventDefault()
                setIsOpen(false)
                setHighLightIdx(-1)
                break

            default:
                break
        }
    }

    const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, option: Option) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSelect(option)
        }
    }

    return (
        <div style={{ width }}>
            <Col
                lg={horizontal ? colLabel : 12}
                style={
                    horizontal
                        ? {
                              marginBottom: `${errors && name && errors[name] ? '2.5rem' : '0.5rem'}`,
                              fontSize: '12px',
                              alignContent: 'center'
                          }
                        : { marginBottom: '0.5rem', fontSize: '12px' }
                }
            >
                {label && <Label for={name}>{label}</Label>}
            </Col>

            <Col lg={horizontal ? colInput : 12}>
                <div className={cx('selectOne', customClass)} ref={dropdownRef}>
                    <div
                        className={cx('dropdown', { open: isOpen, disabled }, 'select-single')}
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                        onClick={toggleDropdown}
                    >
                        <div className={cx('selected')}>
                            {selectedOption ? selectedOption.label : getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)}
                        </div>
                        <div className={cx('arrow')}>
                            <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line`}></i>
                        </div>
                    </div>
                    {errors && name && errors[name] && typeof errors[name]?.message === 'string' && (
                        <span className='titleError'>{t(errors[name]?.message)}</span>
                    )}
                    {customError && <span className='titleError'>{t(customError)}</span>}
                    {isOpen && (
                        <div className={cx('dropdownMenu')} ref={dropdownMenuRef}>
                            <div className={cx('searchBox')}>
                                <Input
                                    type='text'
                                    className={cx('search')}
                                    placeholder={getLangKey(CONFIG_LANG_KEY.ERP365_SEARCH)}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    innerRef={searchInputRef}
                                    onKeyDown={handleSearchKeyDown}
                                />

                                <i
                                    className={cx('ri-expand-up-down-line', 'sortToggle')}
                                    onClick={toggleSortOrder}
                                    style={{ color: 'rgba(30, 124, 187,0.7)' }}
                                ></i>
                            </div>
                            <Scrollbar height='150px'>
                                <ul className={cx('optionsList')}>
                                    {filteredOptions.length > 0 ? (
                                        filteredOptions.map((option, index) => (
                                            <li
                                                key={option.value}
                                                onClick={() => handleSelect(option)}
                                                style={{ paddingLeft: option.level && option.level > 0 ? '30px' : '' }}
                                                ref={(el) => (optionRefs.current[index] = el)}
                                                tabIndex={0}
                                                className={cx({ selected: index === highLightIdx })}
                                                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                                            >
                                                {option.label}
                                            </li>
                                        ))
                                    ) : (
                                        <li className={styles.noResults}>{getLangKey(CONFIG_LANG_KEY.ERP365_NO_RESULT_FOUND)}</li>
                                    )}
                                </ul>
                            </Scrollbar>
                            {footer}
                        </div>
                    )}
                </div>
            </Col>
        </div>
    )
}
