import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Image } from 'rebass'

import { Section } from '../../components/sections'

import { CreateUserDto, Response as ResponseDto } from 'dto'

import { getAllUser, getUser, updateRole, deleteRole } from 'api'
import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi } from 'hooks'
import { useRouter } from 'next/router'
import { Button } from 'components/button'
import ButtonModal from 'components/modal/Modal'
import { FormInput } from 'components/input'
import { theme } from 'utils/theme'
import { FormContainer } from 'components/forms'
import { Formik } from 'formik'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import { Text } from 'components/text'
import { Roles } from 'entities'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
}

const ModalLogin = ({ onSubmit }: { onSubmit: () => void }) => {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const searchUser = useCallback(
    async (
      event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
      onChange: (val: string) => void
    ) => {
      if (!isSearching) {
        setIsSearching(true)
        getUser(undefined, event.target.value)
          .then(() => setIsAvailable(true))
          .catch(() => setIsAvailable(false))
          .finally(() => setIsSearching(false))
      }
      onChange(event.target.value)
    },
    [setIsAvailable, setIsSearching, isSearching]
  )

  return (
    <Formik<CreateUserDto>
      initialValues={{ name: '', email: '', password: '' }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await updateRole({ ...values, role: Roles.ADMIN })
        } finally {
          setSubmitting(false)
          onSubmit()
        }
      }}
    >
      {({ isSubmitting, values, handleChange }) => (
        <FormContainer
          label="Assign Admin"
          flexProps={{
            sx: { gap: 10 },
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            padding: 20,
            width: '100%',
          }}
        >
          <Flex
            sx={{
              gap: [10],
              flexDirection: 'column',
              width: '100%',
              alignSelf: 'center',
            }}
          >
            <FormInput
              name="email"
              label={'Email'}
              variant="filled"
              type={'email'}
              inputcolor={{
                labelColor: 'gray',
                backgroundColor: 'white',
                borderBottomColor: theme.mainColors.first,
                color: 'blackw',
              }}
              sx={{ color: 'black', width: '100%' }}
              placeholder="Please type your password"
              value={values.email}
              onChange={(e) => searchUser(e, handleChange('email'))}
              InputProps={{
                endAdornment: isSearching && (
                  <InputAdornment position="end">
                    <CircularProgress size={24} />
                  </InputAdornment>
                ),
              }}
            />
            {!isAvailable ? (
              <>
                <FormInput
                  name="name"
                  label={'Name'}
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: 'white',
                    borderBottomColor: theme.mainColors.first,
                    color: 'blackw',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                />
                <FormInput
                  type={'password'}
                  name="password"
                  label={'Password'}
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: 'white',
                    borderBottomColor: theme.mainColors.first,
                    color: 'black',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                  placeholder="Please type your password"
                />
              </>
            ) : (
              <Text sx={{ color: 'green' }}>This user is available</Text>
            )}
          </Flex>

          <Flex width={'100%'} justifyContent={'center'} mt={[10, 20, 30]}>
            <Button
              type="submit"
              backgroundcolor={theme.mainColors.eight}
              activecolor={theme.colors.verylight}
              hovercolor={theme.mainColors.second}
              textcolor={theme.colors.verylight}
              style={{ width: '200px' }}
              disabled={isSubmitting || isSearching}
            >
              Submit
            </Button>
          </Flex>
        </FormContainer>
      )}
    </Formik>
  )
}

export default function Dashboard({
  limitParams,
  pageParams,
  searchParams,
}: PageProps) {
  const {
    data: dat,
    isFetching,
    refetch,
  } = useApi(
    async () => await getAllUser(pageParams, limitParams, { role: Roles.ADMIN })
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
          {(selected) => (
            <Flex p={10} alignItems={'end'} width={'100%'} sx={{ gap: 10 }}>
              <ButtonModal
                style={{ alignSelf: 'end' }}
                modalChild={({ onSubmit }) => {
                  return <ModalLogin onSubmit={onSubmit} />
                }}
                onSubmit={refetch}
              >
                Add
              </ButtonModal>
              {selected.length > 0 && (
                <ButtonModal
                  backgroundcolor="red"
                  textcolor="white"
                  hovercolor="#B22222"
                  activecolor="#FF2400"
                  hovertextcolor="white"
                  activetextcolor="white"
                  modalChild={({ onSubmit, setOpen }) => {
                    return (
                      <Flex
                        sx={{ gap: 10 }}
                        justifyContent={'center'}
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Text
                          width={'100%'}
                          textAlign={'center'}
                          sx={{
                            fontSize: 24,
                            color: 'black',
                            fontWeight: 'bold',
                          }}
                        >
                          Are you sure?
                        </Text>
                        <Flex sx={{ gap: 10 }}>
                          <Button
                            style={{ padding: 12 }}
                            backgroundcolor="red"
                            textcolor="white"
                            hovercolor="#B22222"
                            activecolor="#FF2400"
                            hovertextcolor="white"
                            activetextcolor="white"
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            style={{ padding: 12 }}
                            onClick={() => {
                              deleteRole(
                                { ids: selected },
                                Roles.ADMIN
                              ).finally(() => onSubmit())
                            }}
                          >
                            Remove
                          </Button>
                        </Flex>
                      </Flex>
                    )
                  }}
                  onSubmit={refetch}
                >
                  Remove access
                </ButtonModal>
              )}
            </Flex>
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
