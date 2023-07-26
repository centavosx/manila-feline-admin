import React, { memo, useCallback, useEffect, useState } from 'react'
import { Flex, Image, Text } from 'rebass'

import { Section } from '../../components/sections'

import { Response as ResponseDto } from 'dto'

import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi } from 'hooks'
import { useRouter } from 'next/router'

import { ConfirmationModal } from 'components/modal'
import { checkId } from 'helpers'
import { deleteService } from 'api/service.api'

import { getAllTransaction } from 'api'
import { format } from 'date-fns'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
}

type Transactiontype = {
  refId: string

  userId: string

  created: string
}

export default function Transactions({
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
      await getAllTransaction(
        pageParams,
        limitParams,
        !!searchParams
          ? checkId(searchParams)
            ? {
                id: searchParams,
              }
            : {
                search: searchParams,
              }
          : {}
      )
  )
  const { replace, query, pathname, push } = useRouter()
  const data: ResponseDto = dat ?? { data: [] as Transactiontype[], total: 0 }

  useEffect(() => {
    refetch()
  }, [query, refetch])

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title="Transactions"
        textProps={{ textAlign: 'start' }}
        isFetching={isFetching}
      >
        <CustomTable
          isCheckboxEnabled={false}
          dataCols={[
            {
              name: 'Transaction Id',
              field: 'refId',
            },
            {
              name: 'User',
              field: 'userId',
            },
            {
              name: 'Created',
              custom: (v) => {
                return (
                  <>
                    {format(new Date(v.created), `yyyy-MM-dd hh:mm aaaaa'm'`)}
                  </>
                )
              },
            },
          ]}
          onRowClick={(v) => push('/transactions/' + v.refId)}
          dataRow={(data.data ?? []) as Transactiontype[]}
          page={pageParams}
          pageSize={limitParams}
          total={data?.total ?? 0}
          rowIdentifierField={'refId'}
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
            <ConfirmationModal<{
              id: string
              name: string
              description: string
            }>
              modalText="Assign Admin"
              selected={selected}
              setSelected={setSelected}
              refetch={refetch}
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
