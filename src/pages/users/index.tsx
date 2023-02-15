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
import { FormikValidation } from 'helpers'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
}

const modalInitial: ModalFlexProps = {
  validationSchema: FormikValidation.createUser,
  modalText: 'Add new admin',
  availableText: 'This user is available',
  initial: {
    name: '',
    email: '',
    password: '',
    role: Roles.ADMIN,
  },
  fields: [
    {
      field: 'email',
      label: 'Email',
      placeHolder: 'Please type email',
      important: {
        onSearch: async (val) => {
          await getUser(undefined, val)
        },
      },
    },
    {
      field: 'name',
      label: 'Name',
      placeHolder: 'Please type name',
    },
    {
      type: 'password',
      field: 'password',
      label: 'Password',
      placeHolder: 'Please type password',
    },
  ],
  onSubmit: async (values, { setSubmitting }) => {
    setSubmitting(true)
    try {
      await updateRole(values)
    } finally {
      setSubmitting(false)
    }
  },
}

export default function AdminUsers({
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
      await getAllUser(pageParams, limitParams, {
        role: Roles.ADMIN,
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
      <Section title="Admin Users" textProps={{ textAlign: 'start' }}>
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
              modalText="Assign Admin"
              selected={selected}
              setSelected={setSelected}
              refetch={refetch}
              modalCreate={modalInitial}
              onRemove={async () => {
                await deleteRole({ ids: selected }, Roles.ADMIN)
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
