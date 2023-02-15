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

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
}

const modalInitial: ModalFlexProps = {
  isError: true,
  validationSchema: FormikValidation.createService,
  modalText: 'Add new service',
  availableText: 'This service is already available',
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

export default function Services({
  limitParams,
  pageParams,
  searchParams,
}: PageProps) {
  const {
    data: dat,
    isFetching,
    refetch,
  } = useApi(
    async () =>
      await getAllService(pageParams, limitParams, {
        search: !!searchParams ? searchParams : undefined,
      })
  )
  const { replace, query, pathname } = useRouter()
  const data: ResponseDto = dat ?? { data: [], total: 0 }

  useEffect(() => {
    refetch()
  }, [query, refetch])

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section title="Services" textProps={{ textAlign: 'start' }}>
        <CustomTable
          isCheckboxEnabled={true}
          isFetching={isFetching}
          dataCols={[
            { field: 'id', name: 'ID' },
            {
              field: 'name',
              name: 'Name',
            },
            {
              field: 'description',
              name: 'Description',
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

  return {
    props: { limitParams, pageParams, searchParams },
  }
}
