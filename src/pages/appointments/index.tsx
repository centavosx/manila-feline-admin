import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Flex, Text } from 'rebass'

import { Section } from '../../components/sections'

import { Response as ResponseDto } from 'dto'

import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi } from 'hooks'
import { useRouter } from 'next/router'

import { ConfirmationModal, ModalFlexProps } from 'components/modal'
import { FormikValidation } from 'helpers'
import { getAllService } from 'api/service.api'
import {
  deleteAppointment,
  getAppointment,
  getUnavailableAppointment,
  newAppointment,
} from 'api'
import { AmOrPm, Services, Status } from 'entities'
import { MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import { Option, Select as Select2 } from 'components/select'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { InputError } from 'components/input'
import { theme as colorTheme } from 'utils/theme'
import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  addHours,
} from 'date-fns'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
  status: Status
  time: AmOrPm
}

export const SelectHandler = ({
  value,
  title,
  children,
  onChange,
  color = 'transparent',
}: {
  title: string
  children: ReactNode
  onChange: (v: string) => void
  value?: string
  color?: string
}) => {
  return (
    <Select
      displayEmpty
      input={<OutlinedInput />}
      renderValue={(selected: Option | null) => {
        if (!selected) return title
        return selected.label
      }}
      sx={{
        background: color,
        div: {
          borderColor: 'transparent',
        },
        fieldset: {
          border: 0,
          borderColor: 'transparent',
          borderBottom: 1,
        },
      }}
      value={!!value ? { label: value, value } : undefined}
      onChange={(e) => {
        const v = e.target.value
        onChange(!!v ? (v as any).value : '')
      }}
    >
      {children}
    </Select>
  )
}

const ServicesComp: React.FC<{
  onChange: (v: string) => void
  error?: string
}> = ({ onChange, error }) => {
  const { data: dat } = useApi(async () => await getAllService(0, 20))
  const data: ResponseDto = dat ?? { data: [], total: 0 }
  const services: Services[] = data.data

  return (
    <Flex sx={{ gap: 1, flexDirection: 'column' }}>
      <SelectHandler onChange={onChange} title="Service">
        <MenuItem value={null as any}>Select...</MenuItem>
        {services.map((data) => (
          <MenuItem
            key={data.id}
            value={{ label: data.name, value: data.id } as any}
          >
            {data.name}
          </MenuItem>
        ))}
      </SelectHandler>
      <InputError error={error} />
    </Flex>
  )
}

const Time: React.FC<{ onChange: (v: string) => void; error?: string }> = ({
  onChange,
  error,
}) => {
  return (
    <Flex sx={{ gap: 1, flexDirection: 'column' }}>
      <SelectHandler onChange={onChange} title="Time">
        <MenuItem value={null as any}>Select...</MenuItem>
        {[AmOrPm.AM, AmOrPm.PM].map((data) => (
          <MenuItem key={data} value={{ label: data, value: data } as any}>
            {data}
          </MenuItem>
        ))}
      </SelectHandler>
      <InputError error={error} />
    </Flex>
  )
}

const SelectGender: React.FC<{
  onChange: (v: string) => void
  error?: string
}> = ({ onChange, error }) => {
  return (
    <Flex sx={{ gap: 1, flexDirection: 'column' }}>
      <SelectHandler onChange={onChange} title="Gender">
        <MenuItem value={null as any}>Select...</MenuItem>
        {['MALE', 'FEMALE'].map((data) => (
          <MenuItem key={data} value={{ label: data, value: data } as any}>
            {data}
          </MenuItem>
        ))}
      </SelectHandler>
      <InputError error={error} />
    </Flex>
  )
}

const DatePick: React.FC<{
  onChange?: (v: string) => void
  fields: any
  onMultipleChange?: (key: string, value: any) => void
  error?: string
  value?: string[]
  errors: any
}> = ({ onMultipleChange, errors, fields: values }) => {
  const [date, setDate] = useState<Date>(values.date)
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
      const endDay = addHours(startDay, 11)
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
      <Flex flexDirection={'column'} sx={{ gap: 1 }} mt={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={'Select Date'}
            value={date}
            onChange={(newValue) => {
              if (!newValue) return
              const newDate = new Date(newValue as any)

              if (isNaN(newDate as unknown as number)) return

              setDate(() => newDate)
              onMultipleChange?.('date', newDate.toISOString())

              return
            }}
            renderInput={(params) => <TextField {...params} />}
            minDate={dayjs(new Date())}
          />
        </LocalizationProvider>
        <InputError error={errors?.date} />
      </Flex>
      <Flex sx={{ gap: 2 }} flexDirection={'column'} width={'100%'}>
        <SelectHandler
          value={values.time as string}
          onChange={(v) => onMultipleChange?.('time', Number(v as any))}
          title="Time"
        >
          <MenuItem value={null as any}>Time</MenuItem>
          {timeLabelAndValue.map((data) => (
            <MenuItem
              key={data.label}
              value={{ label: data.label, value: data.value } as any}
            >
              {data.label}
            </MenuItem>
          ))}
        </SelectHandler>
        <InputError error={errors?.time} />
        {/* <Select
          options={timeLabelAndValue}
          value={timeLabelAndValue.find(
            (v) => Number(v.value) === values?.time
          )}
          controlStyle={{
            padding: 8,
            borderColor: 'black',
            backgroundColor: 'white',
          }}
          onChange={(v) => onMultipleChange?.('time', Number((v as any).value))}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: colorTheme.colors.lightpink,
              primary: colorTheme.colors.darkpink,
            },
          })}
          placeholder="Select Time"
        /> */}
      </Flex>
    </>
  )
}

const BirthDatePick: React.FC<{
  onChange: (v: string) => void
  error?: string
}> = ({ onChange, error }) => {
  const [date, setDate] = useState<Date | null>(null)
  return (
    <Flex flexDirection={'column'} sx={{ gap: 1 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={'Select BirthDate'}
          value={date}
          onChange={(newValue) => {
            if (!newValue) return
            const newDate = new Date(newValue as any)

            if (isNaN(newDate as unknown as number)) return

            setDate(() => newDate)
            onChange(newDate.toISOString())
            return
          }}
          renderInput={(params) => <TextField {...params} />}
          maxDate={dayjs(new Date())}
        />
      </LocalizationProvider>
      <InputError error={error} />
    </Flex>
  )
}

const modalInitial: ModalFlexProps = {
  isError: true,
  validationSchema: FormikValidation.createAppointment,
  modalText: 'Add new appointment',
  availableText: 'This user is available',
  initial: {
    serviceId: '',
    time: null,
    date: new Date(),
    name: '',
    email: '',
    petName: undefined,
    birthDate: null,
    gender: null,
  },
  fields: [
    {
      field: 'serviceId',
      custom: {
        Jsx: ServicesComp,
      },
    },

    {
      field: 'date',
      custom: {
        Jsx: DatePick,
      },
    },
    {
      field: 'name',
      label: 'Name',
      placeHolder: 'Please type name',
    },
    {
      field: 'email',
      type: 'email',
      label: 'Email',
      placeHolder: 'Please type email',
    },
    {
      field: 'petName',
      label: 'Pet Name',
      placeHolder: 'Please type your pet name',
    },

    {
      field: 'birthDate',
      custom: {
        Jsx: BirthDatePick,
      },
    },
    {
      field: 'gender',
      custom: {
        Jsx: SelectGender,
      },
    },
    {
      field: 'message',
      label: 'Message',
      placeHolder: 'Please type message',
    },
  ],
  onSubmit: async (values, { setSubmitting }) => {
    setSubmitting(true)
    let copy = structuredClone({
      ...values,
      time: !!values.time ? (values.time >= 12 ? AmOrPm.PM : AmOrPm.AM) : '',
    })
    if (!!copy.date && !!values.time) {
      const newDate = new Date(copy.date)
      newDate.setHours(values.time)
      copy.date = newDate.getTime()
    }
    try {
      await newAppointment(copy)
    } finally {
      setSubmitting(false)
    }
  },
}

export default function Appointments({
  limitParams,
  pageParams,
  searchParams,
  time,
  status,
}: PageProps) {
  const {
    data: dat,
    isFetching,
    refetch,
  } = useApi(
    async () =>
      await getAppointment(pageParams, limitParams, status, time, {
        search: !!searchParams ? searchParams : undefined,
      })
  )
  const { replace, query, pathname, push } = useRouter()
  const data: ResponseDto = dat ?? { data: [], total: 0 }

  useEffect(() => {
    refetch()
  }, [query, refetch])

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title="Appointments"
        textProps={{ textAlign: 'start' }}
        isFetching={isFetching}
      >
        <CustomTable
          isCheckboxEnabled={true}
          dataCols={[
            { field: 'refId', name: 'Reference ID' },
            {
              field: 'date',
              name: 'Date',
            },
            {
              field: 'name',
              name: 'Name',
            },
            {
              field: 'email',
              name: 'Email',
            },
            {
              field: 'service',
              sub: 'name',
              name: 'Service',
            },

            {
              field: 'time',
              name: 'Time',
              items: {
                itemValues: ['All', AmOrPm.AM, AmOrPm.PM],
                onChange: (v: string | AmOrPm) => {
                  const queries = { ...query }
                  if (v === 'All') {
                    delete queries.time
                  } else {
                    queries.time = v
                  }
                  replace({
                    pathname,
                    query: queries,
                  })
                },
              },
            },
            {
              field: 'status',
              name: 'Status',
              items: {
                itemValues: [
                  'All',
                  Status.pending,
                  Status.accepted,
                  Status.completed,
                  Status.cancelled,
                ],
                onChange: (v: string | Status) => {
                  const queries = { ...query }
                  if (v === 'All') {
                    delete queries.status
                  } else {
                    queries.status = v
                  }
                  replace({
                    pathname,
                    query: queries,
                  })
                },
              },
            },
          ]}
          dataRow={data?.data ?? []}
          page={pageParams}
          pageSize={limitParams}
          total={data?.total ?? 0}
          rowIdentifierField={'id'}
          handleChangePage={(_, p) => {
            replace({
              pathname,
              query: {
                ...query,
                page: p,
              },
            })
          }}
          handleChangeRowsPerPage={(e) =>
            replace({
              pathname,
              query: {
                ...query,
                page: 0,
                limit: parseInt(e.target.value),
              },
            })
          }
          onRowClick={(d) =>
            push({ pathname: 'appointments/[id]', query: { id: d.id } })
          }
          onSearch={(v) => {
            replace({
              pathname,
              query: {
                ...query,
                page: 0,
                search: v,
              },
            })
          }}
        >
          {(selected, setSelected) => (
            <ConfirmationModal
              modalText="Assign Admin"
              selected={selected}
              setSelected={setSelected}
              refetch={refetch}
              modalCreate={modalInitial}
              onRemove={async () => {
                await deleteAppointment(selected)
              }}
            />
          )}
        </CustomTable>
      </Section>
    </Flex>
  )
}
export async function getServerSideProps(context: any) {
  let limitParams: number = Number(context.query.limit) || 20
  let pageParams: number = Number(context.query.page) || 0
  let searchParams: string = context.query.search || ''
  let status: Status = context.query.status ?? null
  let time: AmOrPm = context.query.time ?? null

  return {
    props: { limitParams, pageParams, searchParams, status, time },
  }
}
