import React, { useEffect, useState } from 'react'
import { Flex, Text } from 'rebass'

import { Section } from 'components/sections'

import { Response as ResponseDto } from 'dto'

import { CustomTable } from 'components/table'
import { GetServerSideProps } from 'next'
import { useApi } from 'hooks'
import { useRouter } from 'next/router'

import { getAllTransaction } from 'api'
import { format } from 'date-fns'
import { BackButton } from 'components/back'

type Props = {
  title: string
  isBooking: boolean
  id: string
}

type Transactiontype = {
  refId: string

  userId: string

  created: string
}

function TransactionsComponent({ title, isBooking, id }: Props) {
  const [{ page, limit, search }, setParams] = useState({
    limit: 20,
    page: 0,
    search: '',
  })
  const {
    data: dat,
    isFetching,
    refetch,
  } = useApi(
    async () =>
      await getAllTransaction(page, limit, {
        id: id,
        isBooking: !!isBooking ? 1 : 0,
        search,
      })
  )
  const { push } = useRouter()
  const data: ResponseDto = dat ?? { data: [] as Transactiontype[], total: 0 }

  useEffect(() => {
    refetch()
  }, [refetch, page, limit, search])

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title={title}
        textProps={{ textAlign: 'start' }}
        contentProps={{ width: '100%' }}
        isFetching={isFetching}
        padding={0}
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
          page={page}
          pageSize={limit}
          total={data?.total ?? 0}
          rowIdentifierField={'refId'}
          handleChangePage={(_, p) => {
            setParams((query) => ({
              ...query,
              page: p,
            }))
          }}
          onSearch={(v) => {
            setParams((query) => ({
              ...query,
              page: 0,
              search: v,
            }))
          }}
          handleChangeRowsPerPage={(e) =>
            setParams((v) => ({
              ...v,
              page: 0,
              limit: parseInt(e.target.value),
            }))
          }
        />
      </Section>
    </Flex>
  )
}

export default function UserInformation({
  id,
  name,
  email,
}: {
  id: string
  name: string
  email: string
}) {
  return (
    <Section
      title={
        (<BackButton>User Information</BackButton>) as JSX.Element & string
      }
      textProps={{ textAlign: 'start' }}
      contentProps={{
        alignItems: 'start',
        sx: { gap: [20, 40] },
        width: '100%',
      }}
      width={'100%'}
    >
      <Flex flexDirection={'column'} sx={{ gap: 2 }} width={'100%'}>
        <hr color="black" style={{ backgroundColor: 'black', width: '100%' }} />
        <Text as={'h3'}>Id: {id}</Text>
        <Text as={'h4'}>Name: {name}</Text>
        <Text as={'h4'}>Email: {email}</Text>
      </Flex>

      <TransactionsComponent
        key={0}
        title="Transactions"
        isBooking={false}
        id={id}
      />
      <TransactionsComponent
        key={1}
        title="Appointments"
        isBooking={true}
        id={id}
      />
    </Section>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const id: string = context.params.id || ''
  const name: string = context.query.name || ''
  const email: string = context.query.email || ''

  return {
    props: { id, name, email },
    redirect: !(!!id && !!name && !!email)
      ? { destination: '/users' }
      : undefined,
  }
}
