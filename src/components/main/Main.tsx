import { Flex, Image, Link as Anchor, FlexProps } from 'rebass'
import { MobileNavigation, WebNavigation } from '../navigation'

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  RefAttributes,
  createRef,
} from 'react'
import { theme } from '../../utils/theme'
import { Button } from '../button'
import { Header } from '../header'
import { Text } from '../text'
import { MobileView, WebView } from '../views'
import { BaseHead } from '../basehead'
import { useRouter } from 'next/router'
import { FiMenu } from 'react-icons/fi'
import { Chat } from 'components/chat'

const SideNav = ({
  isLink,
  refCurrent,
}: {
  isLink?: boolean
  refCurrent?: Element | null
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    if (refCurrent) {
      refCurrent?.addEventListener('click', () => {
        setIsOpen(false)
      })
      return () => {
        refCurrent?.removeEventListener('click', () => {
          setIsOpen(false)
        })
      }
    }
  }, [refCurrent, setIsOpen])

  return (
    <Header
      sx={{
        gap: 2,
        alignSelf: 'start',
        justifyContent: 'start',
        transition: 'all 0.2s ease-in-out',
        borderRightWidth: 2,
        borderRightColor: 'black',
        borderRightStyle: 'solid',
      }}
      flexDirection="column"
      pt={30}
      width={isOpen ? 280 : 80}
      height={'100vh'}
    >
      <Flex sx={{ justifyContent: 'center' }}>
        <Anchor href="/">
          <Flex alignItems={'center'} sx={{ gap: 2 }}>
            <Image
              src={'/assets/logo.png'}
              width={60}
              height={60}
              minWidth={'auto'}
              alt="image"
            />
            {isOpen && (
              <Text
                sx={{
                  fontSize: [0, 0, 18],
                  fontWeight: 600,
                  fontFamily: 'Castego',
                  color: theme.backgroundColors.darkbrown,
                }}
              >
                Manila Feline Center
              </Text>
            )}
          </Flex>
        </Anchor>
      </Flex>
      <Flex alignItems={'center'} width={'100%'}>
        <Button
          onClick={() => setIsOpen((d) => !d)}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: null,
          }}
          style={{ backgroundColor: 'transparent', color: 'black' }}
        >
          <FiMenu
            size={30}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          />
        </Button>
      </Flex>
      {isOpen && (
        <Flex
          sx={{
            gap: 1,
            pt: 15,
            flexDirection: 'column',
            alignSelf: 'start',
            width: '100%',
          }}
        >
          <WebNavigation isLink={isLink} />
        </Flex>
      )}
    </Header>
  )
}

export const Main = ({
  pageTitle,
  children,
  isLink,
}: { pageTitle?: string; isLink?: boolean } & FlexProps) => {
  const { pathname } = useRouter()
  const [refValue, setRefvalue] = useState<Element | null>(null)
  const ref = useRef<Element>(null)
  useEffect(() => {
    setRefvalue(ref.current)
  }, [ref, setRefvalue])
  return (
    <>
      <BaseHead
        title="Manila Feline Admin"
        pageTitle={pageTitle}
        description="Set your appointment now"
      />
      <Flex width={'100vw'} backgroundColor={'lightgrey'} height={'100vh'}>
        <Flex
          flexDirection={'row'}
          sx={{
            position: 'relative',
          }}
          alignSelf="start"
          justifyContent={'start'}
          width={'100vw'}
          backgroundColor={'lightgrey'}
        >
          {pathname !== '/' && pathname !== '/reset' && (
            <>
              <SideNav isLink={isLink} refCurrent={refValue} />
              <Chat />
            </>
          )}

          <Flex
            ref={ref}
            flex={1}
            height={'100vh'}
            width={'100%'}
            overflow={'auto'}
            flexDirection={'column'}
            backgroundColor={pathname === '/' ? 'white' : theme.colors.pink}
          >
            {children}
          </Flex>
          {/* <Flex>{children}</Flex>
          <Header backgroundColor={theme.colors.verylight} padding={15}>
            <Text
              sx={{
                textAlign: ['center', 'start'],
                color: theme.mainColors.first,
                fontWeight: 'bold',
              }}
            >
              0238 SANLY BLDG P TUAZON BLVD SOCORRO, CUBAO QC
            </Text>
            <Text
              sx={{
                textAlign: ['center'],
                color: theme.mainColors.first,
                fontWeight: 'bold',
              }}
            >
              Copyright © 2022 Project
            </Text>
            <Text
              textAlign={'end'}
              sx={{
                color: theme.mainColors.first,
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              <Anchor href="https://facebook.com/ManilaFelineCenter">
                https://facebook.com/ManilaFelineCenter
              </Anchor>
            </Text>
          </Header> */}
        </Flex>
      </Flex>
    </>
  )
}
