import Input from '~/app/components/input-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { contractTypeQueryApi } from '~/app/apis/contract-type/query/contract-type.query.api'
import { UpdateContractTypeRequestType } from '~/app/types/contract-type/request/contract-type.type'
import { contractTypeCommandApi } from '~/app/apis/contract-type/command/contract-type.command.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { contractTypeSchema } from '~/app/schemas/contract-type.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import { queryClient } from '~/app/query-client'
import ModalCommon from '~/app/components/modal-common-component'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalUpdateContractTypeProps {
    modal: boolean
    toggle: () => void
    id: number
}

export default function ModalUpdateContractType({ modal, toggle, id }: ModalUpdateContractTypeProps) {
    const { getLangKey } = useLang()

    const { messageSuccess } = useToastMessageAsync()

    const { data: contractType } = useQuery({
        queryKey: [TANSTACK_KEY.CONTRACT_TYPE_ONE, id],
        queryFn: () => contractTypeQueryApi.getContractTypeById(id),
        enabled: !!id
    })

    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateContractTypeRequestType }) =>
            contractTypeCommandApi.updateContractType(id, body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateContractTypeRequestType>({
        resolver: yupResolver(contractTypeSchema),
        defaultValues: {
            id: 0,
            contractTypeCode: '',
            contractTypeName: ''
        }
    })

    useEffect(() => {
        if (contractType) {
            reset(contractType)
        }
    }, [contractType, reset])

    const onSubmit: SubmitHandler<UpdateContractTypeRequestType> = (body) => {
        mutate(
            { id, body },
            {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.CONTRACT_TYPE_ALL] })
                    queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.CONTRACT_TYPE_ONE, id] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_UPDATE_CT)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
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
