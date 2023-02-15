import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  getAllUser,
  getAppointmentInfo,
  updateAppointment,
  UpdateAppointmentDto,
} from '../../../api'
import { Section } from '../../../components/sections'
import { useApi } from '../../../hooks'
import { BackButton } from '../../../components/back'
import { Option, Select } from '../../../components/select'
import { SearchableInput } from '../../../components/input'
import { FormContainer } from '../../../components/forms'
import { Flex, Text } from 'rebass'
import { Formik, FormikProps } from 'formik'

import { FormikValidation } from '../../../helpers'

import { format } from 'date-fns'

import { Button } from 'components/button'

import { AmOrPm, Appointment, Roles, Status, User } from '../../../entities'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { TextField } from '@mui/material'

export default function AppointmentInformation({ id }: { id: string }) {
  const ref = useRef<FormikProps<UpdateAppointmentDto>>(null)
  const { data, refetch, isFetching } = useApi(
    async () => await getAppointmentInfo(id)
  )
  const [edit, setEdit] = useState<boolean>(false)
  const appointment: Appointment = data

  useEffect(() => {
    ref.current?.setValues({
      doctorId: appointment?.doctor?.id,
      serviceId: appointment?.service?.id,
      status: appointment?.status,
      time: appointment?.time,
      date: !!appointment?.date
        ? new Date(
            new Date(appointment?.date).toDateString() +
              ' ' +
              (appointment.time === AmOrPm.AM ? '12:00 AM' : '12:00 PM')
          ).getTime()
        : undefined,
      startDate: !!appointment?.startDate
        ? new Date(appointment.startDate).getTime()
        : undefined,
      endDate: !!appointment?.endDate
        ? new Date(appointment?.endDate).getTime()
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
        <Formik<UpdateAppointmentDto>
          innerRef={ref}
          initialValues={{
            doctorId: appointment?.doctor?.id,
            serviceId: appointment?.service?.id,
            status: appointment?.status,
            time: appointment?.time,
            date: !!appointment?.date
              ? new Date(
                  new Date(appointment?.date).toDateString() +
                    ' ' +
                    (appointment.time === AmOrPm.AM ? '12:00 AM' : '12:00 PM')
                ).getTime()
              : undefined,
            startDate: !!appointment?.startDate
              ? new Date(appointment.startDate).getTime()
              : undefined,
            endDate: !!appointment?.endDate
              ? new Date(appointment?.endDate).getTime()
              : undefined,
          }}
          validationSchema={FormikValidation.updateAppointment}
          onSubmit={(v, { setSubmitting }) => {
            setSubmitting(true)
            const newValues: UpdateAppointmentDto = {
              ...v,
              startDate: !!v.startDate ? new Date(v.startDate) : undefined,
              endDate: !!v.endDate ? new Date(v.endDate) : undefined,
              date: !!v.date ? new Date(v.date) : undefined,
            }
            updateAppointment(id, newValues)
              .then(() => refetch())
              .finally(() => {
                setSubmitting(false)
                setEdit(false)
              })
          }}
        >
          {({ values, errors }) => (
            <FormContainer
              flexProps={{
                sx: {
                  flexDirection: ['column', 'row'],
                  gap: 4,
                  alignItems: 'start',
                },
              }}
            >
              <Flex flexDirection={'column'} flex={1} sx={{ gap: 2 }}>
                <Text as={'h2'}>Reference ID: {appointment?.refId}</Text>
                <Text as={'h2'}>Name: {appointment?.name}</Text>
                <Text sx={{ color: 'gray', mb: 10 }}>
                  Email: {appointment?.email}
                </Text>
                <Text as={'h3'}>Service: {appointment?.service?.name}</Text>
                <Text>
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
                  sx={{ alignItems: 'center', gap: 2, mt: 4 }}
                >
                  <Text as={'h3'}>Status: </Text>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isSearchable={true}
                    name="color"
                    options={[
                      { label: 'Pending', value: Status.pending },
                      { label: 'Accepted', value: Status.accepted },
                      { label: 'Completed', value: Status.completed },
                      { label: 'Cancelled', value: Status.cancelled },
                    ]}
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

                        primary25: '#f7efe3',
                        primary: '#3f352c',
                      },
                    })}
                    isDisabled={!edit}
                  />
                </Flex>

                <Flex
                  sx={{
                    alignItems: 'left',
                    gap: 10,
                    flexDirection: 'column',
                    width: 'auto',
                    mt: 4,
                  }}
                >
                  <Text as={'h3'} mb={2}>
                    Appointment time{' '}
                  </Text>
                  <Flex sx={{ gap: 2, alignItems: 'center' }}>
                    <Text as={'h4'}>Time: </Text>
                    <Select
                      isSearchable={true}
                      name="color"
                      options={[
                        { label: 'Morning', value: AmOrPm.AM },
                        { label: 'Afternoon', value: AmOrPm.PM },
                      ].reduce((prev: Option[], curr: Option) => {
                        if (
                          curr.label === 'Morning' &&
                          appointment?.doctor?.hasAm
                        )
                          return [
                            ...prev,
                            { label: 'Morning', value: AmOrPm.AM },
                          ]
                        if (
                          curr.label === 'Afternoon' &&
                          appointment?.doctor?.hasPm
                        )
                          return [
                            ...prev,
                            { label: 'Afternoon', value: AmOrPm.PM },
                          ]
                        return prev
                      }, [])}
                      onChange={(v) => {
                        changeValue({
                          time: (v as Option).value as AmOrPm,
                          date: !!values.date
                            ? new Date(
                                new Date(values.date).toDateString() +
                                  ' ' +
                                  (((v as Option).value as AmOrPm) === AmOrPm.AM
                                    ? '12:00 AM'
                                    : '12:00 PM')
                              ).getTime()
                            : undefined,
                          startDate: undefined,
                          endDate: undefined,
                        })
                      }}
                      value={
                        values?.time === AmOrPm.AM
                          ? { label: 'Morning', value: AmOrPm.AM }
                          : { label: 'Afternoon', value: AmOrPm.PM }
                      }
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,

                          primary25: '#f7efe3',
                          primary: '#3f352c',
                        },
                      })}
                      isDisabled={!edit}
                    />
                  </Flex>
                  <Flex sx={{ gap: 2, alignItems: 'center', mt: 3 }}>
                    <Text as={'h4'}>Date: </Text>
                    <SelectDateAndTime
                      label="Date"
                      value={!!values.date ? new Date(values.date) : undefined}
                      onChange={(date) => {
                        changeValue({
                          date: new Date(
                            new Date(date).toDateString() +
                              ' ' +
                              (values.time === AmOrPm.AM
                                ? '12:00 AM'
                                : '12:00 PM')
                          ).getTime(),
                          startDate: undefined,
                          endDate: undefined,
                        })
                      }}
                      isDisabled={!edit}
                      isDate={true}
                    />
                  </Flex>
                  {values.status !== Status.pending && (
                    <>
                      <Flex sx={{ gap: 2, alignItems: 'center' }}>
                        <Text as={'h4'}>Start Time: </Text>
                        <SelectDateAndTime
                          label={'Start Date'}
                          date={appointment?.doctor?.availability?.map((d) => ({
                            start: new Date(d.startDate),
                            end: new Date(d.endDate),
                          }))}
                          value={
                            !!values.startDate
                              ? new Date(values.startDate)
                              : undefined
                          }
                          minDate={
                            !!values.date ? new Date(values.date) : undefined
                          }
                          error={errors.startDate}
                          onChange={(date) =>
                            changeValue({
                              startDate: date.getTime(),
                            })
                          }
                          isDisabled={!edit}
                        />
                      </Flex>
                      <Flex sx={{ gap: 2, alignItems: 'center' }}>
                        <Text as={'h4'}>End Time: </Text>
                        <SelectDateAndTime
                          label="End Date"
                          value={
                            !!values.endDate
                              ? new Date(values.endDate)
                              : undefined
                          }
                          date={appointment?.doctor?.availability?.map((d) => ({
                            start: new Date(d.startDate),
                            end: new Date(d.endDate),
                          }))}
                          onChange={(date) =>
                            changeValue({
                              endDate: date.getTime(),
                            })
                          }
                          minDate={
                            !!values.startDate
                              ? new Date(values.startDate)
                              : undefined
                          }
                          error={errors.endDate}
                          isDisabled={!edit}
                        />
                      </Flex>
                    </>
                  )}
                </Flex>
              </Flex>
              <Flex flex={1} flexDirection={'column'} sx={{ gap: 4 }}>
                <GetDoctors
                  serviceId={appointment?.service?.id}
                  doctorId={appointment?.doctor?.id}
                  name={appointment?.doctor?.name}
                  isEdit={edit}
                  onChangeDoctor={(v) => changeValue({ doctorId: v })}
                />
              </Flex>
            </FormContainer>
          )}
        </Formik>
      </Section>
    </Flex>
  )
}

const GetDoctors = ({
  serviceId,
  doctorId,
  name,
  isEdit,
  onChangeDoctor,
}: {
  serviceId: string
  doctorId: string
  name: string
  isEdit?: boolean
  onChangeDoctor: (id: string) => void
}) => {
  const [selectedData, setSelectedData] = useState<User>()
  const [data, setData] = useState<User[]>([])
  const [value, setValue] = useState('')
  const [page, setPage] = useState(0)

  const searchUser = useCallback(
    async (value?: string) => {
      if (!isEdit) return
      setPage(0)
      const response = await getAllUser(0, 20, {
        role: Roles.DOCTOR,
        search: value,
        serviceId,
      })
      setData(() => response.data.data)
    },
    [setData, setPage, serviceId, isEdit]
  )

  const reset = useCallback(() => {
    setSelectedData(() => undefined)
    setData(() => [])
    setValue(() => '')
    setPage(() => 0)
  }, [setData, setSelectedData, setValue, setPage])

  useEffect(() => {
    if (!isEdit) {
      reset()
    } else {
      searchUser()
    }
  }, [isEdit, reset, searchUser])

  const assignUser = useCallback(
    (user: User) => {
      onChangeDoctor(user.id)
      setSelectedData(() => user)
      setValue(() => '')
      setData(() => [])
    },
    [setSelectedData, setValue, setData, onChangeDoctor]
  )

  if (!serviceId) return <></>

  return (
    <Flex sx={{ gap: 2, flexDirection: 'column' }}>
      <Text as={'h3'}>Doctor</Text>
      {(!!doctorId || selectedData?.id) && (
        <>
          <Text>
            <span style={{ fontWeight: 'bold' }}>ID: </span>
            {selectedData?.id ?? doctorId}
          </Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Name: </span>
            {selectedData?.name ?? name}
          </Text>
        </>
      )}
      <Flex flexDirection={'column'} sx={{ gap: 2, mt: 2 }}>
        <Text as={'h3'}>Assign Doctor</Text>
        <SearchableInput
          onSearch={searchUser}
          label="Doctor Name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!isEdit}
        />
        <Flex flexDirection={'column'}>
          {data.map(
            (d, i) =>
              d.id !== (selectedData?.id ?? doctorId) && (
                <Flex
                  key={i}
                  flexDirection={'row'}
                  sx={{ gap: 2, alignItems: 'center' }}
                >
                  <Text flex={1}>{d.name}</Text>
                  <Text
                    as={'a'}
                    sx={{
                      textDecoration: 'underline',
                      color: 'blue',
                      cursor: 'pointer',
                    }}
                    onClick={() => assignUser(d)}
                  >
                    Assign
                  </Text>
                </Flex>
              )
          )}
        </Flex>
      </Flex>
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
                return !date?.find((d) => {
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
