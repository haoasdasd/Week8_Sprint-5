import classNames from 'classnames/bind'
import styles from './select-multiple-component.module.scss'
import { useEffect, useRef, useState } from 'react'
import Scrollbar from '~/app/components/scrollbar-component'
import { Col, FormGroup, Input, Label } from 'reactstrap'
import { FieldErrors } from 'react-hook-form'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import { useTranslation } from 'react-i18next'
import lodash from 'lodash'

interface Option {
    value: string
    label: string
}

interface SelectMultipleProps {
    selected?: string[]
    onChange?: (options: Option[]) => void
    disabled?: boolean
    initialOptions: Option[]
    errors?: FieldErrors
    name?: string
    label?: string
    horizontal?: boolean
}

const cx = classNames.bind(styles)
export default function SelectMultiple({
    disabled,
    initialOptions,
    errors,
    name,
    onChange,
    selected,
    label,
    horizontal
}: SelectMultipleProps) {
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(initialOptions)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const dropdownMenuRef = useRef<HTMLDivElement>(null)
    const [highlightIdx, setHighlightIdx] = useState<number>(-1)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const optionRefs = useRef<(HTMLLIElement | null)[]>([])
    const [isAsc, setIsAsc] = useState(true)

    const { getLangKey } = useLang()
    const { t } = useTranslation()

    useEffect(() => {
        setFilteredOptions(initialOptions)
    }, [initialOptions])

    useEffect(() => {
        if (selected) {
            const selectedOptions = initialOptions.filter((option) => selected.includes(option.value))
            setSelectedOptions(selectedOptions)
            // Update filteredOptions
            updateFilteredOptions(selectedOptions, searchTerm)
        }
    }, [selected])

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
            if (isOpen && searchInputRef.current) {
                searchInputRef.current.focus()
            }
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen && highlightIdx >= 0 && optionRefs.current[highlightIdx]) {
            optionRefs.current[highlightIdx]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }
    }, [highlightIdx, isOpen])

    // Handle select option
    const handleSelect = (option: Option) => {
        let updatedSelectedOptions
        if (selectedOptions.some((item) => item.value === option.value)) {
            updatedSelectedOptions = selectedOptions.filter((item) => item.value !== option.value)
        } else {
            updatedSelectedOptions = [...selectedOptions, option]
        }
        setSelectedOptions(updatedSelectedOptions)
        onChange?.(updatedSelectedOptions)
        updateFilteredOptions(updatedSelectedOptions, searchTerm)
    }

    // Update filtered options
    const updateFilteredOptions = (selectedOpts: Option[], search: string) => {
        let filtered = initialOptions.filter(
            (option) =>
                !selectedOpts.some((item) => item.value === option.value) &&
                option.label.toLowerCase().includes(search.toLowerCase())
        )
        filtered = lodash.orderBy(filtered, ['label'], [isAsc ? 'asc' : 'desc'])
        setFilteredOptions(filtered)
    }

    // Remove item options have select
    const handleRemove = (option: Option) => {
        const updatedSelectedOptions = selectedOptions.filter((item) => item.value !== option.value)
        setSelectedOptions?.(updatedSelectedOptions)
        updateFilteredOptions(updatedSelectedOptions, searchTerm)
        onChange?.(updatedSelectedOptions)
    }

    // Remove all item options
    const handleRemoveAll = () => {
        setSelectedOptions?.([])
        updateFilteredOptions([], searchTerm)
    }

    // Search filter options
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value
        setSearchTerm(search)
        updateFilteredOptions(selectedOptions, search)
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

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        if (disabled) return
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setHighlightIdx((prev) => (prev + 1) % filteredOptions.length)
                break
            case 'ArrowUp':
                e.preventDefault()
                setHighlightIdx((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length)
                break
            case 'Enter':
                e.preventDefault()
                if (filteredOptions[highlightIdx]) {
                    handleSelect(filteredOptions[highlightIdx])
                }
                break
            case 'Escape':
                e.preventDefault()
                setIsOpen(false)
                setHighlightIdx(-1)
                break
            default:
                break
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return
        if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
            e.stopPropagation()
            setIsOpen(true)
        }
    }

    const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, option: Option) => {
        if (e.key === 'Enter') {
            e.stopPropagation()
            handleSelect(option)
        }
    }

    return (
        <FormGroup row={horizontal}>
            <Col
                lg={horizontal ? 3 : 12}
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
            <Col lg={horizontal ? 9 : 12}>
                <div className={cx('multiSelect')} ref={dropdownRef}>
                    <div
                        className={cx('dropdown', { open: isOpen, disabled }, 'select-multiple')}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                        onClick={toggleDropdown}
                    >
                        <div className={cx('selected')}>
                            {selectedOptions.length > 0
                                ? selectedOptions.map((item) => (
                                      <div
                                          key={item.value}
                                          className={cx('selectedItem')}
                                          onClick={(e) => {
                                              e.stopPropagation()
                                              handleRemove(item)
                                          }}
                                      >
                                          {item.label}
                                      </div>
                                  ))
                                : getLangKey(CONFIG_LANG_KEY.ERP365_SELECT_OPTION)}
                        </div>
                        <div className={cx('arrow')}>
                            <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line`}></i>
                        </div>
                    </div>
                    {errors && name && errors[name] && typeof errors[name]?.message === 'string' && (
                        <span className='titleError'>{t(errors[name]?.message)}</span>
                    )}
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
                                {selectedOptions.length > 0 && (
                                    <span onClick={handleRemoveAll}>
                                        <i className='ri-close-line'></i>
                                    </span>
                                )}
                            </div>
                            <Scrollbar height='150px'>
                                <ul className={cx('optionsList')}>
                                    {filteredOptions.length > 0 ? (
                                        filteredOptions.map((option, index) => (
                                            <li
                                                key={option.value}
                                                tabIndex={0}
                                                ref={(el) => (optionRefs.current[index] = el)}
                                                className={cx({
                                                    selected: index === highlightIdx
                                                })}
                                                onKeyDown={(e) => handleOptionKeyDown(e, option)}
                                                onClick={() => handleSelect(option)}
                                            >
                                                {option.label}
                                            </li>
                                        ))
                                    ) : (
                                        <li className={styles.noResults}>No results found</li>
                                    )}
                                </ul>
                            </Scrollbar>
                        </div>
                    )}
                </div>
            </Col>
        </FormGroup>
    )
}
