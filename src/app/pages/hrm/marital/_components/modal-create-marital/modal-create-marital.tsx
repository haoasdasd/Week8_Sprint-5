import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation } from '@tanstack/react-query'
import { CreateMaritalRequestType } from '~/app/types/marital/request/marital.type'
import { maritalCommandApi } from '~/app/apis/marital/command/marital.command.api'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { maritalSchema } from '~/app/schemas/marital.schema'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { queryClient } from '~/app/query-client'
import Input from '~/app/components/input-component'
import ModalCommon from '~/app/components/modal-common-component'
import { useRef } from 'react'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalCreateMaritalProps {
    modal: boolean
    toggle: () => void
}
export default function ModalCreateMarital({ modal, toggle }: ModalCreateMaritalProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()
    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: (body: CreateMaritalRequestType) => maritalCommandApi.createMarital(body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateMaritalRequestType>({
        resolver: yupResolver(maritalSchema),
        defaultValues: {
            maritalName: ''
        }
    })

    const onSubmit: SubmitHandler<CreateMaritalRequestType> = (data) => {
        mutate(data, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.MARITAL_ALL] })
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
            onClose={() => toggle()}
            title={getLangKey(CONFIG_LANG_KEY.PAGE_MARITAL_ADD_MARITAL)}
            titleFooter={getLangKey(CONFIG_LANG_KEY.PAGE_MARITAL_CREATE_MARITAL)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
                <Input
                    label={getLangKey(CONFIG_LANG_KEY.PAGE_MARITAL_TITLE_INPUT_MARITAL)}
                    placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_MARITAL_PLACEHOLDER_MARITAL)}
                    control={control}
                    name='maritalName'
                    errors={errors}
                />
            </Form>
        </ModalCommon>
    )
}
