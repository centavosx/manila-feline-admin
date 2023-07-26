import { useEffect, useMemo } from 'react'
import { BackButton } from 'components/back'
import { FormContainer } from 'components/forms'
import { FormInput } from 'components/input'
import { Section } from 'components/sections'
import { Formik } from 'formik'
import { Flex, Text } from 'rebass'
import { theme } from 'utils/theme'

import { useApi } from 'hooks'
import {
  getProduct,
  getProductReview,
  getTransaction,
  updateProduct,
} from 'api'
import { useRouter } from 'next/router'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { format } from 'date-fns'
import { Button } from 'components/button'
import { checkId, FormikValidation } from 'helpers'
import { Loading } from 'components/loading'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { User } from 'entities'

type ProductType = {
  id: string
  name: string

  shortDescription: string

  description: string

  category: string

  items: number

  rating: string

  images?: { pos: string; link: string }[]

  price: string
}

export default function TransactionInformation({ id }: { id: string }) {
  const { push } = useRouter()

  const { data, isFetching, error, refetch } = useApi(
    async () => await getTransaction(id)
  )

  const {
    product,
    refId: prodRefId,
    created: prodCreated,
    user: prodUser,
    total: prodTotal,
  } = useMemo(() => {
    if (!data) return { product: [] }
    let refId: string | undefined = undefined
    let user: User | undefined = undefined
    let created: string | undefined = undefined

    let total = 0

    const product = data.filter((v: any) => {
      refId = v.refId
      user = v.user
      created = v.created
      if (!!v.transaction)
        total += Number(v.transaction.price) * v.transaction.itemNumber

      return !!v.transaction
    })

    return { product, refId, user, created, total }
  }, [data])

  const {
    appointment,
    refId: appointmentRefId,
    created: appointmentCreated,
    user: appointmentUser,
    total: appointmentTotal,
  } = useMemo(() => {
    if (!data) return { appointment: [] }
    let refId: string | undefined = undefined
    let user: User | undefined = undefined
    let created: string | undefined = undefined

    let total = 0

    const appointment = data.filter((v: any) => {
      refId = v.refId
      user = v.user
      created = v.created
      total += 100
      return !!v.appointment
    })

    return { appointment, refId, user, created, total }
  }, [data])

  const { replace } = useRouter()

  useEffect(() => {
    if (!!error) replace('/transactions')
  }, [error])

  const user: User | undefined = appointmentUser || prodUser
  const created = appointmentCreated || prodCreated
  const refId = appointmentRefId || prodRefId
  const total: number = prodTotal || appointmentTotal || 0

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title={
          (<BackButton>Transaction Information</BackButton>) as JSX.Element &
            string
        }
        isFetching={isFetching}
        textProps={{ textAlign: 'start' }}
        contentProps={{
          alignItems: 'start',
          sx: { gap: [20, 40] },
        }}
      >
        <Flex flexDirection={'column'} sx={{ gap: 2 }} width={'100%'}>
          <Text as={'h3'}>TransactionId: {refId}</Text>
          <Text as={'h3'}>Total: Php {total?.toFixed(2)}</Text>
          <Text as={'h5'}>
            Created:{' '}
            {!!created
              ? format(new Date(created), `yyyy-MM-dd hh:mm aaaaa'm'`)
              : undefined}
          </Text>
          {!!user && (
            <Flex flexDirection={'column'} sx={{ gap: 2 }} mt={4}>
              <Text as={'h4'}>User Info</Text>
              <hr
                color="black"
                style={{ backgroundColor: 'black', width: '100%' }}
              />
              <Text>Id: {(user as any).id}</Text>
              <Text>Name: {(user as any).name}</Text>
              <Text>Email: {(user as any).email}</Text>
            </Flex>
          )}
        </Flex>
        <Table
          sx={{ minWidth: 500, position: 'relative', backgroundColor: 'white' }}
          aria-label="custom pagination table"
          stickyHeader={true}
        >
          <TableHead>
            <TableRow>
              {(product.length > 0
                ? ['Id', 'Product Name', 'Qty', 'Price']
                : appointment.length > 0
                ? ['RefId', 'Pet Name', 'Start Date', 'Status', 'Created']
                : []
              ).map((head) => (
                <TableCell
                  key={head as string}
                  align={head !== 'Id' && head !== 'RefId' ? 'right' : 'left'}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {product.length > 0 &&
              product.map((row: any, i: any) => (
                <TableRow key={i} hover={true} style={{ cursor: 'pointer' }}>
                  {[
                    row.transaction.product.id,
                    row.transaction.product.name,
                    row.transaction.itemNumber,
                    'Php' + row.transaction.price,
                  ].map((d, k) => (
                    <TableCell
                      key={k}
                      component="th"
                      scope="row"
                      onClick={() =>
                        push('/products/' + row.transaction.product.id)
                      }
                      sx={{
                        width: k === 0 ? 320 : undefined,
                        textAlign: k > 0 ? 'end' : undefined,
                      }}
                    >
                      {d}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {appointment.length > 0 &&
              appointment.map((row: any, i: any) => (
                <TableRow key={i} hover={true} style={{ cursor: 'pointer' }}>
                  {[
                    row.appointment.refId,
                    row.appointment.petName,
                    format(
                      new Date(row.appointment.startDate),
                      `yyyy-MM-dd hh:mm aaaaa'm'`
                    ),
                    row.appointment.status,
                    format(
                      new Date(row.appointment.created),
                      `yyyy-MM-dd hh:mm aaaaa'm'`
                    ),
                  ].map((d, k) => (
                    <TableCell
                      key={k}
                      component="th"
                      scope="row"
                      onClick={() =>
                        push('/appointments/' + row.appointment.id)
                      }
                      sx={{
                        width: k === 0 ? 320 : undefined,
                        textAlign: k > 0 ? 'end' : undefined,
                      }}
                    >
                      {d}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Section>
    </Flex>
  )
}

export async function getServerSideProps(context: any) {
  const id: string = context.params.id || ''

  return {
    props: { id },
  }
}
