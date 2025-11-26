import Input from '~/app/components/input-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { religionQueryApi } from '~/app/apis/religion/query/religion.query.api'
import { UpdateReligionRequestType } from '~/app/types/religion/request/religion.type'
import { religionCommandApi } from '~/app/apis/religion/command/religion.command.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { religionSchema } from '~/app/schemas/religion.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import { queryClient } from '~/app/query-client'
import ModalCommon from '~/app/components/modal-common-component'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalUpdateReligionProps {
    modal: boolean
    toggle: () => void
    id: number
}

export default function ModalUpdateReligion({ modal, toggle, id }: ModalUpdateReligionProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data: religion } = useQuery({
        queryKey: [TANSTACK_KEY.RELIGION_ONE, id],
        queryFn: () => religionQueryApi.getReligionById(id),
        enabled: !!id
    })

    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateReligionRequestType }) => religionCommandApi.updateReligion(id, body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateReligionRequestType>({
        resolver: yupResolver(religionSchema),
        defaultValues: {
            id: 0,
            religionName: ''
        }
    })

    useEffect(() => {
        if (religion) {
            reset(religion)
        }
    }, [religion, reset])

    const onSubmit: SubmitHandler<UpdateReligionRequestType> = (body) => {
        mutate(
            { id, body },
            {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.RELIGION_ALL] })
                    queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.RELIGION_ONE, id] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_RELIGION_UPDATE_RELIGION)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label={getLangKey(CONFIG_LANG_KEY.PAGE_RELIGION_TITLE_INPUT_RELIGION)}
                    placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_RELIGION_PLACEHOLDER_RELIGION)}
                    control={control}
                    name='religionName'
                    errors={errors}
                />
            </Form>
        </ModalCommon>
    )
}
