import React, { memo, useCallback, useEffect, useState } from 'react'
import { Flex, Image, Text } from 'rebass'

import { Section } from '../../components/sections'

import { Response as ResponseDto } from 'dto'

import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi } from 'hooks'
import { useRouter } from 'next/router'

import { ConfirmationModal, ModalFlexProps } from 'components/modal'
import { checkId, FormikValidation } from 'helpers'
import {
  addService,
  deleteService,
  getAllService,
  searchService,
  updateService,
} from 'api/service.api'
import { Button, UploadButton, UploadProcess } from 'components/button'
import { theme } from 'utils/theme'
import { addProduct, getAllProduct } from 'api'

type PageProps = NextPage & {
  limitParams: number
  pageParams: number
  searchParams?: string
}

type ProductType = {
  name: string

  shortDescription: string

  description: string

  category: string

  items: number
}

const SelectableImage = memo(
  ({
    value,
    height,
    width,
    onChange,
  }: {
    height?: number
    width?: number
    value?: string
    onChange: (v?: string) => void
  }) => {
    const [imgString, setImgString] = useState<string | undefined>(value)
    useEffect(() => {
      onChange(imgString)
    }, [imgString])
    return (
      <Flex sx={{ position: 'relative' }}>
        <Image src={imgString} height={height} width={width} />

        <Flex
          sx={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
          }}
        >
          <UploadProcess width={'100%'} onChange={(v) => setImgString(v)}>
            Select...
          </UploadProcess>
        </Flex>
      </Flex>
    )
  }
)

SelectableImage.displayName = 'SelectableImage'

type CreateProduct = ProductType & {
  first: string
  second: string
  third: string
}

export const SelectImage: React.FC<{
  onChange?: (v: string) => void
  fields: CreateProduct
  onMultipleChange?: (key: keyof CreateProduct, value: any) => void
  error?: string
  value?: string[]
  errors: any
}> = ({ onMultipleChange, errors, fields }) => {
  return (
    <Flex mb={2} flexDirection={'column'}>
      <Flex flexDirection={['column', 'row']} sx={{ gap: 2 }}>
        <Flex flexDirection={'column'} sx={{}}>
          <SelectableImage
            height={158}
            width={158}
            value={fields.first}
            onChange={(v) => onMultipleChange?.('first', v)}
          />
        </Flex>
        <Flex flexDirection={'column'} sx={{ gap: 2 }}>
          <SelectableImage
            height={75}
            width={100}
            value={fields.second}
            onChange={(v) => onMultipleChange?.('second', v)}
          />
          <SelectableImage
            height={75}
            width={100}
            value={fields.third}
            onChange={(v) => onMultipleChange?.('third', v)}
          />
        </Flex>
      </Flex>
      {(errors.first || errors.second || errors.third) && (
        <Text color={'red'}>Please upload three images</Text>
      )}
    </Flex>
  )
}

const modalInitial: ModalFlexProps = {
  isError: true,
  validationSchema: FormikValidation.createProduct,
  modalText: 'Add New Product',
  initial: {
    first: '',

    second: '',

    third: '',

    name: '',

    shortDescription: '',

    description: '',

    category: '',

    items: 0,
  },
  fields: [
    {
      field: 'images',
      label: 'Images',
      custom: {
        Jsx: SelectImage,
      },
    },
    {
      field: 'name',
      label: 'Name',
      placeHolder: 'Please type name',
    },
    {
      field: 'shortDescription',
      label: 'Short Description',
      placeHolder: 'Please type short description',
      multiline: true,
    },
    {
      field: 'description',
      label: 'Long Description',
      placeHolder: 'Please type long description',
      multiline: true,
    },
    {
      field: 'category',
      label: 'Category',
      placeHolder: 'Please type short category',
    },
    {
      field: 'items',
      label: 'Stock',
      placeHolder: 'Stock',
      type: 'number',
    },
  ],
  onSubmit: async (values, { setSubmitting }) => {
    setSubmitting(true)

    try {
      await addProduct(values)
    } finally {
      setSubmitting(false)
    }
  },
}

export default function Products({
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
      await getAllProduct(
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
  const data: ResponseDto = dat ?? { data: [], total: 0 }

  useEffect(() => {
    refetch()
  }, [query, refetch])

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title="Products"
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
              field: 'category',
              name: 'Category',
            },
            {
              field: 'items',
              name: 'Stock',
            },
            {
              name: 'Avg rating',
              custom: (data) =>
                !!data.rating ? Number(data.rating).toFixed(2) : '0.00',
            },
          ]}
          onRowClick={(v) => push('/products/' + v.id)}
          dataRow={
            (data.data ?? []) as (ProductType & {
              id: string
              rating: string
            })[]
          }
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
              description: string
            }>
              modalText="Assign Admin"
              selected={selected}
              setSelected={setSelected}
              refetch={refetch}
              modalCreate={modalInitial}
              onRemove={async () => {
                await deleteService({ ids: selected })
              }}
              modalEdit={{
                onSubmit: async (v, { setSubmitting }) => {
                  setSubmitting(true)
                  try {
                    await updateService(v)
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
                        description: v.description,
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
                          type: 'text',
                          field: 'description',
                          disabled: false,
                          label: 'Desccription',
                          placeHolder: 'Type description',
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
