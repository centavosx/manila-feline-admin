import { useEffect, useMemo } from 'react'
import { BackButton } from 'components/back'
import { FormContainer } from 'components/forms'
import { FormInput } from 'components/input'
import { Section } from 'components/sections'
import { Formik } from 'formik'
import { Flex, Text } from 'rebass'
import { theme } from 'utils/theme'

import { SelectImage } from '..'
import { useApi } from 'hooks'
import { getProduct, getProductReview, updateProduct } from 'api'
import { useRouter } from 'next/router'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { format } from 'date-fns'
import { Button } from 'components/button'
import { checkId, FormikValidation } from 'helpers'
import { Loading } from 'components/loading'

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

const DisplayStar = ({ selected }: { selected: number }) => {
  return (
    <Flex sx={{ gap: 1 }}>
      {Array(5)
        .fill(null)
        .map((_, index) =>
          index < selected ? (
            <AiFillStar key={index} color={theme.colors.darkpink} size={18} />
          ) : (
            <AiOutlineStar key={index} size={18} />
          )
        )}
    </Flex>
  )
}

export default function ProductInfo({ id }: { id: string }) {
  const { data, isFetching, error, refetch } = useApi(
    async () => await getProduct(id)
  )

  const { data: productReview, isFetching: isReviewFetching } = useApi(
    async () => await getProductReview(id)
  )

  const { replace } = useRouter()

  useEffect(() => {
    if (!!error) replace('/products')
  }, [error])

  const products = useMemo(() => {
    const d: ProductType = structuredClone(data)

    const arr: string[] = []

    if (!!d?.images) {
      for (const val of d.images) {
        if (val.pos === 'first') arr[0] = val.link
        if (val.pos === 'second') arr[1] = val.link
        if (val.pos === 'third') arr[2] = val.link
      }
      delete d.images
    }

    return { images: arr as string[], ...d }
  }, [data])

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title={
          (<BackButton>Product Information</BackButton>) as JSX.Element & string
        }
        isFetching={isFetching || isReviewFetching}
        textProps={{ textAlign: 'start' }}
        contentProps={{
          alignItems: 'start',
          sx: { gap: [20, 40] },
        }}
      >
        {!!data && (
          <Formik
            validationSchema={FormikValidation.createProduct}
            initialValues={{
              id: products.id,
              name: products.name,

              shortDescription: products.shortDescription,

              description: products.description,

              category: products.category,

              items: products.items,

              first: products.images[0] as string,
              second: products.images[1] as string,
              third: products.images[2] as string,

              price: Number(products.price),
            }}
            onSubmit={(values: any, { setSubmitting }) => {
              const copy = structuredClone(values)
              setSubmitting(true)
              delete copy.id
              updateProduct(id, copy).finally(() => {
                setSubmitting(false)
              })
            }}
          >
            {({ values, errors, setFieldValue, isSubmitting }) => (
              <FormContainer>
                {!!isSubmitting && <Loading />}
                <SelectImage
                  fields={values as any}
                  errors={errors}
                  onMultipleChange={(key, value) => setFieldValue(key, value)}
                />
                <FormInput
                  name="id"
                  disabled={true}
                  label={'ID'}
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: 'white',
                    borderBottomColor: theme.mainColors.first,
                    color: 'black',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                />
                <FormInput
                  name="name"
                  label={'Product Name'}
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: 'white',
                    borderBottomColor: theme.mainColors.first,
                    color: 'black',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                />
                <FormInput
                  name="price"
                  type="number"
                  label="Price"
                  placeholder="Add product price"
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: 'white',
                    borderBottomColor: theme.mainColors.first,
                    color: 'black',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                />
                <FormInput
                  name="items"
                  type="number"
                  label="Quantity"
                  placeholder="Add quantity"
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: 'white',
                    borderBottomColor: theme.mainColors.first,
                    color: 'black',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                />
                <FormInput
                  label="Short Description"
                  placeholder="Type short description"
                  name="shortDescription"
                  multiline={true}
                  maxRows={4}
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: 'white',
                    borderBottomColor: theme.mainColors.first,
                    color: 'black',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                />
                <FormInput
                  label="Long Description"
                  placeholder="Type long description"
                  name="description"
                  multiline={true}
                  maxRows={8}
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: 'white',
                    borderBottomColor: theme.mainColors.first,
                    color: 'black',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                />
                <FormInput
                  label="Category"
                  placeholder="Type Category"
                  name="category"
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: 'white',
                    borderBottomColor: theme.mainColors.first,
                    color: 'black',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                />
                <Button type="submit" style={{ width: 150 }}>
                  Save
                </Button>
              </FormContainer>
            )}
          </Formik>
        )}
        {!!productReview && (
          <Flex flexDirection={'column'} sx={{ gap: 2 }}>
            <Text as={'h3'}>
              Reviews (
              {!!products.rating ? Number(products.rating).toFixed(2) : '0.00'})
            </Text>
            <Flex flexDirection={'column'} sx={{ gap: 4 }}>
              {productReview.map((v: any, i: number) => (
                <Flex flexDirection={'column'} sx={{ gap: 2 }} key={i}>
                  <Text as={'h3'}>{v.user?.name}</Text>

                  <DisplayStar selected={v.rating} />
                  <Text>{v.comment}</Text>
                  <Text sx={{ fontSize: 11, color: 'gray' }}>
                    {format(new Date(v.created), `yyyy-MM-dd hh:mm aaaaa'm'`)}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        )}
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
