import { useEffect, useRef, useState } from 'react'
import styles from './date-picker-component.module.scss'
import classNames from 'classnames/bind'
import { useTranslation } from 'react-i18next'
import { FieldErrors } from 'react-hook-form'
import { Col, FormGroup, Label } from 'reactstrap'

interface DatePickerProps {
    label?: string
    horizontal?: boolean
    onChange?: (date: Date | null) => void
    value?: Date
    name: string
    errors?: FieldErrors
    disabled?: boolean
    style?: React.CSSProperties
    styleInput?: React.CSSProperties
    isDropdownBottom?: boolean
}

const cx = classNames.bind(styles)
export default function DatePicker({
    label,
    horizontal,
    onChange,
    value,
    name,
    errors,
    disabled,
    style,
    styleInput,
    isDropdownBottom = false
}: DatePickerProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [month, setMonth] = useState(0)
    const [year, setYear] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const datepickerRef = useRef<HTMLDivElement>(null)
    const { t } = useTranslation()

    useEffect(() => {
        if (value) {
            setSelectedDate(value)
            setMonth(value.getMonth())
            setYear(value.getFullYear())
            setInputValue(formatDateToString(value))
        } else {
            setMonth(now.getMonth())
            setYear(now.getFullYear())
            setInputValue('')
        }
    }, [value])

    const now = new Date()

    const formatDateToString = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    const parseDateString = (dateStr: string): Date | null => {
        // Expected format: DD/MM/YYYY
        const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
        const match = dateStr.match(regex)

        if (!match) return null

        const day = parseInt(match[1], 10)
        const month = parseInt(match[2], 10) - 1 // JavaScript months are 0-indexed
        const year = parseInt(match[3], 10)

        const date = new Date(year, month, day)

        // Validate the date is valid
        if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day || year < 1900 || year > 2100) {
            return null
        }

        return date
    }

    const months: { value: string; label: string }[] = [
        { value: '0', label: 'January' },
        { value: '1', label: 'February' },
        { value: '2', label: 'March' },
        { value: '3', label: 'April' },
        { value: '4', label: 'May' },
        { value: '5', label: 'June' },
        { value: '6', label: 'July' },
        { value: '7', label: 'August' },
        { value: '8', label: 'September' },
        { value: '9', label: 'October' },
        { value: '10', label: 'November' },
        { value: '11', label: 'December' }
    ]

    const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    const handleDateClick = (day: number) => {
        const newDate = new Date(year, month, day)
        setSelectedDate(newDate)
        setInputValue(formatDateToString(newDate))
        onChange?.(newDate)
        setIsOpen(false)
    }

    const handleMonth = (month: number) => {
        if (month === 11) {
            setMonth(0)
            setYear(year + 1)
            return
        }

        if (month === 0) {
            setMonth(11)
            setYear(year - 1)
            return
        }
        setMonth(month)
    }

    const handleOpen = () => {
        if (disabled) return
        setIsOpen(!isOpen)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)
    }

    const handleInputBlur = () => {
        const date = parseDateString(inputValue)
        if (date) {
            setSelectedDate(date)
            setMonth(date.getMonth())
            setYear(date.getFullYear())
            onChange?.(date)
        } else if (inputValue.trim() === '') {
            setSelectedDate(null)
            onChange?.(null)
        } else {
            // Invalid input - revert to previous valid date or empty
            if (selectedDate) {
                setInputValue(formatDateToString(selectedDate))
            } else {
                setInputValue('')
            }
        }
    }

    useEffect(() => {
        if (isOpen && datepickerRef.current && datepickerRef.current) {
            datepickerRef.current.style.bottom = ''
            const dropdownRect = datepickerRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight

            if (isDropdownBottom) {
                datepickerRef.current.style.top = '100%'
                datepickerRef.current.style.transformOrigin = 'top'
                return
            }

            if (dropdownRect.bottom + 200 > windowHeight) {
                datepickerRef.current.style.bottom = '100%'
                datepickerRef.current.style.transformOrigin = 'bottom'
            }
        }
    }, [isOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datepickerRef.current && !datepickerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <FormGroup row={horizontal} style={style ?? undefined}>
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
                <div className={cx('datePicker')}>
                    <input
                        style={styleInput}
                        className={cx('datePickerDropdown', { disabled })}
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onClick={() => !isOpen && handleOpen()}
                        placeholder='DD/MM/YYYY'
                    />
                    <div ref={datepickerRef} className={cx('datePickerContainer', { isOpen })}>
                        <div className={cx('datePickerHeader')}>
                            <span onClick={() => handleMonth(month - 1)} className='ri-arrow-left-s-line' />
                            <div className={cx('datePickerHeaderCenter')}>
                                <select
                                    value={month}
                                    className={cx('select')}
                                    onChange={(e) => handleMonth(Number(e.target.value))}
                                >
                                    {months?.map((item) => (
                                        <option key={item.value} value={item.value} style={{ fontSize: '13px' }}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    className={cx('datePickerHeaderCenterYear')}
                                    type='number'
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                />
                            </div>
                            <span onClick={() => handleMonth(month + 1)} className='ri-arrow-right-s-line' />
                        </div>
                        <div className={cx('datePickerMonths')}>
                            {week.map((day) => (
                                <div key={day} style={{ fontSize: '13px' }}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className={cx('datePickerDays')}>
                            {Array(firstDay)
                                .fill(null)
                                .map((item, index) => (
                                    <div key={`empty-${index}`} className='empty-day'>
                                        {item}
                                    </div>
                                ))}
                            {daysArray.map((day) => {
                                const isToday = now.getDate() === day && now.getMonth() === month && now.getFullYear() === year
                                return (
                                    <div key={day} onClick={() => handleDateClick(day)} className={cx('datePickerDaysItem')}>
                                        <span
                                            className={cx('datePickerDaysItemText', {
                                                selected: isToday,
                                                actived: selectedDate?.getDate() === day
                                            })}
                                        >
                                            {day}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {errors && errors[name] && typeof errors[name]?.message === 'string' && (
                        <span className='titleError'>{t(errors[name]?.message)}</span>
                    )}
                </div>
            </Col>
        </FormGroup>
    )
}
