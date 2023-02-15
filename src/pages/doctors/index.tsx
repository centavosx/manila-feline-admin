import React, { useEffect } from 'react'
import { Flex } from 'rebass'

import { Section } from '../../components/sections'

import { Response as ResponseDto } from 'dto'

import { deleteRole, getAllUser, getUser, updateRole } from 'api'
import { FormikValidation } from 'helpers'
import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi } from 'hooks'
import { useRouter } from 'next/router'

import { Roles } from 'entities'
import {
  ModalFlexProps,
  ConfirmationModal,
} from 'components/modal/ConfirmModal'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
}

const modalInitial: ModalFlexProps = {
  validationSchema: FormikValidation.createDoctor,
  modalText: 'Add new doctor',
  availableText: 'This user is available',
  initial: {
    name: '',
    email: '',
    password: '',
    position: '',
    description: '',
    role: Roles.DOCTOR,
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
      field: 'position',
      label: 'Position',
      placeHolder: 'Please type position',
    },
    {
      field: 'description',
      label: 'Description',
      placeHolder: 'Please type description',
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
export default function Doctors({
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
      await getAllUser(pageParams, limitParams, {
        role: Roles.DOCTOR,
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
        title="Doctors"
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
            {
              field: 'position',
              name: 'Position',
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
          onSearch={(v) =>
            replace({
              pathname,
              query: {
                ...query,
                page: 0,
                search: v,
              },
            })
          }
          onRowClick={(v) =>
            push({ pathname: '/doctors/[id]', query: { id: v.id } })
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
                await deleteRole({ ids: selected }, Roles.DOCTOR)
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
