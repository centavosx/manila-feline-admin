import { useCallback } from 'react'
import { Flex, Image } from 'rebass'
import { theme } from '../utils/theme'

import { useRouter } from 'next/router'
import { Section } from '../components/sections'
import { FormInput } from '../components/input'
import { Formik } from 'formik'
import { Button } from '../components/button'
import { FormContainer } from '../components/forms'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import { login } from 'api'
import { useUser } from 'hooks'
import { Loading } from 'components/loading'
YupPassword(Yup)

type LoginDto = {
  email: string
  password: string
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  // password: Yup.string().password().required('Required'),
})

export default function Home() {
  const { refetch } = useUser()

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title="Login"
        textProps={{
          alignSelf: 'center',
          justifyContent: 'center',
          m: 'auto',
          alignItems: 'center',
        }}
        sx={{ border: '1px solid brown', borderRadius: '10px' }}
        margin={['25vh', '25vh', '15vh']}
        width={['95%', '80%', '50%']}
      >
        <Formik<LoginDto>
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
              await login(values)
              await refetch()
            } catch {
              setSubmitting(false)
            }
          }}
          validationSchema={LoginSchema}
        >
          {({ isSubmitting }) => (
            <FormContainer
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
                  gap: [10, 20, 30],
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
              </Flex>

              <Flex width={'100%'} justifyContent={'center'} mt={[10, 20, 30]}>
                <Button
                  type="submit"
                  backgroundcolor={theme.mainColors.eight}
                  activecolor={theme.colors.verylight}
                  hovercolor={theme.mainColors.second}
                  textcolor={theme.colors.verylight}
                  style={{ width: '200px' }}
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Flex>
              {isSubmitting && <Loading />}
            </FormContainer>
          )}
        </Formik>
      </Section>
    </Flex>
  )
}
