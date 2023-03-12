import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Image } from 'rebass'

import { Section } from '../../components/sections'

import { Response as ResponseDto } from 'dto'

import { deleteRole, getAllUser, getUser, updateRole } from 'api'
import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi } from 'hooks'
import { useRouter } from 'next/router'

import { Roles } from 'entities'
import { ConfirmationModal, ModalFlexProps } from 'components/modal'
import { checkId, FormikValidation } from 'helpers'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
}

export default function Users({
  limitParams,
  pageParams,
  searchParams,
}: PageProps) {
  const {
    data: dat,
    refetch,
    isFetching,
  } = useApi(
    async () =>
      await getAllUser(
        pageParams,
        limitParams,
        !!searchParams
          ? checkId(searchParams)
            ? {
                role: Roles.USER,
                id: searchParams,
              }
            : { role: Roles.USER, search: searchParams }
          : { role: Roles.USER }
      )
  )
  const { replace, query, pathname } = useRouter()
  const data: ResponseDto = dat ?? { data: [], total: 0 }

  useEffect(() => {
    refetch()
  }, [query, refetch])

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title="Users"
        textProps={{ textAlign: 'start' }}
        isFetching={isFetching}
      >
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
              selected={selected}
              setSelected={setSelected}
              refetch={refetch}
              onRemove={async () => {
                await deleteRole({ ids: selected }, Roles.USER)
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
