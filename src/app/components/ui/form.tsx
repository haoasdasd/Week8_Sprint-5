import * as React from "react"
import { useForm } from "react-hook-form"
import { cn } from "~/lib/utils"
import { Label } from "./label"

// Form Context
interface FormContextType {
  control: any
}

const FormContext = React.createContext<FormContextType | undefined>(undefined)

// Form Component
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  form?: any
  children?: React.ReactNode
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ form, className, children, ...props }, ref) => {
    const formInstance = form || useForm()
    
    return (
      <FormContext.Provider value={{ control: formInstance.control }}>
        <form
          ref={ref}
          onSubmit={formInstance.handleSubmit}
          className={cn("space-y-6", className)}
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    )
  }
)
Form.displayName = "Form"

// Form Field Context
interface FormFieldContextType {
  name: string
}

const FormFieldContext = React.createContext<FormFieldContextType | undefined>(undefined)

// Form Field Component
interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  control?: any
  render?: (props: { field: any }) => React.ReactNode
  children?: React.ReactNode
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ name, control, render, children, className, ...props }, ref) => {
    const formContext = React.useContext(FormContext)
    const fieldControl = control || formContext?.control

    if (!fieldControl) {
      throw new Error("FormField must be used within a Form component or have a control prop")
    }

    // Get field state from react-hook-form
    const field = {
      name,
      value: fieldControl._getWatch(name),
      onChange: (value: any) => fieldControl.setValue(name, value),
      onBlur: () => fieldControl.trigger(name),
    }

    const error = fieldControl._formState?.errors?.[name]

    return (
      <FormFieldContext.Provider value={{ name }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          {render ? render({ field }) : children}
          {error && (
            <p className="text-sm font-medium text-destructive">
              {error.message}
            </p>
          )}
        </div>
      </FormFieldContext.Provider>
    )
  }
)
FormField.displayName = "FormField"

// Form Item Component
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
})
FormItem.displayName = "FormItem"

// Form Label Component
const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

// Form Control Component
const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />
})
FormControl.displayName = "FormControl"

// Form Description Component
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

// Form Message Component
interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, message, children, ...props }, ref) => {
    const fieldContext = React.useContext(FormFieldContext)
    const formContext = React.useContext(FormContext)
    
    const error = fieldContext?.name 
      ? formContext?.control?._formState?.errors?.[fieldContext.name]
      : null

    const errorMessage = message || error?.message

    if (!errorMessage) {
      return null
    }

    return (
      <p
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {errorMessage}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}