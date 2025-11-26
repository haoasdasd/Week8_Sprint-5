import { useEffect, useState } from 'react'

// Define breakpoints based on the SCSS variables
const breakpoints = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
}

// Helper function to create media query strings
const getMediaQuery = (breakpoint: string): string => {
    switch (breakpoint) {
        case 'sm':
            return `(max-width: ${breakpoints.sm}px)`
        case 'md':
            return `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg - 1}px)`
        case 'lg':
            return `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.xl - 1}px)`
        case 'xl':
            return `(min-width: ${breakpoints.xl}px)`
        case 'sm-md':
            return `(max-width: ${breakpoints.lg - 1}px)`
        case 'sm-md-lg':
            return `(max-width: ${breakpoints.xl - 1}px)`
        case 'md-lg':
            return `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.xl - 1}px)`
        case 'lg-xl':
            return `(min-width: ${breakpoints.md}px)`
        case 'gt-lg':
            return `(min-width: ${breakpoints.lg}px)`
        default:
            return ''
    }
}

// Custom hook for responsive behavior with multiple breakpoints
export const useResponsive = (breakpointsArray: string[]): boolean => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        // Create an array of media query lists based on the breakpoints
        const mediaQueries = breakpointsArray.map((breakpoint) => window.matchMedia(getMediaQuery(breakpoint)))

        // Update matches state if any media query is true
        const updateMatches = () => setMatches(mediaQueries.some((media) => media.matches))
        updateMatches() // Check once initially

        // Add event listeners for each media query
        mediaQueries.forEach((media) => media.addEventListener('change', updateMatches))

        // Cleanup listeners on unmount
        return () => mediaQueries.forEach((media) => media.removeEventListener('change', updateMatches))
    }, [breakpointsArray])

    return matches
}
