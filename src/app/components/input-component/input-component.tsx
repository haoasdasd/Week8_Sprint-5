/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Control, FieldErrors, Controller, RegisterOptions } from 'react-hook-form'
import { cn } from '~/lib/utils'
import { Input } from '~/app/components/ui/input'
import { Label } from '~/app/components/ui/label'
import { Button } from '~/app/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/app/components/ui/popover'
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '~/app/components/ui/command'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '~/app/components/ui/form'
import { Search, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Option {
    value: string
    label: string
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    name: string
    control?: Control<any>
    errors?: FieldErrors
    icon?: React.ReactNode
    rightIcon?: boolean
    floating?: boolean
    borderStyle?: boolean
    horizontal?: boolean
    labelIcon?: React.ReactNode
    initialOptions?: Option[]
    onChangeOption?: (option: Option | null) => void
    removeMarginBottom?: boolean
    description?: string
    isPassword?: boolean
    validation?: RegisterOptions
}

export default function CustomInput({
    label,
    name,
    control,
    errors,
    icon,
    rightIcon = false,
    floating = false,
    borderStyle = false,
    className,
    horizontal = false,
    labelIcon,
    initialOptions,
    onChangeOption,
    type = 'text',
    removeMarginBottom = false,
    description,
    isPassword = false,
    validation,
    ...props
}: InputProps) {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(initialOptions || [])
    const [displayValue, setDisplayValue] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (initialOptions) setFilteredOptions(initialOptions)
    }, [initialOptions])

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        if (initialOptions) {
            setFilteredOptions(initialOptions.filter((opt) => opt.label.toLowerCase().includes(value.toLowerCase())))
        }
    }

    const handleSelect = (option: Option, field?: any) => {
        field?.onChange(option.value)
        onChangeOption?.(option)
        setIsOpen(false)
        setSearchTerm('')
    }

    const formatNumber = (value: string | number) => {
        if (!value) return ''
        const num = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) : value
        if (isNaN(num)) return ''
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

    const parseNumber = (value: string) => value.replace(/\D/g, '')

    const renderInputField = (field?: any) => {
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

        const inputProps = {
            ...props,
            ...(field && {
                value: type === 'number' ? displayValue || formatNumber(field.value || '') : field.value,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (type === 'number') {
                        const raw = parseNumber(e.target.value)
                        setDisplayValue(formatNumber(raw))
                        field.onChange(raw)
                    } else {
                        field.onChange(e.target.value)
                    }
                },
                onBlur: () => {
                    if (type === 'number') setDisplayValue(formatNumber(field.value || ''))
                    field?.onBlur?.()
                }
            }),
            type: type === 'number' ? 'text' : inputType,
            className: cn(
                'input-enhanced smooth-transition focus-ring',
                {
                    'pl-10': icon && !rightIcon && !isPassword,
                    'pr-10': (icon && rightIcon) || isPassword,
                    'border-2': borderStyle,
                    'border-destructive': name && errors?.[name],
                    'bg-white/50': !field?.value
                },
                className
            )
        }

        // Dropdown
        if (initialOptions && initialOptions.length > 0) {
            const selectedOption = initialOptions.find((opt) => opt.value === field?.value)
            return (
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={isOpen}
                            className={cn(
                                'w-full justify-between h-10 px-3 py-2 text-sm smooth-transition',
                                'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                                'focus-ring rounded-md',
                                !field?.value && 'text-muted-foreground',
                                name && errors?.[name] && 'border-destructive border-2'
                            )}
                        >
                            <span className='truncate font-medium'>
                                {selectedOption ? selectedOption.label : 'Select an option...'}
                            </span>
                            <ChevronDown
                                className={cn('ml-2 h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
                            />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0 dropdown-enhanced border' align='start' sideOffset={4}>
                        <Command className='rounded-lg'>
                            <div className='flex items-center border-b px-3 py-2 bg-muted/50'>
                                <Search className='mr-2 h-4 w-4 shrink-0 opacity-60' />
                                <CommandInput
                                    placeholder='Search options...'
                                    value={searchTerm}
                                    onValueChange={handleSearchChange}
                                    className='h-9 border-none focus:ring-0 text-sm bg-transparent'
                                />
                            </div>
                            <CommandEmpty className='py-6 text-center text-sm text-muted-foreground'>
                                <div className='flex flex-col items-center gap-2'>
                                    <Search className='h-8 w-8 opacity-40' />
                                    <span>No results found</span>
                                </div>
                            </CommandEmpty>
                            <CommandGroup className='max-h-64 overflow-auto py-2'>
                                {filteredOptions.slice(0, 10).map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => handleSelect(option, field)}
                                        className='cursor-pointer px-3 py-3 text-sm transition-all duration-200 mx-2 rounded-md hover:bg-accent hover:text-accent-foreground aria-selected:bg-primary aria-selected:text-primary-foreground border border-transparent hover:border-border'
                                    >
                                        <span className='truncate font-medium'>{option.label}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            )
        }

        // Floating label
        if (floating) {
            return (
                <div className='relative'>
                    <Input
                        {...inputProps}
                        placeholder=' '
                        className={cn('peer pt-6 pb-2 px-3 bg-transparent', inputProps.className)}
                    />
                    <Label
                        htmlFor={name}
                        className={cn(
                            'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-normal transition-all duration-300 ease-in-out pointer-events-none',
                            'peer-focus:top-3 peer-focus:text-xs peer-focus:text-primary peer-focus:-translate-y-0 peer-focus:font-medium',
                            'peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm',
                            (field?.value || props.value) && 'top-3 text-xs -translate-y-0 text-primary font-medium'
                        )}
                    >
                        {label}
                    </Label>
                </div>
            )
        }

        // Password or icon
        if (icon || isPassword) {
            return (
                <div className={cn('relative', { 'flex-row-reverse': rightIcon })}>
                    {icon && !isPassword && (
                        <div
                            className={cn(
                                'absolute inset-y-0 flex items-center pointer-events-none z-10 smooth-transition',
                                rightIcon ? 'right-3' : 'left-3'
                            )}
                        >
                            {React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4 transition-all duration-200' })}
                        </div>
                    )}
                    {isPassword && (
                        <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent smooth-transition'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className='h-4 w-4 text-muted-foreground' />
                            ) : (
                                <Eye className='h-4 w-4 text-muted-foreground' />
                            )}
                        </Button>
                    )}
                    <Input {...inputProps} />
                </div>
            )
        }

        return <Input {...inputProps} />
    }

    // Controlled input
    if (control && name) {
        return (
            <Controller
                control={control}
                name={name}
                rules={{ required: t('This field is required'), ...validation }}
                render={({ field, fieldState }) => (
                    <FormItem className={cn('w-full', horizontal ? 'flex flex-row items-center gap-4' : 'space-y-2')}>
                        {label && !floating && (
                            <FormLabel
                                className={cn('text-sm font-medium leading-none', !horizontal && 'flex items-center gap-2')}
                            >
                                {label}
                                {labelIcon}
                            </FormLabel>
                        )}
                        <div className={cn('w-full', horizontal && 'flex-1')}>
                            <FormControl>{renderInputField(field)}</FormControl>
                            {description && <FormDescription>{description}</FormDescription>}
                            {fieldState.error && (
                                <FormMessage className='text-destructive text-sm mt-1'>
                                    {t(fieldState.error.message || '')}
                                </FormMessage>
                            )}
                        </div>
                    </FormItem>
                )}
            />
        )
    }

    // Uncontrolled input
    return (
        <div className={cn('w-full space-y-2', removeMarginBottom && 'mb-0')}>
            {label && !floating && (
                <div className='flex items-center gap-2'>
                    <Label htmlFor={name} className='text-sm font-medium leading-none'>
                        {label}
                    </Label>
                    {labelIcon}
                </div>
            )}
            {renderInputField()}
            {name && errors?.[name] && (
                <span className='text-sm font-medium text-destructive'>{t(errors[name]?.message as string)}</span>
            )}
            {description && <p className='text-sm text-muted-foreground mt-1'>{description}</p>}
        </div>
    )
}
