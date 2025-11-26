import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { hourPerWeekCommandApi } from '~/app/apis/hour-per-week/command/hour-per-week.command.api'
import Input from '~/app/components/input-component'
import ModalCommon from '~/app/components/modal-common-component'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { useLang } from '~/app/hooks/use-lang'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { queryClient } from '~/app/query-client'
import { hourPerWeekSchema } from '~/app/schemas/hour-per-week.schema'
import { CreateHourPerWeekRequestType } from '~/app/types/hour-per-week/request/hour-per-week.type'

interface ModalCreateHourPerWeekProps {
    modal: boolean
    toggle: () => void
}

export default function ModalCreateHourPerWeek({ modal, toggle }: ModalCreateHourPerWeekProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()
    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: (body: CreateHourPerWeekRequestType) => hourPerWeekCommandApi.createHourPerWeek(body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateHourPerWeekRequestType>({
        resolver: yupResolver(hourPerWeekSchema),
        defaultValues: {
            day: ''
        }
    })

    const onSubmit: SubmitHandler<CreateHourPerWeekRequestType> = (data) => {
        mutate(data, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.HOUR_PER_WEEK_ALL] })
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
            title={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_WEEK_ADD_HPW)}
            titleFooter={getLangKey(CONFIG_LANG_KEY.PAGE_HOUR_PER_WEEK_CREATE_HPW)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
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
