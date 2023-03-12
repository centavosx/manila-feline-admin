import { Link, scroller } from 'react-scroll'
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
import { useUser } from 'hooks'

const LinkRef = ({
  href,
  children,
  isLink,
  isCurrent,
  ...others
}: { href: string; isLink?: boolean; isCurrent: boolean } & TextProps) => {
  const { push } = useRouter()
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
          backgroundColor: isCurrent ? theme.colors.blackgray : undefined,
          color: 'pink',
          padding: 14,
          ':hover': {
            backgroundColor: theme.mainColors.fifth,
          },
          '&&:active': {
            backgroundColor: theme.colors.blackgray,
          },
        }}
        {...others}
      >
        {children}
      </Text>
    </Link>
  ) : (
    <Text
      width={'auto'}
      fontWeight={'bold'}
      sx={{
        fontSize: [14, 16],
        fontFamily: 'Castego',
        borderRadius: 8,
        cursor: 'pointer',
        color: 'pink',
        backgroundColor: isCurrent ? theme.colors.blackgray : undefined,
        padding: 14,
        ':hover': {
          backgroundColor: '#7A7A7A',
          color: 'pink',
        },
        '&&:active': {
          backgroundColor: '#707070',
          color: 'pink',
        },
      }}
      onClick={() => push({ pathname: '/' + href })}
      {...others}
    >
      {children}
    </Text>
  )
}

const navigations = [
  'Dashboard',
  'Appointments',
  'Doctors',
  'Admins',
  'Users',
  'Services',
]

export const WebNavigation = ({ isLink }: { isLink?: boolean }) => {
  const { pathname } = useRouter()
  const { logout } = useUser()

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
      <Text
        width={'auto'}
        fontWeight={'bold'}
        sx={{
          fontSize: [14, 16],
          fontFamily: 'Castego',
          borderRadius: 8,
          padding: 14,
          cursor: 'pointer',
          color: theme.backgroundColors.darkbrown,
          ':hover': {
            backgroundColor: '#7A7A7A',
            color: 'pink',
          },
          '&&:active': {
            backgroundColor: '#707070',
            color: 'pink',
          },
        }}
        onClick={logout}
      >
        Logout
      </Text>
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
