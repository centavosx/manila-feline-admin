import React, { memo, useCallback, useEffect, useState } from 'react'
import { Flex, Image } from 'rebass'

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
import { Button, UploadButton } from 'components/button'
import { theme } from 'utils/theme'

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

  images: string[]
}

const SelectableImage = memo(
  ({
    value,
    height,
    width,
  }: {
    height?: number
    width?: number
    value?: string
  }) => {
    const [image, setImage] = useState<File>()
    const [imgString, setImgString] = useState<string | undefined>(value)
    function getBase64(file: File) {
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        setImgString(reader.result as string)
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
    }

    useEffect(() => {
      if (!!image) getBase64(image)
    }, [image])

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
          <UploadButton
            style={{
              width: '100%',
            }}
            onFileChange={async (f) => {
              setImage(f[0])
            }}
            accept={['image/jpg', 'image/jpeg', 'image/png']}
          >
            <span
              style={{
                display: '-webkit-box',
                color: theme.colors.white,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              Select...
            </span>
          </UploadButton>
        </Flex>
      </Flex>
    )
  }
)

const SelectImage: React.FC<{
  onChange: (v: string) => void
  fields: ProductType
  onMultipleChange?: (key: keyof ProductType, value: any) => void
  error?: string
  value?: string[]
}> = ({ onChange, error, value = [] }) => {
  return (
    <Flex flexDirection={['column', 'row']} sx={{ gap: 2 }}>
      <Flex flexDirection={'column'} sx={{}}>
        <SelectableImage height={158} width={158} value={value[0]} />
      </Flex>
      <Flex flexDirection={'column'} sx={{ gap: 2 }}>
        <SelectableImage height={75} width={100} value={value[1]} />
        <SelectableImage height={75} width={100} value={value[2]} />
      </Flex>
    </Flex>
  )
}

const modalInitial: ModalFlexProps = {
  isError: true,
  validationSchema: FormikValidation.createService,
  modalText: 'Add New Product',
  initial: {
    name: '',

    shortDescription: '',

    description: '',

    category: '',

    items: 0,

    images: [] as string[],
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
      await addService(values)
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
      await getAllService(
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
  const { replace, query, pathname } = useRouter()
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
          ]}
          dataRow={[] as (ProductType & { id: string })[]}
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
