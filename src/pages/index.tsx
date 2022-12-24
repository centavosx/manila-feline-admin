import { Flex, Image } from 'rebass'
import { theme } from '../utils/theme'
import { Text } from '../components/text'

import { Main } from '../components/main'
import { Carousel, SecondCarousel } from '../components/carousel'
import { Box, BoxContainer } from '../components/box'
import { Section } from '../components/sections'
import { FormInput } from '../components/input'
import { Formik } from 'formik'
import { Button } from '../components/button'
import { FormContainer } from '../components/forms'
import { useRouter } from 'next/router'
import { ServiceIcon } from '../components/icon'
import { Collage } from 'components/collage'

export default function Home() {
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
        <Formik<{ test: string }>
          initialValues={{ test: '' }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))

              setSubmitting(false)
            }, 400)
          }}
        >
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
              >
                Submit
              </Button>
            </Flex>
          </FormContainer>
        </Formik>
      </Section>
    </Flex>
  )
}
