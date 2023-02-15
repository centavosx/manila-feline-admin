import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Fragment,
} from 'react'
import { getContact, sendMail } from '../../../api'
import { Section } from '../../../components/sections'
import { useApi } from '../../../hooks'
import { theme } from '../../../utils/theme'
import { Input } from '../../../components/input'
import { BackButton } from '../../../components/back'
import { Flex, Text } from 'rebass'
import { Button } from '../../../components/button'

import { format } from 'date-fns'

import { ContactUs, Replies } from '../../../entities'

const Message = ({ onSubmit }: { onSubmit: (v: string) => Promise<void> }) => {
  const [value, setValue] = useState('')
  const [submit, setSubmit] = useState(false)

  const waitSubmit = useCallback(() => {
    onSubmit(value).finally(() => {
      setValue('')
      setSubmit(false)
    })
  }, [onSubmit, setValue, setSubmit, value])

  useEffect(() => {
    if (!!submit) waitSubmit()
  }, [submit, waitSubmit])

  return (
    <Flex flex={1} flexDirection={'column'} sx={{ gap: 2 }}>
      <Input
        name="message"
        label={'Message'}
        multiline={true}
        variant="outlined"
        inputcolor={{
          labelColor: 'gray',
          backgroundColor: 'transparent',
          borderBottomColor: theme.mainColors.first,
          color: 'black',
        }}
        minRows={5}
        maxRows={5}
        padding={20}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={submit}
        sx={{ color: 'black', width: '100%', mt: 2 }}
      />
      <Button
        style={{ width: 100, alignSelf: 'end' }}
        onClick={async () => setSubmit(true)}
        disabled={submit}
      >
        Send
      </Button>
    </Flex>
  )
}

const AllReplies = ({
  data,
  refetch,
  id,
}: {
  data?: Replies[]
  refetch: () => void
  id: string
}) => {
  return (
    <Flex flex={1} flexDirection={'column'} sx={{ gap: 2 }}>
      <Text as={'h4'}>Your replies:</Text>
      <Flex flexDirection={'column'} flex={1} sx={{ gap: 2, mt: 10, mb: 10 }}>
        {!!data && data.length > 0 ? (
          data?.map((d) => (
            <Text key={d.id}>
              <span style={{ fontWeight: 'bold' }}>
                {format(
                  new Date(d?.created ?? 0),
                  'EEEE, LLLL do yyyy  hh:mm a'
                )}
              </span>{' '}
              - {d.message}
            </Text>
          ))
        ) : (
          <Text>No replies</Text>
        )}
      </Flex>
      <Message
        onSubmit={async (m) => {
          try {
            await sendMail(id, m)
          } finally {
            refetch()
          }
        }}
      />
    </Flex>
  )
}

export default function ContactInformation({ id }: { id: string }) {
  const { data, refetch, isFetching } = useApi(async () => await getContact(id))

  const contact: ContactUs = data

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title={
          (<BackButton>Message Information</BackButton>) as JSX.Element & string
        }
        textProps={{ textAlign: 'start' }}
        contentProps={{
          alignItems: 'start',
          sx: { gap: [20, 40] },
          flexDirection: ['column', 'row'],
        }}
        isFetching={isFetching}
      >
        <Flex flexDirection={'column'} flex={1} sx={{ gap: 2 }}>
          <Text as={'h2'}>Subject: {contact?.message}</Text>
          <Text as={'h2'}>Name: {contact?.name}</Text>
          <Text sx={{ color: 'gray', mb: 10 }}>Email: {contact?.from}</Text>

          <Text>
            <span style={{ fontWeight: 'bold' }}>Created</span>:{' '}
            {format(
              new Date(contact?.created ?? 0),
              'EEEE, LLLL do yyyy  hh:mm a'
            )}
          </Text>

          <Text>
            <span style={{ fontWeight: 'bold' }}>Message</span>:{' '}
            {contact?.message}
          </Text>
        </Flex>
        <AllReplies data={contact?.replies} refetch={refetch} id={id} />
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
