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

type Services = {
  name: string
  src: string
}

const services: Services[] = [
  {
    name: 'Preventive Care',
    src: '/assets/services/Preventive Care.png',
  },
  {
    name: 'Wellness',
    src: '/assets/services/wellness.png',
  },
  {
    name: 'Consultation',
    src: '/assets/services/Consultation.png',
  },
  {
    name: 'Nutritional Counseling',
    src: '/assets/services/nutritional counseling.png',
  },
  {
    name: 'Laboratory',
    src: '/assets/services/laboratory.png',
  },
  {
    name: 'Surgery',
    src: '/assets/services/surgery.png',
  },
  {
    name: 'Telemedicine',
    src: '/assets/services/telemedicine.png',
  },
  {
    name: 'Dental Care',
    src: '/assets/services/dental care.png',
  },
  {
    name: 'Hospitalization',
    src: '/assets/services/hospitalization.png',
  },
  {
    name: 'After-hour emergency',
    src: '/assets/services/afrer hour emergency.png',
  },
  {
    name: 'Pet supplies',
    src: '/assets/services/pet-supplies.png',
  },
]

const team: { name: string; position: string; img?: string }[] = [
  {
    name: 'Ma. Josefina R. De Guzman',
    position: 'General Manager/ Co Owner',
    img: '/assets/team/owner.png',
  },
  {
    name: 'Jaymie Rose M. Hayo, DVM',
    position: 'Practice owner/ lead veterinarian',
    img: '/assets/team/vet.png',
  },
  {
    name: 'Danica D. Matias, DVM',
    position: 'Associate Veterinarian',
    img: '/assets/team/vet2.png',
  },
  {
    name: 'Reymond Macawiwili',
    position: 'Senior Assistant',
    img: '/assets/team/assistant.png',
  },
  {
    name: 'Ricvie Mateo',
    position: 'Assistant',
    img: '/assets/team/assistant.png',
  },
  {
    name: 'Din Raguindin',
    position: 'Assistant',
    img: '/assets/team/assistant.png',
  },
]

export default function Home() {
  const { replace } = useRouter()
  return (
    <Flex flexDirection={'column'} alignItems="center">
      <Carousel
        fadeDuration={150}
        carouselContent={['first', 'second', 'third'].map((data, i) => (
          <Image
            key={i}
            src={`/assets/carousel/${data}.jpg`}
            alt="ming"
            width={'100%'}
            height={[250, 450, 550, 750]}
          />
        ))}
        backgroundColor={'rgba(1,1,1,0.6)'}
        contentProps={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Flex flexDirection={'column'} width="100%" flex={1} sx={{ gap: 10 }}>
          <Text
            textAlign={'center'}
            fontFamily="Castego"
            width={'100%'}
            sx={{ fontSize: [24, 45, 55], width: '100%' }}
          >
            Manila Feline Center
          </Text>
          <Button
            type="submit"
            backgroundcolor={'transparent'}
            activecolor={theme.mainColors.sixth}
            hovercolor={theme.mainColors.seventh}
            textcolor={theme.colors.verylight}
            variant="outlined"
            style={{
              borderColor: theme.colors.verylight,
              fontFamily: 'Castego',
              fontWeight: 600,
              borderRadius: 50,
              alignSelf: 'center',
            }}
            size={'large'}
            custom={{
              padding: 20,
              '@media screen and (max-width: 640px)': {
                fontSize: 12,
                minWidth: 200,
                padding: 10,
              },
            }}
            onClick={() => replace('/set-an-appointment')}
          >
            BOOK AN APPOINTMENT
          </Button>
        </Flex>
      </Carousel>

      <Section
        id="services"
        title="Our Services"
        backgroundColor={theme.mainColors.fourth}
        contentProps={{
          flexDirection: 'row',
          sx: { gap: 3 },
          flexWrap: 'wrap',
          justifyContent: 'center',
          pl: 50,
          pr: 50,
        }}
      >
        {services.map((d, i) => (
          <ServiceIcon
            key={i}
            imageProps={{ image: { src: d.src } }}
            flexProps={{
              sx: {
                ':hover': {
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  animation: 'zoom-in-zoom-out 1s',
                  '@keyframes zoom-in-zoom-out': {
                    '0%': {
                      transform: 'scale(1, 1)',
                    },
                    '50%': {
                      transform: 'scale(1.2, 1.2)',
                    },
                    '100%': {
                      transform: 'scale(1, 1)',
                    },
                  },
                },
                width: 120,
              },
            }}
            sx={{
              wordWrap: 'break-word',
              textAlign: 'center',
              whiteSpace: 'initial',
              overflow: 'hidden',
              fontFamily: 'Castego',
            }}
          >
            {d.name}
          </ServiceIcon>
        ))}
      </Section>
      <Section
        id="mission"
        title="Our mission"
        backgroundColor={theme.mainColors.third}
      >
        We provide quality medical, surgical, and dental care to every feline or
        cat in need. We are dedicated to treating every cat as if they were our
        own and exceeding our client’s expectations.
      </Section>
      <Section
        id="vision"
        title="Our vision"
        backgroundColor={theme.mainColors.fourth}
      >
        We envision creating a culture of lifelong healthier cats in the
        community.
      </Section>
      <Section
        id="commitment"
        title="Our commitment"
        backgroundColor={theme.mainColors.fifth}
      >
        <Text
          sx={{
            fontSize: 16,
            flex: 1,
            whiteSpace: 'pre-wrap',
            color: 'black',
            textAlign: 'center',
          }}
        >
          {`We share your love of cats and are committed to providing expert-level feline medicine, dental, and surgery without sacrificing accessibility and compassion. 
We adopt a progressive, holistic and comprehensive veterinary approach to patient ailments. 
We maintain the highest standards and place an emphasis on constantly improving our medical, surgical, and diagnostic capabilities, to improve all outcomes.
We are committed to honesty, transparency, and building up a relationship based on trust and respect. 
`}
        </Text>
      </Section>
      <Section
        id="team"
        title="Our Team"
        backgroundColor={theme.mainColors.fourth}
        contentProps={{ pl: [null, 80, 150], pr: [null, 80, 150] }}
      >
        <Text
          sx={{
            fontSize: 16,
            flex: 1,
            whiteSpace: 'pre-wrap',
            color: 'black',
            textAlign: 'center',
          }}
        >
          {`Our team understands the unique bond that you have with your pet cat and our role in that relationship.  We feel honored to be entrusted with your cat's well-being, and work hard to provide services that will support that endeavor.
Here at Manila Feline Center, an expert staff of veterinarian doctors and a skilled team of technicians are here to do just that.  We are committed to providing quality medical and health care for your pets.
Under the leadership of our highly skilled veterinary doctors, your pet is always in good hands. We're ready when your pet needs us.
`}
        </Text>
        <SecondCarousel
          nextColorButton={theme.mainColors.first}
          contentProps={{ alignItems: 'center', justifyContent: 'center' }}
        >
          {team.map((d, i) => (
            <Flex key={i} flexDirection={'column'} sx={{ gap: 1 }}>
              <ServiceIcon
                key={d.name}
                imageProps={{ image: { src: d.img } }}
                flexProps={{
                  sx: {
                    gap: 24,
                  },
                }}
                sx={{
                  wordWrap: 'break-word',
                  textAlign: 'center',
                  whiteSpace: 'initial',
                  overflow: 'hidden',
                }}
              >
                <Text
                  fontFamily={'Castego'}
                  color={'black'}
                  sx={{ fontSize: 24, fontWeight: 600 }}
                >
                  {d.name}
                </Text>
                <Text
                  fontFamily={'Castego'}
                  color={'black'}
                  sx={{ fontSize: 14 }}
                >
                  {d.position}
                </Text>
              </ServiceIcon>
            </Flex>
          ))}
        </SecondCarousel>
      </Section>
      <Section
        id="team"
        title="Gallery"
        backgroundColor={theme.mainColors.fifth}
      >
        <Collage>
          {['1', '2', '3', '4', '5', '6'].map((d, i) => (
            <Image
              key={i}
              src={`/assets/gallery/${d}.jpg`}
              alt="ming"
              width={['100%', '80%', '40%']}
            />
          ))}
        </Collage>
      </Section>
      <Section
        id="aboutus"
        title="About Us"
        backgroundColor={theme.mainColors.third}
        contentProps={{ pl: [null, 80, 150], pr: [null, 80, 150] }}
      >
        <Text
          sx={{
            fontSize: 16,
            flex: 1,
            whiteSpace: 'pre-wrap',
            color: 'black',
          }}
        >
          {`Manila Feline Center is a cat-only veterinary clinic, the very FIRST ISFM Accredited Cat-Friendly Clinic here in the country, offering a unique, special place where you and your cats are listened to and treated with respect.   We strive to help keep your cat happy and healthy.   Established on __Feb 1st 2022 (date)  by  Ma. Josefina Rada De Guzman and Dr Jaymie Rose Hayo  aiming to provide the best possible medical, surgical and dental care for your cherished cats.

Our veterinary services and facilities are designed to offer preventive care for healthy pets, early detection and treatment of disease as your pet ages, and complete medical, surgical, and dental care.  No matter whether your furry friend is your first pet or you’ve been a lifelong pet owner, we are here to give you exactly the assistance and information you need.  We are committed to providing the best possible veterinary care for all pets and pet owners, irrespective of their medical or material circumstances. Our experience and love for cats ensure that cats receive the best care possible. 

We provide comprehensive and compassionate medical care.  

Currently serving the cats and cat owners in Quezon City, and we look forward to serving you for years to come.  We are currently operating at 0238 Sanly Building P. Tuazon, Cubao, Quezon City.

No matter which veterinarian your pet sees you can be assured you are getting the highest quality care here at Manila Feline Center.
`}
        </Text>
      </Section>

      <Section
        id="contactus"
        padding={0}
        backgroundColor={theme.mainColors.sixth}
        contentProps={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          sx: {
            position: 'relative',
          },
        }}
      >
        <Image
          src="/assets/meow.jpg"
          width="100%"
          height={'100%'}
          alt="background"
          sx={{ position: 'absolute', objectFit: 'cover' }}
        />
        <Flex
          alignSelf={'flex-end'}
          sx={{
            width: ['100%', '50%'],
            zIndex: 1,
            margin: 10,
            height: '100%',
          }}
          flexDirection="column"
          backgroundColor={theme.mainColors.sixth}
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
                padding: 20,
                width: '100%',
              }}
              label="Contact Us"
              labelProps={{
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <Flex
                sx={{
                  gap: [10],
                  flexDirection: ['column', 'row'],
                  width: '100%',
                }}
              >
                <FormInput
                  name="name"
                  label={'Name'}
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: theme.mainColors.fourth,
                    borderBottomColor: theme.mainColors.first,
                    color: 'black',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                  placeholder="Please type your password"
                />
                <FormInput
                  name="email"
                  label={'Email'}
                  variant="filled"
                  inputcolor={{
                    labelColor: 'gray',
                    backgroundColor: theme.mainColors.fourth,
                    borderBottomColor: theme.mainColors.first,
                    color: 'black',
                  }}
                  sx={{ color: 'black', width: '100%' }}
                  placeholder="Please type your password"
                />
              </Flex>
              <FormInput
                name="subject"
                label={'Subject'}
                variant="filled"
                inputcolor={{
                  labelColor: 'gray',
                  backgroundColor: theme.mainColors.fourth,
                  borderBottomColor: theme.mainColors.first,
                  color: 'black',
                }}
                sx={{ color: 'black', width: '100%' }}
                placeholder="Please type your password"
              />
              <FormInput
                name="message"
                label={'Message'}
                variant="filled"
                multiline={true}
                inputcolor={{
                  labelColor: 'gray',
                  backgroundColor: theme.mainColors.fourth,
                  borderBottomColor: theme.mainColors.first,
                  color: 'black',
                }}
                minRows={12}
                maxRows={12}
                sx={{ color: 'black', width: '100%' }}
                placeholder="Please type your password"
              />
              <Flex width={'100%'} justifyContent={'end'}>
                <Button
                  type="submit"
                  backgroundcolor={theme.mainColors.eight}
                  activecolor={theme.mainColors.first}
                  hovercolor={theme.mainColors.second}
                  textcolor={theme.colors.verylight}
                  style={{ width: '100px' }}
                >
                  Submit
                </Button>
              </Flex>
            </FormContainer>
          </Formik>
          <Flex
            backgroundColor={theme.mainColors.fourth}
            padding={20}
            flexDirection="row"
          >
            <Flex
              sx={{
                flexDirection: 'column',
                textAlign: 'center',
                gap: 1,
                flex: 1,
              }}
            >
              <Text sx={{ color: 'black' }}>Call us now</Text>
              <Text sx={{ color: 'black' }}>(+639123456789)</Text>
            </Flex>
            <Flex
              sx={{
                flexDirection: 'column',
                textAlign: 'center',
                gap: 1,
                flex: 1,
              }}
            >
              <Text sx={{ color: 'black' }}>Do you have any inquiries?</Text>
              <Text sx={{ color: 'black' }}>sample@sample.com</Text>
            </Flex>
            <Flex
              sx={{
                flexDirection: 'column',
                textAlign: 'center',
                gap: 1,
                flex: 1,
              }}
            >
              <Text sx={{ color: 'black' }}>Open hours</Text>
              <Text sx={{ color: 'black' }}>8am to 8pm</Text>
            </Flex>
          </Flex>
        </Flex>
      </Section>
    </Flex>
  )
}
