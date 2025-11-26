import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { maritalQueryApi } from '~/app/apis/marital/query/marital.query.api'
import { UpdateMaritalRequestType } from '~/app/types/marital/request/marital.type'
import { maritalCommandApi } from '~/app/apis/marital/command/marital.command.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { maritalSchema } from '~/app/schemas/marital.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import { queryClient } from '~/app/query-client'
import Input from '~/app/components/input-component'
import ModalCommon from '~/app/components/modal-common-component'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalUpdateMaritalProps {
    modal: boolean
    toggle: () => void
    id: number
}

export default function ModalUpdateMarital({ modal, toggle, id }: ModalUpdateMaritalProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data: marital } = useQuery({
        queryKey: [TANSTACK_KEY.MARITAL_ONE, id],
        queryFn: () => maritalQueryApi.getMaritalById(id),
        enabled: !!id
    })

    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateMaritalRequestType }) => maritalCommandApi.updateMarital(id, body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateMaritalRequestType>({
        resolver: yupResolver(maritalSchema),
        defaultValues: {
            id: 0,
            maritalName: ''
        }
    })

    useEffect(() => {
        if (marital) {
            reset(marital)
        }
    }, [marital, reset])

    const onSubmit: SubmitHandler<UpdateMaritalRequestType> = (body) => {
        mutate(
            { id, body },
            {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.MARITAL_ALL] })
                    queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.MARITAL_ONE, id] })
                    toggle()
                    messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_UPDATE_SUCCESSFULLY))
                    reset()
                }
            }
        )
    }

    const formRef = useRef<HTMLFormElement>(null)
    useKeydownForm(formRef)

    return (
        <ModalCommon
            modal={modal}
            onClose={() => toggle()}
            title={getLangKey(CONFIG_LANG_KEY.PAGE_MARITAL_UPDATE_MARITAL)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
            <Form onSubmit={handleSubmit(onSubmit)} innerRef={formRef}>
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
