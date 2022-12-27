import { Link, scroller } from 'react-scroll'
import NextLink from 'next/link'
import { TextProps } from 'rebass'
import { theme } from '../../utils/theme'
import { Text } from '../text'
import Drawer from '@mui/material/Drawer'
import React, { useCallback, useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { Button } from '../button'
import { useRouter } from 'next/router'

const LinkRef = ({
  href,
  children,
  isLink,
  isCurrent,
  ...others
}: { href: string; isLink?: boolean; isCurrent: boolean } & TextProps) => {
  return !isLink ? (
    <Link
      to={href}
      spy={true}
      smooth={true}
      offset={0}
      duration={500}
      style={{ cursor: 'pointer' }}
    >
      <Text
        width={'auto'}
        fontWeight={'bold'}
        sx={{
          fontSize: [14, 16],
          fontFamily: 'Castego',
          borderRadius: 8,
          backgroundColor: isCurrent ? theme.mainColors.first : undefined,
          padding: 14,
          ':hover': {
            backgroundColor: theme.mainColors.fifth,
          },
          '&&:active': {
            backgroundColor: theme.mainColors.sixth,
          },
        }}
        {...others}
      >
        {children}
      </Text>
    </Link>
  ) : (
    <NextLink href={'/' + href} style={{ cursor: 'pointer' }}>
      <Text
        width={'auto'}
        fontWeight={'bold'}
        sx={{
          fontSize: [14, 16],
          fontFamily: 'Castego',
          borderRadius: 8,
          backgroundColor: isCurrent ? theme.mainColors.first : undefined,
          padding: 14,
          ':hover': {
            backgroundColor: theme.mainColors.fifth,
          },
          '&&:active': {
            backgroundColor: theme.mainColors.sixth,
          },
        }}
        {...others}
      >
        {children}
      </Text>
    </NextLink>
  )
}

const navigations = ['Dashboard', 'Doctors', 'Users', 'Services', 'Contact Us']

export const WebNavigation = ({ isLink }: { isLink?: boolean }) => {
  const { pathname, basePath } = useRouter()

  return (
    <>
      {navigations.map((data) => (
        <LinkRef
          key={data}
          href={data?.split(' ').join('').toLowerCase()}
          color={
            pathname.includes(data?.split(' ').join('').toLowerCase())
              ? theme.backgroundColors.verylight
              : theme.backgroundColors.darkbrown
          }
          isLink={isLink}
          isCurrent={pathname.includes(data?.split(' ').join('').toLowerCase())}
        >
          {data}
        </LinkRef>
      ))}
    </>
  )
}

export const MobileNavigation = ({ isLink }: { isLink?: boolean }) => {
  const { replace } = useRouter()
  const [state, setState] = useState({
    left: false,
  })
  const toggleDrawer = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }
      setState({ left: open })
    },
    [setState]
  )

  const list = () => (
    <Box
      sx={{ width: 250 }}
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      role="presentation"
    >
      <List>
        {navigations.map((data: string, i) => (
          <ListItem key={i} disablePadding={true}>
            <ListItemButton
              onClick={() =>
                !isLink
                  ? scroller.scrollTo(data?.split(' ').join('').toLowerCase(), {
                      spy: true,
                      smooth: true,
                      offset: 50,
                      duration: 500,
                    })
                  : replace('/#' + data?.split(' ').join('').toLowerCase())
              }
            >
              <ListItemText primary={data} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
  return (
    <>
      <Button onClick={toggleDrawer(true)} sx={{ minWidth: 34 }}>
        <FiMenu size={30} />
      </Button>
      <Drawer open={state.left} anchor={'left'} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  )
}
