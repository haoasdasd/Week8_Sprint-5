import { RefObject, useEffect } from 'react'

export const useKeydownForm = (formRef: RefObject<HTMLFormElement>) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!formRef.current) return

            // Get all focusable form elements excluding the submit button
            const inputs = Array.from(
                formRef.current.querySelectorAll('input, select, textarea, .select-multiple, .select-single')
            ).filter((el) => el.tagName !== 'INPUT' || (el as HTMLInputElement).type !== 'file')

            // Get submit button separately

            const currentIndex = inputs.indexOf(document.activeElement as HTMLElement)
            const isTextarea = document.activeElement instanceof HTMLTextAreaElement

            if ((e.key === 'Enter' || e.key === 'ArrowDown') && !isTextarea) {
                e.preventDefault()

                // If we're on the last input
                if (currentIndex === inputs.length - 1) {
                    formRef.current.requestSubmit()
                } else {
                    // Otherwise move to next input
                    const nextIndex = currentIndex + 1
                    ;(inputs[nextIndex] as HTMLElement).focus()
                }
            } else if (e.key === 'ArrowUp' && !isTextarea) {
                e.preventDefault()
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : inputs.length - 1
                ;(inputs[prevIndex] as HTMLElement).focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])
}
