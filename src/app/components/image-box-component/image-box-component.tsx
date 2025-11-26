import classNames from 'classnames/bind'
import styles from './image-box-component.module.scss'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Modal } from 'reactstrap'

interface ImageBoxProps {
    onChange?: (file: File) => void
    imageURL?: string
}

const cx = classNames.bind(styles)
export default function ImageBox({ onChange, imageURL }: ImageBoxProps) {
    const [fileName, setFileName] = useState('')
    const [preview, setPreview] = useState('')
    const [isModal, setIsModal] = useState(false)

    useEffect(() => {
        if (imageURL) {
            setPreview(imageURL)
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
                setFileName(selectedFile.name)
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
        }
    })

    return (
        <div className={cx('containerContent')}>
            <div id='fileMain' className={cx('fileMain')} {...getRootProps()}>
                <input {...getInputProps()} />
                <span className={cx('ri-camera-fill', 'subIcon')}></span>
                {preview && <span className={cx('title')}>{fileName}</span>}
            </div>
            {preview && (
                <Fragment>
                    <div className={cx('fileView')} onClick={() => setIsModal(true)}>
                        <span className='ri-eye-fill'></span>
                    </div>
                    <Modal isOpen={isModal} toggle={() => setIsModal(false)} centered>
                        <img src={preview} alt='Preview' className={cx('previewImage')} />
                    </Modal>
                </Fragment>
            )}
        </div>
    )
}
