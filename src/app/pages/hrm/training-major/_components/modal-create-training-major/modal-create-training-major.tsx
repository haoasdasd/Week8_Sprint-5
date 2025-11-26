import Input from '~/app/components/input-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { CreateTrainingMajorRequestType } from '~/app/types/training-major/request/training-major.type'
import { trainingMajorCommandApi } from '~/app/apis/training-major/command/training-major.command.api'
import { useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { trainingMajorSchema } from '~/app/schemas/training-major.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { queryClient } from '~/app/query-client'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import ModalCommon from '~/app/components/modal-common-component'
import { useRef } from 'react'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalCreateTrainingMajorProps {
    modal: boolean
    toggle: () => void
}

export default function ModalCreateTrainingMajor({ modal, toggle }: ModalCreateTrainingMajorProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()
    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: (body: CreateTrainingMajorRequestType) => trainingMajorCommandApi.createTrainingMajor(body)
    })

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateTrainingMajorRequestType>({
        resolver: yupResolver(trainingMajorSchema),
        defaultValues: {
            trainingMajorName: ''
        }
    })

    const onSubmit: SubmitHandler<CreateTrainingMajorRequestType> = (data) => {
        mutate(data, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.TRAINING_MAJOR_ALL] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_TRAINING_MAJOR_ADD_TM)}
            titleFooter={getLangKey(CONFIG_LANG_KEY.PAGE_TRAINING_MAJOR_CREATE_TM)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
                <Input
                    label={getLangKey(CONFIG_LANG_KEY.PAGE_TRAINING_MAJOR_TITLE_INPUT_TM)}
                    placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_TRAINING_MAJOR_PLACEHOLDER_TM)}
                    control={control}
                    name='trainingMajorName'
                    errors={errors}
                />
            </Form>
        </ModalCommon>
    )
}
