/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames/bind'
import styles from './switches-component.module.scss'
import { FormGroup, Input, InputProps, Label } from 'reactstrap'
import { Control, Controller, ControllerRenderProps, FieldErrors } from 'react-hook-form'

interface SwitchProps extends InputProps {
    label?: string
    name: string
    control: Control<any>
    errors: FieldErrors
    useNumberCheck?: boolean
}

const cx = classNames.bind(styles)
export default function Switches({ label, name, control, errors, className, useNumberCheck, ...props }: SwitchProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: ControllerRenderProps<any, string>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            field.onChange(useNumberCheck ? (field.value === 1 ? 0 : 1) : !field.value)
        }
    }
    return (
        <FormGroup switch>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Input
                        checked={useNumberCheck ? field.value === 1 : field.value}
                        onChange={
                            (e) => field.onChange(useNumberCheck ? (e.target.checked ? 1 : 0) : e.target.checked) // Thay đổi theo kiểu 0/1 hoặc boolean
                        }
                        {...props}
                        type='switch'
                        invalid={!!errors[name]}
                        className={cx('switch', className)}
                        onKeyDown={(e) => handleKeyDown(e, field)}
                    />
                )}
            />
            {label && <Label for={name}>{label}</Label>}
        </FormGroup>
    )
}
