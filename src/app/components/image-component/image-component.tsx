import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import uploadDefault from '~/app/assets/images/uploadIcon.png'

// FIX CACHE IMAGE
export default function Image({ src, ...props }: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
    const cacheBustedSrc = `${src ?? uploadDefault}?t=${new Date().getTime()}`
    return <img {...props} src={cacheBustedSrc} />
}
