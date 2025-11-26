import Input from '~/app/components/input-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { nationQueryApi } from '~/app/apis/nation/query/nation.query.api'
import { UpdateNationRequestType } from '~/app/types/nation/request/nation.type'
import { nationCommandApi } from '~/app/apis/nation/command/nation.command.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { nationSchema } from '~/app/schemas/nation.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import { queryClient } from '~/app/query-client'
import ModalCommon from '~/app/components/modal-common-component'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalUpdateNationProps {
    modal: boolean
    toggle: () => void
    id: number
}

export default function ModalUpdateNation({ modal, toggle, id }: ModalUpdateNationProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data: nation } = useQuery({
        queryKey: [TANSTACK_KEY.NATION_ONE, id],
        queryFn: () => nationQueryApi.getNationById(id),
        enabled: !!id
    })

    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateNationRequestType }) => nationCommandApi.updateNation(id, body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateNationRequestType>({
        resolver: yupResolver(nationSchema),
        defaultValues: {
            id: 0,
            nationName: ''
        }
    })

    useEffect(() => {
        if (nation) {
            reset(nation)
        }
    }, [nation, reset])

    const onSubmit: SubmitHandler<UpdateNationRequestType> = (body) => {
        mutate(
            { id, body },
            {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.NATION_ALL] })
                    queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.NATION_ONE, id] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_NATION_UPDATE_NATION)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label={getLangKey(CONFIG_LANG_KEY.PAGE_NATION_TITLE_INPUT_NATION)}
                    placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_NATION_PLACEHOLDER_NATION)}
                    control={control}
                    name='nationName'
                    errors={errors}
                />
            </Form>
        </ModalCommon>
    )
}
