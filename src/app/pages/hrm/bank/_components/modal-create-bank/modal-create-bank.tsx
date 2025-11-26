import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation } from '@tanstack/react-query'
import { CreateBankRequestType } from '~/app/types/bank/request/bank.type'
import { bankCommandApi } from '~/app/apis/bank/command/bank.command.api'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { bankSchema } from '~/app/schemas/bank.schema'
import { queryClient } from '~/app/query-client'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import Input from '~/app/components/input-component'
import ModalCommon from '~/app/components/modal-common-component'
import { useRef } from 'react'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalCreateBankProps {
    modal: boolean
    toggle: () => void
}

export default function ModalCreateBank({ modal, toggle }: ModalCreateBankProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()
    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: (body: CreateBankRequestType) => bankCommandApi.createBank(body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateBankRequestType>({
        resolver: yupResolver(bankSchema),
        defaultValues: {
            bankName: ''
        }
    })

    const onSubmit: SubmitHandler<CreateBankRequestType> = (data) => {
        mutate(data, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.BANK_ALL] })
                toggle()
                reset()
                messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_CREATE_SUCCESSFULLY))
            }
        })
    }

    const formRef = useRef<HTMLFormElement>(null)
    useKeydownForm(formRef)

    return (
        <ModalCommon
            modal={modal}
            onClose={() => toggle()}
            title={getLangKey(CONFIG_LANG_KEY.PAGE_BANK_ADD_BANK)}
            titleFooter={getLangKey(CONFIG_LANG_KEY.PAGE_BANK_CREATE_BANK)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
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
