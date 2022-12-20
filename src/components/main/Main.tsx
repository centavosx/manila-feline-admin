import { Flex, Image, Link as Anchor, FlexProps } from 'rebass'
import { MobileNavigation, WebNavigation } from '../navigation'

import { theme } from '../../utils/theme'
import { Button } from '../button'
import { Header } from '../header'
import { Text } from '../text'
import { MobileView, WebView } from '../views'
import { BaseHead } from '../basehead'
import { useRouter } from 'next/router'

export const Main = ({
  pageTitle,
  children,
  isLink,
}: { pageTitle?: string; isLink?: boolean } & FlexProps) => {
  const { pathname } = useRouter()
  return (
    <>
      <BaseHead
        title="Appointment"
        pageTitle={pageTitle}
        description="Set your appointment now"
      />
      <Flex
        width={'100%'}
        backgroundColor={theme.colors.verylight}
        height={'100vh'}
      >
        <Flex
          flexDirection={'row'}
          sx={{ position: 'relative' }}
          alignSelf="start"
          justifyContent={'start'}
          backgroundColor={theme.colors.verylight}
        >
          {pathname !== '/' && (
            <Header
              sx={{ gap: 2, alignSelf: 'start' }}
              flexDirection="column"
              pt={30}
              width={['auto', 'auto', 300]}
            >
              <Flex sx={{ justifyContent: 'start' }}>
                <Anchor href="/" sx={{ mr: [null, null, 4] }}>
                  <Flex alignItems={'center'} sx={{ gap: 2 }}>
                    <Image
                      src={'/assets/logo.png'}
                      width={60}
                      height={60}
                      minWidth={'auto'}
                      alt="image"
                    />
                    <Text
                      sx={{
                        fontSize: [0, 0, 18],
                        fontWeight: 600,
                        fontFamily: 'Castego',
                        color: theme.backgroundColors.darkbrown,
                        display: ['none', 'none', 'block'],
                      }}
                    >
                      Manila Feline Center
                    </Text>
                  </Flex>
                </Anchor>
              </Flex>
              <WebView>
                <Flex
                  sx={{
                    gap: 1,
                    padding: 15,
                    flexDirection: 'column',
                    alignSelf: 'start',
                    width: '100%',
                  }}
                >
                  <WebNavigation isLink={isLink} />
                </Flex>
              </WebView>
              <MobileView>
                <MobileNavigation isLink={isLink} />
              </MobileView>
            </Header>
          )}
          <Flex flex={1} height={'100vh'} overflow={'auto'}>
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
