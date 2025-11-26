import Input from '~/app/components/input-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { trainingMajorQueryApi } from '~/app/apis/training-major/query/training-major.query.api'
import { UpdateTrainingMajorRequestType } from '~/app/types/training-major/request/training-major.type'
import { trainingMajorCommandApi } from '~/app/apis/training-major/command/training-major.command.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { trainingMajorSchema } from '~/app/schemas/training-major.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import { queryClient } from '~/app/query-client'
import ModalCommon from '~/app/components/modal-common-component'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalUpdateTrainingMajorProps {
    modal: boolean
    toggle: () => void
    id: number
}

export default function ModalUpdateTrainingMajor({ modal, toggle, id }: ModalUpdateTrainingMajorProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data: trainingMajor } = useQuery({
        queryKey: [TANSTACK_KEY.TRAINING_MAJOR_ONE, id],
        queryFn: () => trainingMajorQueryApi.getTrainingMajorById(id),
        enabled: !!id
    })

    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateTrainingMajorRequestType }) =>
            trainingMajorCommandApi.updateTrainingMajor(id, body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateTrainingMajorRequestType>({
        resolver: yupResolver(trainingMajorSchema),
        defaultValues: {
            id: 0,
            trainingMajorName: ''
        }
    })

    useEffect(() => {
        if (trainingMajor) {
            reset(trainingMajor)
        }
    }, [trainingMajor, reset])

    const onSubmit: SubmitHandler<UpdateTrainingMajorRequestType> = (body) => {
        mutate(
            { id, body },
            {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.TRAINING_MAJOR_ALL] })
                    queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.TRAINING_MAJOR_ONE, id] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_TRAINING_MAJOR_UPDATE_TM)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
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
