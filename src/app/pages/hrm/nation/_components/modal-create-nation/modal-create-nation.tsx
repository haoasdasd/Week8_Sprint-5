import Input from '~/app/components/input-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation } from '@tanstack/react-query'
import { CreateNationRequestType } from '~/app/types/nation/request/nation.type'
import { nationCommandApi } from '~/app/apis/nation/command/nation.command.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { nationSchema } from '~/app/schemas/nation.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { queryClient } from '~/app/query-client'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import ModalCommon from '~/app/components/modal-common-component'
import { useRef } from 'react'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalCreateNationProps {
    modal: boolean
    toggle: () => void
}

function ModalCreateNation({ modal, toggle }: ModalCreateNationProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()
    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: (body: CreateNationRequestType) => nationCommandApi.createNation(body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateNationRequestType>({
        resolver: yupResolver(nationSchema),
        defaultValues: {
            nationName: ''
        }
    })

    const onSubmit: SubmitHandler<CreateNationRequestType> = (data) => {
        mutate(data, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.NATION_ALL] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_NATION_ADD_NATION)}
            titleFooter={getLangKey(CONFIG_LANG_KEY.PAGE_NATION_CREATE_NATION)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
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

export default ModalCreateNation
