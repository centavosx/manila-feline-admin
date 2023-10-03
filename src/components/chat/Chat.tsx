import { useEffect, useRef, useState, memo } from 'react'
import { Flex, Text, Image } from 'rebass'
import { theme } from 'utils/theme'
import { Button } from '../button/Button'
import { Input } from '../input/Input'
import { format } from 'date-fns'
import {
  FirebaseAdminRealtimeMessaging,
  FirebaseRealtimeMessaging,
} from 'firebaseapp'

type UserSelected = {
  id: string
  name: string
  chatModified: number
  lastMessage?: string
}

export const Chat = () => {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <Flex sx={{ position: 'absolute', bottom: 12, right: 12, zIndex: 3 }}>
      {!!open && (
        <Flex
          sx={{
            position: 'absolute',
            right: 65,
            width: 300,
            height: 500,
            background: 'white',
            bottom: 0,
            borderRadius: 8,
            padding: '8px',
            gap: 2,
            flexDirection: 'column',
          }}
        >
          <Text as={'h4'}>Chat</Text>
          {selectedId ? (
            <>
              <Button style={{ width: 70 }} onClick={() => setSelectedId(null)}>
                Back
              </Button>
              <ChatMessages id={selectedId} />
              <ChatInput id={selectedId} />
            </>
          ) : (
            <SelectUser getId={setSelectedId} />
          )}
        </Flex>
      )}
      <Flex
        sx={{
          height: 60,
          width: 60,
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '100%',
          backgroundColor: theme.colors.pink,
          border: '1px solid black',
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <Text as="h3">Chat</Text>
      </Flex>
    </Flex>
  )
}

const SelectUser = ({ getId }: { getId: (v: string) => void }) => {
  const [data, setData] = useState<UserSelected[]>([])

  const fb = useRef(
    new FirebaseAdminRealtimeMessaging<any, UserSelected>()
  ).current

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (isMounted) {
      const sub = fb.listen((v, t) => {
        setData((val) => {
          return (
            !val.some((check) => {
              return check.id === v.id
            })
              ? [v, ...val]
              : val.map((u) => (u.id === v.id ? { ...v } : u))
          ).sort((a, b) => b.chatModified - a.chatModified)
        })
      })

      return () => {
        sub()
      }
    }
  }, [isMounted])

  useEffect(() => {
    fb.getData(20)
      .then((v) => {
        setData((val) =>
          [...val, ...v].sort((a, b) => b.chatModified - a.chatModified)
        )
      })
      .finally(() => {
        setIsMounted(true)
      })
  }, [])

  return (
    <Flex flexDirection={'column'} sx={{ gap: 2 }}>
      {data.map((v) => {
        return (
          <UserInfo
            key={v.id}
            id={''}
            selectedId={v.id}
            name={v.name}
            message={v.lastMessage}
            date={format(new Date(v.chatModified), 'cccc LLLL d, yyyy hh:mm a')}
            onClick={() => {
              getId(v.id)
            }}
          />
        )
      })}
    </Flex>
  )
}

const UserInfo = memo(
  ({
    id,
    img,
    name,
    date,
    message,
    onClick,
    selectedId,
  }: {
    id: string
    onClick: () => void
    img?: string
    name: string
    date: string
    message?: string
    selectedId: string
  }) => {
    const [number, setNumber] = useState(0)
    // const fb = useRef(
    //   new FirebaseRealtimeMessaging<
    //     any,
    //     {
    //       id: string
    //       name: string
    //       picture?: string
    //       chatModified: number
    //       lastMessage?: string
    //     }
    //   >(selectedId)
    // ).current

    // useEffect(() => {
    //   const sub = fb.listen(() => {
    //     fb.getUnreadCount(id).then((v) => {
    //       setNumber(v)
    //     })
    //   })

    //   return () => {
    //     sub()
    //   }
    // }, [])
    return (
      <Flex
        sx={{
          gap: 2,
          alignItems: 'center',
          position: 'relative',
          borderRadius: 8,
          ':hover': {
            backgroundColor: theme.colors.lightpink,
          },
          padding: 2,
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onClick={onClick}
      >
        <Image
          src={!img ? '/assets/logo.png' : img}
          size={30}
          sx={{ borderRadius: '100%' }}
          alt="logo"
        />
        <Flex flexDirection={'column'} flex={1}>
          <Text as={'h4'}>{name}</Text>
          <Text as={'h6'} color="gray">
            {date}
          </Text>
          <Text fontSize="11px">{message}</Text>
        </Flex>
        {!!number && (
          <Flex
            sx={{
              position: 'absolute',
              borderRadius: '100%',
              backgroundColor: theme.colors.pink,
              padding: '2px',
              pl: '6px',
              pr: '6px',
              top: 0,
              left: '-7px',
            }}
          >
            <Text color={'white'} fontSize={12}>
              {number}
            </Text>
          </Flex>
        )}
      </Flex>
    )
  }
)
UserInfo.displayName = 't'

export const ChatMessages = ({ id }: { id: string }) => {
  const [data, setData] = useState<
    {
      refId: string
      created: number
      message: string
      isUser: boolean
    }[]
  >([])
  const fb = useRef(
    new FirebaseRealtimeMessaging<{ message: string }>(id)
  ).current

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (isMounted) {
      const sub = fb.listen((v, t) => {
        if (t === 'added') {
          setData((val) =>
            !val.some((check) => {
              return check.refId === v.refId
            })
              ? [...val, v as any]
              : val
          )
        }
      })

      return () => {
        sub()
      }
    }
  }, [id, isMounted])

  useEffect(() => {
    fb.getData(20)
      .then((v) => setData((val) => [...val, ...(v as any).reverse()]))
      .finally(() => {
        setIsMounted(true)
      })
  }, [])

  return (
    <Flex
      flexDirection="column"
      padding={2}
      sx={{ borderRadius: 8, overflowY: 'scroll', gap: 2 }}
      flex={1}
    >
      {data.map((v, i) => {
        return (
          <UserMessage
            message={v.message}
            key={i}
            isUser={!v.isUser}
            date={new Date(v.created)}
          />
        )
      })}
    </Flex>
  )
}

export const UserMessage = ({
  message,
  isUser,
  date,
}: {
  message: string
  date?: Date
  isUser?: boolean
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  return (
    <Flex
      ref={ref}
      width={'45%'}
      maxWidth={'45%'}
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      justifyContent={isUser ? 'flex-end' : undefined}
      flexDirection={'column'}
      alignItems={isUser ? 'flex-end' : 'flex-start'}
    >
      <Flex width={'100%'} justifyContent={isUser ? 'end' : 'start'}>
        <Text
          width={'auto'}
          alignItems={isUser ? 'flex-end' : 'flex-start'}
          color={theme.colors.black}
          padding={2}
          backgroundColor={!isUser ? theme.colors.white : theme.colors.pink}
          sx={{
            borderRadius: 8,
            ...(!isUser
              ? {
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: 'black',
                  justifyContent: 'flex-end',
                }
              : {}),

            wordBreak: 'break-all',
            wordWrap: 'break-word',
          }}
        >
          {message}
        </Text>
      </Flex>
      {!!date && (
        <Text
          sx={{
            fontSize: 11,
            opacity: 0.5,
            textAlign: isUser ? 'end' : 'start',
          }}
        >
          {format(date, 'cccc LLLL d, yyyy hh:mm a')}
        </Text>
      )}
    </Flex>
  )
}

const ChatInput = ({ id }: { id: string }) => {
  const [message, setMessage] = useState('')
  let fb = useRef(
    new FirebaseRealtimeMessaging<{
      message: string
      isUser: boolean
    }>(id)
  )

  useEffect(() => {
    fb.current = new FirebaseRealtimeMessaging<{
      message: string
      isUser: boolean
    }>(id)
  }, [id])

  return (
    <Flex flexDirection={['column', 'row']} sx={{ gap: 2 }}>
      <Input
        multiline={true}
        variant="outlined"
        inputcolor={{
          labelColor: 'gray',
          backgroundColor: 'white',
          borderBottomColor: theme.mainColors.first,
          color: 'black',
        }}
        label={'Message'}
        placeholder={'Type Message'}
        maxRows={3}
        padding={20}
        sx={{ color: 'black', flex: 1 }}
        onChange={(v) => setMessage(v.target.value)}
        value={message}
      />
      <Button
        style={{ width: 50, height: 40 }}
        onClick={() => {
          if (!!id) {
            fb.current.sendData({ message, isUser: false })
            setMessage('')
          }
        }}
      >
        Send
      </Button>
    </Flex>
  )
}

// ChatInput.displayName = 'ChatInput'

// export const Chat = ({
//   title,
//   id,
//   from,
//   img = '/assets/logo.png',
// }: {
//   title: string
//   id: string
//   from?: string
//   img?: string
// }) => {
//   const [selected, setSelected] = useState({
//     loading: false,
//     id: '',
//   })

//   useEffect(() => {
//     setSelected({
//       id: '',
//       loading: true,
//     })
//     setTimeout(() => {
//       setSelected({
//         id,
//         loading: false,
//       })
//     }, 300)
//   }, [id])

//   return (
//     <Flex sx={{ flexDirection: 'column', gap: 2, overflow: 'auto' }} flex={1}>
//       {selected.id && !selected.loading ? (
//         <>
//           <Flex sx={{ gap: 2, alignItems: 'center' }} mb={2}>
//             <Image
//               src={img || '/assets/logo.png'}
//               size={64}
//               sx={{ borderRadius: '100%' }}
//               alt="logo"
//             />
//             <Text as={'h2'}>{title}</Text>
//           </Flex>

//           <ChatMessages id={id} from={from ?? id} />
//         </>
//       ) : (
//         <Flex flex={1}></Flex>
//       )}
//     </Flex>
//   )
// }
