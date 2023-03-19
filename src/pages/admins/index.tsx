import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Image } from 'rebass'

import { Section } from '../../components/sections'

import { Response as ResponseDto } from 'dto'

import { deleteRole, getAllUser, getUser, updateRole, updateUser } from 'api'
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

const modalInitial: ModalFlexProps = {
  validationSchema: FormikValidation.createUser,
  modalText: 'Add new admin',
  availableText: 'This user is already added',
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
          await getUser(undefined, val, Roles.ADMIN)
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
  isError: true,
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
      await getAllUser(
        pageParams,
        limitParams,
        !!searchParams
          ? checkId(searchParams)
            ? {
                role: Roles.ADMIN,
                id: searchParams,
              }
            : { role: Roles.ADMIN, search: searchParams }
          : { role: Roles.ADMIN }
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
        title="Admin Users"
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
            <ConfirmationModal<{
              id: string
              name: string
              password: string
              old: string
            }>
              modalText="Assign Admin"
              selected={selected}
              setSelected={setSelected}
              refetch={refetch}
              modalCreate={modalInitial}
              onRemove={async () => {
                await deleteRole({ ids: selected }, Roles.ADMIN)
              }}
              modalEdit={{
                onSubmit: async (v, { setSubmitting }) => {
                  setSubmitting(true)
                  try {
                    await updateUser(v)
                    alert('Success')
                  } catch (v: any) {
                    alert(v?.response?.data?.message || 'Error')
                  } finally {
                    setSubmitting(false)
                  }
                },
                data: data?.data
                  .filter((v) => selected.includes(v.id))
                  .map((v) => {
                    return {
                      title: v.id,
                      initial: {
                        id: v.id,
                        name: v.name,
                        password: '',
                        old: '',
                      },
                      data: [
                        {
                          type: 'text',
                          field: 'name',
                          disabled: false,
                          label: 'Name',
                          placeHolder: 'Type name',
                        },
                        {
                          type: 'password',
                          field: 'old',
                          disabled: false,
                          label: 'Old Password',
                          placeHolder: 'Type old password',
                        },
                        {
                          type: 'password',
                          field: 'password',
                          disabled: false,
                          label: 'New Password',
                          placeHolder: 'Type new password',
                        },
                      ],
                    }
                  }),
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
