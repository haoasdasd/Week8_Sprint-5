import Input from '~/app/components/input-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation } from '@tanstack/react-query'
import { CreateContractTypeRequestType } from '~/app/types/contract-type/request/contract-type.type'
import { contractTypeCommandApi } from '~/app/apis/contract-type/command/contract-type.command.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { contractTypeSchema } from '~/app/schemas/contract-type.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { queryClient } from '~/app/query-client'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import ModalCommon from '~/app/components/modal-common-component'
import { useRef } from 'react'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalCreateContractTypeProps {
    modal: boolean
    toggle: () => void
}

export default function ModalCreateContractType({ modal, toggle }: ModalCreateContractTypeProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()
    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: (body: CreateContractTypeRequestType) => contractTypeCommandApi.createContractType(body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateContractTypeRequestType>({
        resolver: yupResolver(contractTypeSchema),
        defaultValues: {
            contractTypeCode: '',
            contractTypeName: ''
        }
    })

    const onSubmit: SubmitHandler<CreateContractTypeRequestType> = (data) => {
        mutate(data, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.CONTRACT_TYPE_ALL] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_ADD_CT)}
            titleFooter={getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_CREATE_CT)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
                <Input
                    label={getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_TITLE_INPUT_CT_CODE)}
                    placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_PLACEHOLDER_CT_CODE)}
                    control={control}
                    name='contractTypeCode'
                    errors={errors}
                />
                <Input
                    label={getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_TITLE_INPUT_CT)}
                    placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_PLACEHOLDER_CT)}
                    control={control}
                    name='contractTypeName'
                    errors={errors}
                />
            </Form>
        </ModalCommon>
    )
}
