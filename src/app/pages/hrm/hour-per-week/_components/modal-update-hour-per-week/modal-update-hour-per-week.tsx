import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { hourPerWeekCommandApi } from '~/app/apis/hour-per-week/command/hour-per-week.command.api'
import { hourPerWeekQueryApi } from '~/app/apis/hour-per-week/query/hour-per-week.query.api'
import Input from '~/app/components/input-component'
import ModalCommon from '~/app/components/modal-common-component'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { useLang } from '~/app/hooks/use-lang'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { queryClient } from '~/app/query-client'
import { hourPerWeekSchema } from '~/app/schemas/hour-per-week.schema'
import { UpdateHourPerWeekRequestType } from '~/app/types/hour-per-week/request/hour-per-week.type'

interface ModalUpdateHourPerWeekProps {
    modal: boolean
    toggle: () => void
    id: number
}

export default function ModalUpdateHourPerWeek({ modal, toggle, id }: ModalUpdateHourPerWeekProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data: hourPerWeek } = useQuery({
        queryKey: [TANSTACK_KEY.HOUR_PER_WEEK_ONE, id],
        queryFn: () => hourPerWeekQueryApi.getHourPerWeekById(id),
        enabled: !!id
    })

    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateHourPerWeekRequestType }) =>
            hourPerWeekCommandApi.updateHourPerWeek(id, body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateHourPerWeekRequestType>({
        resolver: yupResolver(hourPerWeekSchema),
        defaultValues: {
            day: ''
        }
    })

    useEffect(() => {
        if (hourPerWeek) {
            reset(hourPerWeek)
        }
    }, [hourPerWeek, reset])

    const onSubmit: SubmitHandler<UpdateHourPerWeekRequestType> = (body) => {
        mutate(
            { id, body },
            {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.HOUR_PER_WEEK_ALL] })
                    queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.HOUR_PER_WEEK_ONE, id] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_WEEK_UPDATE_HPW)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_WEEK_TITLE_INPUT_HPW)}
                    placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_WEEK_PLACEHOLDER_HPW)}
                    control={control}
                    name='day'
                    errors={errors}
                />
            </Form>
        </ModalCommon>
    )
}
