import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Image } from 'rebass'

import { Section } from '../../components/sections'

import { Response as ResponseDto } from 'dto'

import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi } from 'hooks'
import { useRouter } from 'next/router'

import { ConfirmationModal, ModalFlexProps } from 'components/modal'
import { FormikValidation } from 'helpers'
import {
  addService,
  deleteService,
  getAllService,
  searchService,
} from 'api/service.api'
import { getAppointment } from 'api'
import { AmOrPm, Status } from 'entities'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
  status: Status
  time: AmOrPm
}

const modalInitial: ModalFlexProps = {
  isError: true,
  validationSchema: FormikValidation.createService,
  modalText: 'Add new appointment',
  availableText: 'This user is available',
  initial: {
    name: '',
    description: '',
  },
  fields: [
    {
      field: 'name',
      label: 'Name',
      placeHolder: 'Please type name',
      important: {
        onSearch: async (val) => {
          await searchService(val)
        },
      },
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
    {
      field: 'description',
      label: 'Description',
      placeHolder: 'Please type description',
    },
    {
      field: 'description',
      label: 'Description',
      placeHolder: 'Please type description',
    },
  ],
  onSubmit: async (values, { setSubmitting }) => {
    setSubmitting(true)

    try {
      await addService(values)
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
    async () => await getAppointment(pageParams, limitParams, status, time)
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
          isCheckboxEnabled={true}
          dataCols={[
            { field: 'id', name: 'ID' },
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
        >
          {(selected, setSelected) => (
            <ConfirmationModal
              modalText="Assign Admin"
              selected={selected}
              setSelected={setSelected}
              refetch={refetch}
              modalCreate={modalInitial}
              onRemove={async () => {
                await deleteService({ ids: selected })
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
  let status: Status = context.query.status ?? Status.pending
  let time: AmOrPm = context.query.time ?? null

  return {
    props: { limitParams, pageParams, searchParams, status, time },
  }
}
