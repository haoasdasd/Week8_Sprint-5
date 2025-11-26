/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './input-component.module.scss'
import classNames from 'classnames/bind'
import { Input as BootstrapInput, InputProps as BootstrapInputProps, Col, FormGroup, Label } from 'reactstrap'
import { Controller, Control, FieldErrors, ControllerRenderProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Input as InputStrap } from 'reactstrap'

interface InputProps extends BootstrapInputProps {
    label?: string
    name?: string
    control?: Control<any>
    errors?: FieldErrors
    icon?: string | ReactNode
    rightIcon?: boolean
    floating?: boolean
    borderStyle?: boolean
    horizontal?: boolean
    labelIcon?: ReactNode
    selected?: string
    // Dropdown
    initialOptions?: { label: string; value: any }[] // Added options for dropdown
    renderMenuItem?: ReactNode
    isDropdown?: boolean // Flag to indicate if this is a dropdown
    onChangeOption?: (option: Option | null) => void
    // Row
    colLabel?: number
    colInput?: number
    removeMarginBottom?: boolean
}

interface Option {
    value: string
    label: string
}

const cx = classNames.bind(styles)
export default function Input({
    label,
    name = '',
    errors,
    control,
    icon,
    rightIcon = false,
    floating = false,
    borderStyle = false,
    className,
    horizontal = false,
    labelIcon,
    selected,
    initialOptions,
    renderMenuItem,
    isDropdown = false,
    onChangeOption,
    colLabel = 3,
    colInput = 9,
    type,
    removeMarginBottom = false,
    ...props
}: InputProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const dropdownMenuRef = useRef<HTMLDivElement>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(initialOptions || [])
    const [displayValue, setDisplayValue] = useState<string>('') // For number formatting

    // Utility to format number with thousand separators
    const formatNumber = (value: string | number): string => {
        const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9]/g, '')) : value
        if (isNaN(num)) return '0'
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

    // Utility to parse formatted number back to raw number
    const parseNumber = (value: string): string => {
        return value.replace(/[^0-9]/g, '')
    }

    useEffect(() => {
        if (selected && initialOptions) {
            // setSelectedOption(initialOptions.filter((option) => option.value === selected)[0])
        }
    }, [selected])

    useEffect(() => {
        if (initialOptions) {
            setFilteredOptions(initialOptions)
        }
    }, [initialOptions])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value
        setSearchTerm(search)
        if (initialOptions) {
            setFilteredOptions(initialOptions.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())))
        }
    }
    // Handle selecting an option
    const handleSelect = (option: Option) => {
        onChangeOption?.(option)
        setIsOpen(false)
    }

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

    const { t } = useTranslation()

    const errorInput = useCallback(
        () =>
            errors?.[name] &&
            typeof errors?.[name]?.message === 'string' && <span className='titleError'>{t(errors?.[name]?.message)}</span>,
        [errors]
    )

    const renderInput = (field?: ControllerRenderProps<any, string>) => {
        const inputProps = {
            invalid: errors && !!errors[name],
            ...props,
            ...(field && {
                value: type === 'number' ? displayValue || formatNumber(field.value || '') : field.value,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (type === 'number') {
                        const rawValue = parseNumber(e.target.value)
                        setDisplayValue(formatNumber(rawValue))
                        field.onChange(rawValue)
                    } else {
                        field.onChange(e)
                    }
                },
                onBlur: () => {
                    if (type === 'number') {
                        field.onBlur()
                        setDisplayValue(formatNumber(field.value || '0'))
                    } else {
                        field.onBlur()
                    }
                }
            }),
            type: type === 'number' ? 'text' : type, // Use text for number formatting
            className: cx('formControl', { borderStyle, rightIcon }, className)
        }
        if (isDropdown && initialOptions && initialOptions?.length > 0) {
            return (
                <div ref={dropdownRef} className={cx('formDropdown')}>
                    <BootstrapInput
                        onClick={() => setIsOpen(!isOpen)}
                        invalid={errors && !!errors[name]}
                        {...field}
                        {...props}
                        className={cx('formControl', { borderStyle }, className)}
                    />
                    <div ref={dropdownMenuRef} className={cx('dropdownMenu', { isOpen })}>
                        <div className={cx('dropdownMenuBoxSearch')}>
                            <InputStrap
                                className={cx('inputSearch')}
                                type='search'
                                placeholder='Search'
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        {renderMenuItem
                            ? renderMenuItem
                            : filteredOptions.slice(0, 10).map((item, index) => (
                                  <div className={cx('dropdownMenuItem')} key={index} onClick={() => handleSelect(item)}>
                                      {item.label}
                                  </div>
                              ))}
                    </div>
                </div>
            )
        }
        if (floating) {
            return (
                <div className={cx('floating')}>
                    <BootstrapInput {...inputProps} className={cx('formControl', className)} />
                    <label htmlFor={name}>{label}</label>
                </div>
            )
        }

        if (icon) {
            return (
                <div className={cx('formIcon', { rightIcon })}>
                    {!errors?.[name] && icon}
                    <BootstrapInput {...inputProps} className={cx('formControl', className, { rightIcon })} />
                </div>
            )
        }

        return <BootstrapInput {...inputProps} className={cx('formControl', { borderStyle }, className)} />
    }

    return (
        <FormGroup row={horizontal} className={cx({ noMarginBottom: removeMarginBottom })}>
            {label && !floating && (
                <Col
                    lg={horizontal ? colLabel : 12}
                    className='d-flex gap-2 align-items-center'
                    style={{ marginBottom: horizontal ? (errors?.[name] ? '2.5rem' : '0.5rem') : '5px', fontSize: '12px' }}
                >
                    <Label for={name}>{label}</Label>
                    {labelIcon}
                </Col>
            )}

            <Col lg={horizontal ? colInput : 12}>
                {control ? (
                    <div style={horizontal ? { flex: 1 } : {}}>
                        <Controller name={name} control={control} render={({ field }) => renderInput(field)} />
                        {errorInput()}
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        {renderInput()} {errorInput()}
                    </div>
                )}
            </Col>
        </FormGroup>
    )
}
