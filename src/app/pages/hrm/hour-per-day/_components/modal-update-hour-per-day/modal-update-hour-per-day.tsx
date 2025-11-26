import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Col, Form, Row } from 'reactstrap'
import { hourPerDayCommandApi } from '~/app/apis/hour-per-day/command/hour-per-day.command.api'
import { hourPerDayQueryApi } from '~/app/apis/hour-per-day/query/hour-per-day.query.api'
import Input from '~/app/components/input-component'
import ModalCommon from '~/app/components/modal-common-component'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { useLang } from '~/app/hooks/use-lang'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { queryClient } from '~/app/query-client'
import { hourPerDaySchema } from '~/app/schemas/hour-per-day.schema'
import { UpdateHourPerDayRequestType } from '~/app/types/hour-per-day/request/hour-per-day.type'

interface ModalUpdateHourPerDayProps {
    modal: boolean
    toggle: () => void
    id: number
}

export default function ModalUpdateHourPerDay({ modal, toggle, id }: ModalUpdateHourPerDayProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data: hourPerDay } = useQuery({
        queryKey: [TANSTACK_KEY.HOUR_PER_DAY_ONE, id],
        queryFn: () => hourPerDayQueryApi.getHourPerDayById(id),
        enabled: !!id
    })

    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateHourPerDayRequestType }) =>
            hourPerDayCommandApi.updateHourPerDay(id, body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateHourPerDayRequestType>({
        resolver: yupResolver(hourPerDaySchema),
        defaultValues: {
            day: '',
            timeFrom: '',
            timeTo: ''
        }
    })

    useEffect(() => {
        if (hourPerDay) {
            reset(hourPerDay)
        }
    }, [hourPerDay, reset])

    const onSubmit: SubmitHandler<UpdateHourPerDayRequestType> = (body) => {
        mutate(
            { id, body },
            {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.HOUR_PER_DAY_ALL] })
                    queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.HOUR_PER_DAY_ONE, id] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_UPDATE_HPD)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col lg={12}>
                        <Input
                            label={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_TITLE_INPUT_HPD)}
                            placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_PLACEHOLDER_HPD)}
                            control={control}
                            name='day'
                            errors={errors}
                        />
                    </Col>
                    <Col lg={6}>
                        <Input
                            type='time'
                            label={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_TITLE_INPUT_FROM)}
                            placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_PLACEHOLDER_FROM)}
                            control={control}
                            name='timeFrom'
                            errors={errors}
                        />
                    </Col>
                    <Col lg={6}>
                        <Input
                            type='time'
                            label={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_TITLE_INPUT_TO)}
                            placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_DAY_PLACEHOLDER_TO)}
                            control={control}
                            name='timeTo'
                            errors={errors}
                        />
                    </Col>
                </Row>
            </Form>
        </ModalCommon>
    )
}
