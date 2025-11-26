import Input from '~/app/components/input-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation } from '@tanstack/react-query'
import { CreateDegreeRequestType } from '~/app/types/degree/request/degree.type'
import { degreeCommandApi } from '~/app/apis/degree/command/degree.command.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { degreeSchema } from '~/app/schemas/degree.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { queryClient } from '~/app/query-client'
import ModalCommon from '~/app/components/modal-common-component'
import { useRef } from 'react'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalCreateDegreeProps {
    modal: boolean
    toggle: () => void
}

export default function ModalCreateDegree({ modal, toggle }: ModalCreateDegreeProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()
    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: (body: CreateDegreeRequestType) => degreeCommandApi.createDegree(body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateDegreeRequestType>({
        resolver: yupResolver(degreeSchema),
        defaultValues: {
            degreeName: ''
        }
    })

    const onSubmit: SubmitHandler<CreateDegreeRequestType> = (data) => {
        mutate(data, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.DEGREE_ALL] })
                toggle()
                messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_CREATE_SUCCESSFULLY))
                reset()
            }
        })
    }

    const formRef = useRef<HTMLFormElement>(null)
    useKeydownForm(formRef)

    return (
        <ModalCommon
            modal={modal}
            onClose={toggle}
            title={getLangKey(CONFIG_LANG_KEY.PAGE_DEGREE_ADD_DEGREE)}
            titleFooter={getLangKey(CONFIG_LANG_KEY.PAGE_DEGREE_CREATE_DEGREE)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
                    <Input
                        label={getLangKey(CONFIG_LANG_KEY.PAGE_DEGREE_TITLE_INPUT_DEGREE)}
                        placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_DEGREE_PLACEHOLDER_DEGREE)}
                        control={control}
                        name='degreeName'
                        errors={errors}
                    />
                </div>
            </Form>
        </ModalCommon>
    )
}
