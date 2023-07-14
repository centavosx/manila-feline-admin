import { BackButton } from 'components/back'
import { FormContainer } from 'components/forms'
import { FormInput } from 'components/input'
import { Section } from 'components/sections'
import { Formik } from 'formik'
import { Flex } from 'rebass'
import { theme } from 'utils/theme'
import { string } from 'yup'

export default function ProductInfo() {
  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title={
          (<BackButton>Product Information</BackButton>) as JSX.Element & string
        }
        textProps={{ textAlign: 'start' }}
        contentProps={{
          alignItems: 'start',
          sx: { gap: [20, 40] },
          flexDirection: ['column', 'row'],
        }}
      >
        <Formik
          initialValues={{
            id: '222',
            name: '',

            shortDescription: '',

            description: '',

            category: '',

            items: 0,

            images: [] as string[],
          }}
          onSubmit={() => {}}
        >
          {({}) => (
            <FormContainer>
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
            </FormContainer>
          )}
        </Formik>
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
