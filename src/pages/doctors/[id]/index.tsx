import { getUser } from 'api'
import { Section } from 'components/sections'
import { useApi } from 'hooks'
import { BackButton } from 'components/back'
import { Flex, Text } from 'rebass'

import { Availability } from 'components/doctor/availability'
import { Services } from 'components/doctor/service'
import { User } from 'entities'

export default function Information({ id }: { id: string }) {
  const { data, refetch } = useApi(async () => await getUser(id))
  const user: User = data
  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title={(<BackButton>Information</BackButton>) as JSX.Element & string}
        textProps={{ textAlign: 'start' }}
        contentProps={{
          alignItems: 'start',
          sx: { gap: [20, 40] },
          flexDirection: ['column', 'row'],
        }}
      >
        <Flex flexDirection={'column'} flex={1} sx={{ gap: 2 }}>
          <Text as={'h2'}>{user?.name}</Text>
          <Text sx={{ color: 'gray', mb: 10 }}>{user?.email}</Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Description</span>:{' '}
            {user?.description}
          </Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Position</span>:{' '}
            {user?.position}
          </Text>
          <Text>
            <span style={{ fontWeight: 'bold' }}>Created</span>:{' '}
            {new Date(user?.created ?? 0).toDateString()}
          </Text>
          <Services id={id} service={user?.services ?? []} refetch={refetch} />
        </Flex>
        <Availability
          availability={user?.availability ?? []}
          id={id}
          refetch={refetch}
        />
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
