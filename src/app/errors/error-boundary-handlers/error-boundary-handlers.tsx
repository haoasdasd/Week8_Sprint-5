import React, { Component, ReactNode } from 'react'
import ErrorBoundaryComponent from '../../pages/errors/error-boundary-page/error-boundary-page'

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
}

class ErrorBoundaryHandlers extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error Boundary caught an error', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return <ErrorBoundaryComponent />
        }

        return this.props.children
    }
}

export default ErrorBoundaryHandlers
