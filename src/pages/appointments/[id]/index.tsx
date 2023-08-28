import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react'
import {
  getAppointmentInfo,
  getUnavailableAppointment,
  updateAppointment,
  UpdateAppointmentDto,
} from '../../../api'
import { Section } from '../../../components/sections'
import { useApi } from '../../../hooks'
import { BackButton } from '../../../components/back'
import { Option, Select } from '../../../components/select'

import { FormContainer } from '../../../components/forms'
import { Flex, Text } from 'rebass'
import { Formik, FormikProps } from 'formik'

import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  addHours,
  startOfMonth,
} from 'date-fns'

import { Button } from 'components/button'

import { AmOrPm, Appointment, Status } from '../../../entities'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { TextField } from '@mui/material'
import { Loading } from 'components/loading'
import { theme as colorTheme } from '../../../utils/theme'

const DateAndTime = ({
  date,
  onChange,
  isEdit,
  children,
}: {
  date: Date
  onChange: (date: Date) => void
  isEdit: boolean
  children: (
    v: {
      label: string
      value: string
    }[]
  ) => ReactNode
}) => {
  const { isFetching, data, refetch } = useApi(
    async () =>
      await getUnavailableAppointment({
        month: date.getMonth(),
        year: date.getFullYear(),
      })
  )

  useEffect(() => {
    refetch()
  }, [date])

  const availableDates = useMemo(() => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)

    const parsedDate = data?.map((v: any) => v.date) ?? []

    const dates: string[][] = []

    while (start < end) {
      const startDay = addHours(startOfDay(start), 9)
      const endDay = addHours(startDay, 12)
      const time: string[] = []
      while (startDay < endDay) {
        const timeFormat = format(startDay, 'yyyy-MM-dd HH')
        if (!parsedDate.includes(timeFormat)) {
          time.push(format(startDay, "hh:mm aaaaa'm'"))
        }
        startDay.setHours(startDay.getHours() + 1)
      }
      dates.push(time)
      start.setDate(start.getDate() + 1)
    }

    return dates
  }, [data, date])

  const currentDateTime = availableDates[date.getDate() - 1]

  const timeLabelAndValue = currentDateTime.map((v, i) => ({
    label: v,
    value: v.split(':')[0],
  }))

  return (
    <>
      <Flex sx={{ gap: 2, alignItems: 'center', mt: 3 }}>
        <Text as={'h4'}>Date: </Text>
        <SelectDateAndTime
          label="Date"
          value={date}
          onChange={onChange}
          isDisabled={!isEdit}
          isDate={true}
        />
      </Flex>
      {!isFetching && !!data && children(timeLabelAndValue)}
    </>
  )
}

export default function AppointmentInformation({ id }: { id: string }) {
  const ref = useRef<FormikProps<UpdateAppointmentDto>>(null)
  const { data, refetch, isFetching } = useApi(
    async () => await getAppointmentInfo(id)
  )
  const [edit, setEdit] = useState<boolean>(false)
  const appointment: Appointment = data

  useEffect(() => {
    ref.current?.setValues({
      serviceId: appointment?.service?.id,
      status: appointment?.status,
      time: !!appointment?.startDate
        ? new Date(new Date(appointment?.startDate)).getHours()
        : 0,
      date: !!appointment?.date
        ? new Date(new Date(appointment?.date)).getTime()
        : undefined,
    })
  }, [edit, appointment])

  const changeValue = useCallback(
    (values: Partial<UpdateAppointmentDto>) => {
      return ref.current?.setValues({ ...ref.current.values, ...values })
    },
    [ref]
  )

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title={
          (<BackButton>Appointment Information</BackButton>) as JSX.Element &
            string
        }
        textProps={{ textAlign: 'start' }}
        contentProps={{
          alignItems: 'start',
          sx: { gap: [20, 40] },
          flexDirection: ['column'],
        }}
        isFetching={isFetching}
      >
        <Flex sx={{ gap: 2 }}>
          <Button
            backgroundcolor={edit ? 'red' : undefined}
            textcolor={edit ? 'white' : undefined}
            hovercolor={edit ? '#B22222' : undefined}
            activecolor={edit ? '#FF2400' : undefined}
            hovertextcolor={edit ? 'white' : undefined}
            activetextcolor={edit ? 'white' : undefined}
            onClick={() => setEdit((v) => !v)}
          >
            {!edit ? 'Edit' : 'Cancel'}
          </Button>
          {edit && (
            <Button
              onClick={() => ref.current?.submitForm()}
              disabled={ref.current?.isSubmitting}
            >
              Save
            </Button>
          )}
        </Flex>
        {!!appointment && (
          <Formik<UpdateAppointmentDto>
            innerRef={ref}
            initialValues={{
              serviceId: appointment?.service?.id,
              status: appointment?.status,
              time: !!appointment?.startDate
                ? new Date(new Date(appointment?.startDate)).getHours()
                : 0,
              date: !!appointment?.date
                ? new Date(new Date(appointment?.date)).getTime()
                : undefined,
            }}
            onSubmit={(values, { setSubmitting }) => {
              let copy: UpdateAppointmentDto<string> = structuredClone({
                ...values,
                time: !!values.time
                  ? values.time >= 12
                    ? AmOrPm.PM
                    : AmOrPm.AM
                  : '',
              })
              if (!!copy.date && !!values.time) {
                const newDate = new Date(copy.date)
                newDate.setHours(values.time)
                copy.date = newDate.getTime()
              }

              updateAppointment(id, copy)
                .then(() => refetch())
                .finally(() => {
                  setSubmitting(false)
                  setEdit(false)
                })
            }}
          >
            {({ isSubmitting, values, errors }) => (
              <FormContainer
                flexProps={{
                  sx: {
                    flexDirection: ['column', 'row'],
                    gap: 4,
                    alignItems: 'start',
                  },
                }}
              >
                {isSubmitting && <Loading />}
                <Flex flexDirection={'column'} flex={1} sx={{ gap: 2 }}>
                  <Text as={'h2'}>Reference ID: {appointment?.refId}</Text>
                  <Text as={'h2'}>Name: {appointment?.name}</Text>
                  <Text sx={{ color: 'gray', mb: 10 }}>
                    Email: {appointment?.email}
                  </Text>
                  <Text as={'h3'}>Service: {appointment?.service?.name}</Text>

                  <Flex
                    sx={{
                      alignItems: 'left',
                      gap: 10,
                      flexDirection: 'column',
                      width: 'auto',
                    }}
                  >
                    {!!values.date && (
                      <DateAndTime
                        date={new Date(values.date)}
                        onChange={(d) => {
                          changeValue({
                            date: new Date(d).getTime(),
                          })
                        }}
                        isEdit={edit}
                      >
                        {(timeLabelAndValue) => (
                          <>
                            <Flex sx={{ gap: 2, alignItems: 'center' }}>
                              <Text as={'h4'}>Time: </Text>
                              <Select
                                isDisabled={!edit}
                                className="basic-single"
                                classNamePrefix="select"
                                isSearchable={true}
                                name="time"
                                options={timeLabelAndValue}
                                value={timeLabelAndValue.find(
                                  (v) => Number(v.value) === values?.time
                                )}
                                controlStyle={{
                                  padding: 8,
                                  borderColor: 'black',
                                  backgroundColor: 'white',
                                }}
                                onChange={(v) =>
                                  changeValue({
                                    time: Number((v as any).value),
                                  })
                                }
                                theme={(theme) => ({
                                  ...theme,
                                  colors: {
                                    ...theme.colors,
                                    primary25: colorTheme.colors.lightpink,
                                    primary: colorTheme.colors.darkpink,
                                  },
                                })}
                                placeholder="Select Time"
                              />
                            </Flex>
                          </>
                        )}
                      </DateAndTime>
                    )}
                  </Flex>
                  <Text as={'h2'} mt={3}>
                    Pet Information
                  </Text>
                  <Text as={'h3'}>Pet Name: {appointment?.petName}</Text>
                  <Text as={'h3'}>Age: {appointment?.age}</Text>
                  <Text as={'h3'}>Birthday: {appointment?.birthDate}</Text>
                  <Text as={'h3'}>Gender: {appointment?.gender}</Text>

                  <Text mt={3}>
                    <span style={{ fontWeight: 'bold' }}>Created</span>:{' '}
                    {format(
                      new Date(appointment?.created ?? 0),
                      'EEEE, LLLL do yyyy  hh:mm a'
                    )}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: 'bold' }}>Modified</span>:{' '}
                    {format(
                      new Date(appointment?.modified ?? 0),
                      'EEEE, LLLL do yyyy  hh:mm a'
                    )}
                  </Text>
                  <Text>
                    <span style={{ fontWeight: 'bold' }}>Message</span>:{' '}
                    {appointment?.message}
                  </Text>
                  <Flex
                    flexDirection={'row'}
                    sx={{ alignItems: 'center', gap: 2 }}
                  >
                    <Text as={'h3'}>Status: </Text>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isSearchable={true}
                      name="color"
                      options={
                        !!appointment?.status
                          ? [
                              { label: 'Pending', value: Status.pending },
                              { label: 'Accepted', value: Status.accepted },
                              { label: 'Completed', value: Status.completed },
                              { label: 'Cancelled', value: Status.cancelled },
                            ]
                          : [{ label: 'Pending', value: Status.pending }]
                      }
                      value={[
                        { label: 'Pending', value: Status.pending },
                        { label: 'Accepted', value: Status.accepted },
                        { label: 'Completed', value: Status.completed },
                        { label: 'Cancelled', value: Status.cancelled },
                      ].find((d) => d.value === values?.status)}
                      onChange={(v) =>
                        changeValue({ status: (v as Option).value as Status })
                      }
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: colorTheme.colors.lightpink,
                          primary: colorTheme.colors.darkpink,
                        },
                      })}
                      isDisabled={!edit}
                    />
                  </Flex>
                </Flex>
              </FormContainer>
            )}
          </Formik>
        )}
      </Section>
    </Flex>
  )
}

function pad(d: number) {
  return d < 10 ? '0' + d.toString() : d.toString()
}

const SelectDateAndTime = ({
  value,
  label,
  onChange,
  minDate,
  error,
  isDisabled,
  date,
  isDate,
}: {
  date?: { start: Date; end: Date }[]
  value?: Date
  label: string
  onChange: (date: Date) => void
  minDate?: Date
  error?: string | undefined
  isDisabled: boolean
  isDate?: boolean
}) => {
  const getMaxTime = (date?: Date) => {
    if (!date) return new Date()
    const isAm = date.getHours() < 12 || date.getHours() < 12
    const d = new Date(date)
    d.setHours(isAm ? 12 : 23)
    d.setMinutes(isAm ? 0 : 59)
    return d
  }

  return (
    <Flex flexDirection={'column'} sx={{ gap: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Flex flex={1} sx={{ gap: 2 }}>
          {isDate ? (
            <DatePicker
              label={label}
              onChange={(newValue) => {
                if (!newValue) return
                const newDate = new Date(newValue as any)
                if (isNaN(newDate as unknown as number)) return
                if (value === undefined) return onChange?.(newDate)
                const nd = new Date(value)
                nd.setDate(newDate.getDate())
                nd.setFullYear(newDate.getFullYear())
                nd.setMonth(newDate.getMonth())
                return onChange?.(nd)
              }}
              value={!!value ? format(value, 'yyyy-MM-dd') : null}
              renderInput={(params) => <TextField {...params} />}
              minDate={dayjs(minDate)}
              disabled={isDisabled}
            />
          ) : (
            <TimePicker
              label="Time"
              value={value ?? minDate ?? null}
              onChange={(newValue) => {
                const d = new Date(newValue as any)
                if (isNaN(d as unknown as number)) return
                if (!!minDate) {
                  d.setDate(minDate?.getDate())
                  d.setMonth(minDate?.getMonth())
                  d.setFullYear(minDate?.getFullYear())
                  onChange(d)
                }
              }}
              ampm={true}
              ampmInClock={false}
              renderInput={(params) => <TextField {...params} />}
              minTime={dayjs(minDate)}
              maxTime={dayjs(getMaxTime(minDate))}
              shouldDisableTime={(v, c) => {
                const thisDate = value ?? minDate
                return (
                  !!date &&
                  !date?.find((d) => {
                    if (d.start.getDay() === thisDate?.getDay()) {
                      const date = new Date(
                        d.start.toDateString() +
                          ' ' +
                          (c === 'hours'
                            ? pad(v) + `:${pad(thisDate.getMinutes())}:00`
                            : c === 'minutes'
                            ? pad(thisDate.getHours()) + `:${pad(v)}:00`
                            : pad(thisDate.getHours()) +
                              `:${pad(thisDate.getMinutes())}:${pad(v)}`)
                      )

                      return d.start <= date && date <= d.end
                    }

                    return false
                  })
                )
              }}
              disabled={false || isDisabled || !minDate}
            />
          )}
        </Flex>
      </LocalizationProvider>
      <Text color="red"> {error}</Text>
    </Flex>
  )
}

export async function getServerSideProps(context: any) {
  const id: string = context.params.id || ''

  return {
    props: { id },
  }
}
