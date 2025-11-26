/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames/bind'
import styles from './select-component.module.scss'
import { DetailedHTMLProps, SelectHTMLAttributes } from 'react'

interface SelectProps extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    data?: { value: string; label: string }[]
    optionDefault?: string
}

const cx = classNames.bind(styles)
export default function Select({ data, optionDefault, className, ...props }: SelectProps) {
    return (
        <select
            {...props}
            className={cx('select', className)}
            onChange={(e) => {
                props.onChange?.(e)
            }}
        >
            {optionDefault && <option value='0'>{optionDefault}</option>}
            {data?.map((item) => (
                <option key={item.value} value={item.value}>
                    {item.label}
                </option>
            ))}
        </select>
    )
}
