import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { Flex } from 'rebass'

import { Section } from '../../components/sections'

import { Response as ResponseDto } from 'dto'

import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi } from 'hooks'
import { useRouter } from 'next/router'

import { ConfirmationModal, ModalFlexProps } from 'components/modal'
import { FormikValidation } from 'helpers'
import { getAllService } from 'api/service.api'
import { deleteAppointment, getAppointment, newAppointment } from 'api'
import { AmOrPm, Services, Status } from 'entities'
import {
  Checkbox,
  MenuItem,
  OutlinedInput,
  Select,
  TableHead,
  TextField,
} from '@mui/material'
import { Option } from 'components/select'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { InputError } from 'components/input'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
  status: Status
  time: AmOrPm
}

const SelectHandler = ({
  title,
  children,
  onChange,
}: {
  title: string
  children: ReactNode
  onChange: (v: string) => void
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
        background: 'rgba(0, 0, 0, 0.06)',
        div: {
          borderColor: 'transparent',
        },
        fieldset: {
          border: 0,
          borderColor: 'transparent',
          borderBottom: 1,
        },
      }}
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

const DatePick: React.FC<{ onChange: (v: string) => void; error?: string }> = ({
  onChange,
  error,
}) => {
  const [date, setDate] = useState<Date | null>(null)

  return (
    <Flex flexDirection={'column'} sx={{ gap: 1 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={'Select Date'}
          value={date}
          onChange={(newValue) => {
            if (!newValue) return
            const newDate = new Date(newValue as any)
            setDate(() => newDate)
            return onChange(newDate.toISOString())
          }}
          renderInput={(params) => <TextField {...params} />}
          minDate={dayjs(new Date())}
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
    time: '',
    date: '',
    name: '',
    email: '',
  },
  fields: [
    {
      field: 'serviceId',
      custom: {
        Jsx: ServicesComp,
      },
    },
    {
      field: 'time',
      custom: {
        Jsx: Time,
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
      field: 'message',
      label: 'Message',
      placeHolder: 'Please type message',
    },
  ],
  onSubmit: async (values, { setSubmitting }) => {
    setSubmitting(true)
    try {
      await newAppointment(values)
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
      <Section title="Appointments" textProps={{ textAlign: 'start' }}>
        <CustomTable
          isFetching={isFetching}
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
