import Input from '~/app/components/input-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { CreateReligionRequestType } from '~/app/types/religion/request/religion.type'
import { religionCommandApi } from '~/app/apis/religion/command/religion.command.api'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { religionSchema } from '~/app/schemas/religion.schema'
import { queryClient } from '~/app/query-client'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import ModalCommon from '~/app/components/modal-common-component'
import { Form } from 'reactstrap'
import { useRef } from 'react'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalCreateReligionProps {
    modal: boolean
    toggle: () => void
}

export default function ModalCreateReligion({ modal, toggle }: ModalCreateReligionProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()
    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: (body: CreateReligionRequestType) => religionCommandApi.createReligion(body)
    })

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateReligionRequestType>({
        resolver: yupResolver(religionSchema),
        defaultValues: {
            religionName: ''
        }
    })

    const onSubmit: SubmitHandler<CreateReligionRequestType> = (data) => {
        mutate(data, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.RELIGION_ALL] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_RELIGION_ADD_RELIGION)}
            titleFooter={getLangKey(CONFIG_LANG_KEY.PAGE_RELIGION_CREATE_RELIGION)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
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
