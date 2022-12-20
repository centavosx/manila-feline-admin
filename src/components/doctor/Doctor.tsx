import { Flex, Image, Text } from 'rebass'
import { Box } from '../box'
import { format } from 'date-fns'
import { Button } from 'components/button'
import { useRouter } from 'next/router'
import { BoxProps } from '@mui/material'

type DoctorInfoProp = {
  user: string
  image?: string
  workPosition: string
  availability: Date[]
}

export const DisplayDoctor = ({}) => {
  return (
    <Flex
      flexDirection={'column'}
      width="100%"
      sx={{
        gap: 2,
        maxHeight: 550,
        overflow: 'auto',
        padding: 2,

        scrollbarWidth: 'thin',
      }}
    >
      {Array(10)
        .fill(null)
        .map((d, i) => (
          <DoctorCard
            key={i}
            user={'Dr. Vincent lennnuel Llanto'}
            workPosition="Psychiatrist"
            availability={[
              new Date(),
              new Date(new Date().setHours(new Date().getHours() + 1)),
            ].sort((a: Date, b: Date) => a.getTime() - b.getTime())}
          />
        ))}
    </Flex>
  )
}

export const DoctorCard = ({
  image,
  user,
  workPosition,
  availability,
  ...other
}: BoxProps & DoctorInfoProp) => {
  const { push } = useRouter()
  return (
    <Box
      sx={{
        borderColor: 'black',
        width: '100%',
        height: undefined,
        overflow: undefined,
      }}
      flexProps={{
        sx: {
          gap: 14,
          alignItems: 'center',
          flexDirection: 'row',
        },
      }}
      {...other}
    >
      {!!image && (
        <Image
          src={image}
          alt="img"
          sx={{ borderRadius: '100%', height: 80, width: 80 }}
        />
      )}
      <Flex flexDirection={'column'} flex={1} sx={{ gap: 1 }}>
        <Text as={'h3'} width="100%" color="black">
          {user}
        </Text>
        <Text as={'h5'} width="100%" color="black">
          {workPosition}
        </Text>
        <Text as={'h6'} width="100%" color="black">
          Availability: {format(availability[0], 'hh a')} to{' '}
          {format(availability[availability.length - 1], 'hh a')}
        </Text>
        <Flex flex={1}>
          <Button onClick={() => push({ pathname: 'step2' })}>
            Set an appointment
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}
