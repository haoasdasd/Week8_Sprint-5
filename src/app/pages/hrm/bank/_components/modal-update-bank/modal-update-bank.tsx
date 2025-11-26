import { useEffect, useRef } from 'react'
import Input from '~/app/components/input-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { UpdateBankRequestType } from '~/app/types/bank/request/bank.type'
import { bankCommandApi } from '~/app/apis/bank/command/bank.command.api'
import { bankSchema } from '~/app/schemas/bank.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import { queryClient } from '~/app/query-client'
import { bankQueryApi } from '~/app/apis/bank/query/bank.query.api'
import ModalCommon from '~/app/components/modal-common-component'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalUpdateBankProps {
    modal: boolean
    toggle: () => void
    id: number
}

export default function ModalUpdateBank({ modal, toggle, id }: ModalUpdateBankProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data: bank } = useQuery({
        queryKey: [TANSTACK_KEY.BANK_ONE, id],
        queryFn: () => bankQueryApi.getBankById(id),
        enabled: !!id
    })

    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateBankRequestType }) => bankCommandApi.updateBank(id, body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateBankRequestType>({
        resolver: yupResolver(bankSchema),
        defaultValues: {
            id: 0,
            bankName: ''
        }
    })

    useEffect(() => {
        if (bank) {
            reset(bank)
        }
    }, [bank, reset])

    const onSubmit: SubmitHandler<UpdateBankRequestType> = (body) => {
        mutate(
            { id, body },
            {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.BANK_ALL] })
                    queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.BANK_ONE, id] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_BANK_UPDATE_BANK)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label={getLangKey(CONFIG_LANG_KEY.PAGE_BANK_TITLE_INPUT_BANK)}
                    placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_BANK_PLACEHOLDER_BANK)}
                    control={control}
                    name='bankName'
                    errors={errors}
                />
            </Form>
        </ModalCommon>
    )
}
