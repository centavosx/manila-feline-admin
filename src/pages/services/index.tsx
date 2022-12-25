import React from 'react'
import { Flex, Image } from 'rebass'
import { theme } from '../../utils/theme'
import { Text } from '../../components/text'

import { Main } from '../../components/main'
import { Carousel, SecondCarousel } from '../../components/carousel'
import { Box, BoxContainer } from '../../components/box'
import { Section } from '../../components/sections'
import { FormInput } from '../../components/input'
import { Formik } from 'formik'
import { Button } from '../../components/button'
import { FormContainer } from '../../components/forms'
import { useRouter } from 'next/router'
import { ServiceIcon } from '../../components/icon'
import { Collage } from '../../components/collage'

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

export default function Dashboard() {
  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title="Welcome Admin"
        textProps={{ textAlign: 'start' }}
      ></Section>
    </Flex>
  )
}
