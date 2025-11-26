import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './image-upload-component.module.scss'
import classNames from 'classnames/bind'
import uploadDefault from '~/app/assets/images/uploadIcon.png'
import { FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FILE_SIZE } from '~/app/constants/file.constant'
import { Label } from 'reactstrap'

interface ImageUploadProps {
    onChange?: (file: File) => void
    imageURL?: string
    errors?: FieldErrors
    label?: string
    name: string
}

const cx = classNames.bind(styles)
export default function ImageUpload({ onChange, imageURL, errors, name, label }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const { t } = useTranslation()

    useEffect(() => {
        if (imageURL) {
            setPreview(imageURL + `?cacheTime=${new Date().getTime()}`)
        }
    }, [imageURL])

    useEffect(() => {
        const fileMainRef = document.querySelector('#fileMain') as HTMLDivElement
        if (preview) {
            fileMainRef.style.border = 'none'
        }
    }, [preview])

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const selectedFile = acceptedFiles[0]
                setPreview(URL.createObjectURL(selectedFile))
                if (onChange) {
                    onChange(selectedFile)
                }
            }
        },
        [onChange]
    )
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/png': [],
            'image/jpeg': [],
            'image/jpg': []
        },
        maxSize: FILE_SIZE
    })

    return (
        <div className='text-center'>
            <div className={cx('container')}>
                <div id='fileMain' className={cx('fileMain')} {...getRootProps()}>
                    <input {...getInputProps()} />
                    <img src={`${preview ?? uploadDefault}`} alt='Preview' className={cx('previewImage')} />
                    <span className={cx('ri-camera-fill', 'subIcon')}></span>
                </div>
                {errors && errors[name] && typeof errors[name]?.message === 'string' && (
                    <span
                        style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                        className='titleError'
                    >
                        {t(errors[name]?.message)}
                    </span>
                )}
            </div>
            {label && <Label>{label}</Label>}
        </div>
    )
}
