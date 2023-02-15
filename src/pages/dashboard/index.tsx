import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Flex, Image, Text } from 'rebass'

import { Section } from '../../components/sections'

import { Response as ResponseDto } from 'dto'

import {
  deleteRole,
  getAllUser,
  getAppointment,
  getUser,
  updateRole,
} from 'api'
import { CustomTable } from 'components/table'
import { NextPage } from 'next'
import { useApi } from 'hooks'
import { useRouter } from 'next/router'

import 'react-calendar/dist/Calendar.css'
import { Calendar } from 'components/calendar'
import { format } from 'date-fns'

type DashboardProps = {
  date: string | null
}

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'
import { Appointment, Status } from 'entities'
import { Loading } from 'components/loading'

const Color = {
  [Status.accepted]: 'blue',
  [Status.completed]: 'green',
  [Status.cancelled]: 'red',
  [Status.pending]: 'grey',
}

function AlignItemsList({ date }: { date: Date }) {
  const startDate = new Date(date)
  startDate.setHours(0)
  startDate.setMinutes(0)

  const endDate = new Date(date)
  endDate.setHours(23)
  endDate.setMinutes(59)

  const {
    data: dat,
    isFetching,
    refetch,
  } = useApi(
    async () =>
      await getAppointment(0, 20, undefined, null, {
        startDate,
        endDate,
      })
  )

  const { push } = useRouter()

  const appointments: Appointment[] = dat?.data ?? []

  useEffect(() => {
    refetch()
  }, [date, refetch])

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: '100%',
        bgcolor: 'background.paper',
        overflowX: 'hidden',
        height: 'auto',
        maxHeight: '100vh',
        position: 'relative',
      }}
    >
      {appointments.length > 0 ? (
        appointments.map((d, i) => (
          <Fragment key={i}>
            <ListItem
              alignItems="flex-start"
              sx={{ width: '100%', padding: 0 }}
            >
              <ListItemButton
                role={undefined}
                onClick={() =>
                  push({
                    pathname: '/appointments/[id]',
                    query: {
                      id: d.id,
                    },
                  })
                }
                dense
              >
                <ListItemText
                  primary={<Text as={'h2'}>{d.refId}</Text>}
                  secondary={
                    <React.Fragment>
                      <Flex>
                        {!!d?.doctor && (
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {d?.doctor.name}
                          </Typography>
                        )}
                        <Text flex={1}>
                          {` —${
                            d.status !== Status.pending
                              ? ' ' +
                                format(new Date(d.startDate), 'hh:mm a') +
                                ' to ' +
                                format(new Date(d.endDate), 'hh:mm a')
                              : ''
                          } `}
                        </Text>
                        <Text
                          as={'h4'}
                          textAlign={'end'}
                          sx={{ color: Color[d.status] }}
                        >
                          {d.status}
                        </Text>
                      </Flex>
                    </React.Fragment>
                  }
                />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ width: '100%' }} />
          </Fragment>
        ))
      ) : (
        <Text>No Appointments</Text>
      )}
      {isFetching && <Loading />}
    </List>
  )
}

export default function Dashboard({ date }: DashboardProps) {
  const { replace, query } = useRouter()

  return (
    <Flex flexDirection={'column'} alignItems="center" width={'100%'}>
      <Section
        title="Dashboard"
        textProps={{ textAlign: 'start' }}
        contentProps={{
          flexDirection: ['column', 'column', 'row'],
          alignItems: 'start',
        }}
      >
        <Calendar
          value={!!date ? new Date(date) : new Date()}
          onChange={(v: any) =>
            replace({
              pathname: 'dashboard',
              query: { ...query, date: new Date(v).toISOString() },
            })
          }
        />{' '}
        <Flex
          width={'100%'}
          sx={{
            backgroundColor: 'white',
            height: '100%',
            padding: 12,
            borderRadius: 5,
            border: '0.5px solid gray',
            gap: 10,
          }}
          flexDirection={'column'}
        >
          <Text sx={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>
            {format(!!date ? new Date(date) : new Date(), 'cccc LLLL d, yyyy')}
          </Text>
          <AlignItemsList date={!!date ? new Date(date) : new Date()} />
        </Flex>
      </Section>
    </Flex>
  )
}
export async function getServerSideProps(context: any) {
  let date: Date | null = context.query.date ?? null

  return {
    props: { date },
  }
}
