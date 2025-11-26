/* eslint-disable @typescript-eslint/no-explicit-any */

import { DetailedHTMLProps, TextareaHTMLAttributes } from 'react'
import styles from './textarea-component.module.scss'
import classNames from 'classnames/bind'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { FormGroup, Label } from 'reactstrap'
import { useTranslation } from 'react-i18next'

interface TextareaProps extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    label?: string
    name: string
    control: Control<any>
    errors: FieldErrors
}

const cx = classNames.bind(styles)
export default function Textarea({ className, label, name, control, errors, disabled, ...props }: TextareaProps) {
    const { t } = useTranslation()

    return (
        <FormGroup>
            {label && <Label for={name}>{label}</Label>}

            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    return (
                        <textarea
                            {...field}
                            {...props}
                            disabled={disabled}
                            className={cx('textarea', { disabled: disabled }, className)}
                        />
                    )
                }}
            />
            {errors[name] && typeof errors[name]?.message === 'string' && (
                <span className={'titleError'}>{t(errors[name]?.message)}</span>
            )}
        </FormGroup>
    )
}
