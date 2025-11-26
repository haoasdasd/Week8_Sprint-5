import { FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ReactQuill, { ReactQuillProps } from 'react-quill'

interface QuillProps extends ReactQuillProps {
    name?: string
    errors?: FieldErrors
}

export default function Quill({ name, errors, ...props }: QuillProps) {
    const { t } = useTranslation()
    const modules = {
        toolbar: [
            [{ font: [] }, { size: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ align: [] }],
            ['link', 'image', 'video', 'formula'],
            ['clean']
        ]
    }

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'color',
        'background',
        'script',
        'blockquote',
        'code-block',
        'list',
        'bullet',
        'indent',
        'direction',
        'align',
        'link',
        'image',
        'video',
        'formula',
        'clean'
    ]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '46px' }}>
            <ReactQuill theme='snow' {...props} modules={modules} formats={formats} style={{ height: '300px' }} />
            {errors && name && errors[name] && typeof errors[name]?.message === 'string' && (
                <span className='titleError'>{t(errors[name]?.message)}</span>
            )}
        </div>
    )
}
