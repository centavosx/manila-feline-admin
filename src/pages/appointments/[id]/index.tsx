import React, { useState, useRef, useEffect } from 'react'
import { getAppointmentInfo, getUser, UpdateAppointmentDto } from '../../../api'
import { Section } from '../../../components/sections'
import { useApi } from '../../../hooks'
import { BackButton } from '../../../components/back'
import { Option, Select } from '../../../components/select'
import { FormInput, Input } from '../../../components/input'
import { FormContainer } from '../../../components/forms'
import { Flex, Text } from 'rebass'
import { Formik, FormikProps } from 'formik'

import { FormikValidation } from '../../../helpers'

import { format } from 'date-fns'
import {
  Availability,
  SelectTime,
} from '../../../components/doctor/availability'
import { Services } from '../../../components/doctor/service'
import { AmOrPm, Appointment, Status, User } from '../../../entities'
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { TextField } from '@mui/material'

export default function AppointmentInformation({ id }: { id: string }) {
  const ref = useRef<FormikProps<UpdateAppointmentDto>>(null)
  const { data, refetch } = useApi(async () => await getAppointmentInfo(id))
  const [edit, setEdit] = useState<boolean>(false)
  const appointment: Appointment = data

  useEffect(() => {
    ref.current?.setValues({
      doctorId: appointment?.doctor?.id,
      serviceId: appointment?.service?.id,
      status: appointment?.status,
      startDate: !!appointment?.startDate
        ? appointment.startDate.getTime()
        : undefined,
      endDate: !!appointment?.endDate
        ? appointment?.endDate.getTime()
        : undefined,
    })
  }, [edit, appointment])

  useEffect(() => {
    ref.current?.setValues({
      doctorId: appointment?.doctor?.id,
      serviceId: appointment?.service?.id,
      status: appointment?.status,
      startDate: !!appointment?.startDate
        ? appointment.startDate.getTime()
        : undefined,
      endDate: !!appointment?.endDate
        ? appointment?.endDate.getTime()
        : undefined,
    })
  }, [data, appointment])

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
          flexDirection: ['column', 'row'],
        }}
      >
        <Formik<UpdateAppointmentDto>
          innerRef={ref}
          initialValues={{
            doctorId: appointment?.doctor?.id,
            serviceId: appointment?.service?.id,
            status: appointment?.status,
            startDate: !!appointment?.startDate
              ? appointment.startDate.getTime()
              : undefined,
            endDate: !!appointment?.endDate
              ? appointment?.endDate.getTime()
              : undefined,
          }}
          validationSchema={FormikValidation.updateAppointment}
          onSubmit={() => {}}
        >
          {({ values, errors, setFieldValue }) => (
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
                    ].find((d) => d.value === appointment?.status)}
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
                          appointment?.doctor.hasAm
                        )
                          return [
                            ...prev,
                            { label: 'Morning', value: AmOrPm.AM },
                          ]
                        if (
                          curr.label === 'Afternoon' &&
                          appointment?.doctor.hasPm
                        )
                          return [
                            ...prev,
                            { label: 'Afternoon', value: AmOrPm.PM },
                          ]
                        return prev
                      }, [])}
                      value={
                        appointment?.time === AmOrPm.AM
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
                    <Text as={'h4'}>Start Date: </Text>
                    <SelectDateAndTime
                      label={'Start Date'}
                      value={
                        !!values.startDate
                          ? new Date(values.startDate)
                          : undefined
                      }
                      onChange={(date) =>
                        setFieldValue('startDate', date.getTime())
                      }
                      isDisabled={!edit}
                      error={errors.startDate}
                    />
                  </Flex>
                  <Flex sx={{ gap: 2, alignItems: 'center' }}>
                    <Text as={'h4'}>End Date: </Text>
                    <SelectDateAndTime
                      label="End Date"
                      value={
                        !!values.endDate ? new Date(values.endDate) : undefined
                      }
                      onChange={(date) =>
                        setFieldValue('endDate', date.getTime())
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
                </Flex>
              </Flex>
              <Flex flex={1} flexDirection={'column'} sx={{ gap: 4 }}>
                <Flex
                  flexDirection={'row'}
                  sx={{ alignItems: 'center', gap: 2 }}
                >
                  <Text as={'h3'}>Service: </Text>
                  <Select
                    isSearchable={true}
                    name="color"
                    options={appointment?.doctor?.services?.map((serv) => ({
                      label: serv.name,
                      value: serv.id,
                    }))}
                    value={
                      !!values.serviceId
                        ? ({
                            label: appointment?.doctor?.services?.find(
                              (serv) => serv.id === values.serviceId
                            )?.name,
                            value: values?.serviceId,
                          } as Option)
                        : undefined
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
                  flexDirection={'row'}
                  sx={{ alignItems: 'center', gap: 2 }}
                >
                  <Text as={'h3'}>Doctor: </Text>
                  <Select
                    isSearchable={true}
                    onInputChange={(v) => console.log(v)}
                    name="color"
                    options={appointment?.doctor?.services?.map((serv) => ({
                      label: serv.name,
                      value: serv.id,
                    }))}
                    value={
                      !!values.serviceId
                        ? ({
                            label: appointment?.doctor?.services?.find(
                              (serv) => serv.id === values.serviceId
                            )?.name,
                            value: values?.serviceId,
                          } as Option)
                        : undefined
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
              </Flex>
            </FormContainer>
          )}
        </Formik>
      </Section>
    </Flex>
  )
}

const SelectDateAndTime = ({
  value,
  label,
  onChange,
  minDate,
  error,
  isDisabled,
}: {
  value?: Date
  label: string
  onChange: (date: Date) => void
  minDate?: Date
  error: string | undefined
  isDisabled: boolean
}) => {
  const today = new Date()
  today.setDate(today.getDate() + 1)
  return (
    <Flex flexDirection={'column'} sx={{ gap: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Flex flex={1} sx={{ gap: 2 }}>
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
            minDate={dayjs(minDate ?? today)}
            disabled={isDisabled}
          />
          <TimePicker
            label="Time"
            value={value ?? null}
            onChange={(newValue) => {
              onChange(new Date(newValue as any))
            }}
            renderInput={(params) => <TextField {...params} />}
            minTime={
              value?.getDate() === minDate?.getDate()
                ? dayjs(minDate ?? today)
                : undefined
            }
            disabled={isDisabled || !value}
          />
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
