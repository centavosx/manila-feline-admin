import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Image } from 'rebass'

import { Section } from '../../components/sections'

import { Response as ResponseDto } from 'dto'

import {
  deleteMail,
  deleteRole,
  getAllContact,
  getAllUser,
  getUser,
  updateRole,
} from 'api'
import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi } from 'hooks'
import { useRouter } from 'next/router'

import { Roles } from 'entities'
import { ConfirmationModal, ModalFlexProps } from 'components/modal'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
}

export default function AdminUsers({
  limitParams,
  pageParams,
  searchParams,
}: PageProps) {
  const {
    data: dat,
    isFetching,
    refetch,
  } = useApi(async () => await getAllContact(pageParams, limitParams))
  const { replace, query, pathname } = useRouter()
  const data: ResponseDto = dat ?? { data: [], total: 0 }

  useEffect(() => {
    refetch()
  }, [query, refetch])

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section title="Contact Us" textProps={{ textAlign: 'start' }}>
        <CustomTable
          isCheckboxEnabled={true}
          dataCols={[
            { field: 'id', name: 'ID' },
            {
              field: 'subject',
              name: 'Subject',
            },
            {
              field: 'from',
              name: 'From',
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
        >
          {(selected, setSelected) => (
            <ConfirmationModal
              modalText="Assign Admin"
              selected={selected}
              setSelected={setSelected}
              refetch={refetch}
              onRemove={async () => {
                await deleteMail({ ids: selected })
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
