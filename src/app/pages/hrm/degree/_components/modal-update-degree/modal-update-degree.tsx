import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { degreeQueryApi } from '~/app/apis/degree/query/degree.query.api'
import { UpdateDegreeRequestType } from '~/app/types/degree/request/degree.type'
import { degreeCommandApi } from '~/app/apis/degree/command/degree.command.api'
import Input from '~/app/components/input-component'
import { yupResolver } from '@hookform/resolvers/yup'
import { degreeSchema } from '~/app/schemas/degree.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import { queryClient } from '~/app/query-client'
import ModalCommon from '~/app/components/modal-common-component'
import { Form } from 'reactstrap'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalUpdateDegreeProps {
    modal: boolean
    toggle: () => void
    id: number
}

export default function ModalUpdateDegree({ modal, toggle, id }: ModalUpdateDegreeProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data: degree } = useQuery({
        queryKey: [TANSTACK_KEY.DEGREE_ONE, id],
        queryFn: () => degreeQueryApi.getDegreeById(id),
        enabled: !!id
    })

    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateDegreeRequestType }) => degreeCommandApi.updateDegree(id, body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateDegreeRequestType>({
        resolver: yupResolver(degreeSchema),
        defaultValues: {
            id: 0,
            degreeName: ''
        }
    })

    useEffect(() => {
        if (degree) {
            reset(degree)
        }
    }, [degree, reset])

    const onSubmit: SubmitHandler<UpdateDegreeRequestType> = (body) => {
        mutate(
            { id, body },
            {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.DEGREE_ALL] })
                    queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.DEGREE_ONE, id] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_DEGREE_UPDATE_DEGREE)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
            <Form onSubmit={handleSubmit(onSubmit)} innerRef={formRef}>
                <Input
                    label={getLangKey(CONFIG_LANG_KEY.PAGE_DEGREE_TITLE_INPUT_DEGREE)}
                    placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_DEGREE_PLACEHOLDER_DEGREE)}
                    control={control}
                    name='degreeName'
                    errors={errors}
                />
            </Form>
        </ModalCommon>
    )
}
