import { useState, useCallback, useEffect } from 'react'

import { Flex, Text } from 'rebass'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'

import MenuItem from '@mui/material/MenuItem'

import Select, { SelectChangeEvent } from '@mui/material/Select'

import Chip from '@mui/material/Chip'
import { Button } from '../../button'
import { updateAvailability } from 'api'

const ITEM_HEIGHT = 50
const ITEM_PADDING_TOP = 1
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const dateAndTime: string[] = [
  '12:00 AM to 01:00 AM',
  '01:00 AM to 02:00 AM',
  '02:00 AM to 03:00 AM',
  '03:00 AM to 04:00 AM',
  '04:00 AM to 05:00 AM',
  '05:00 AM to 06:00 AM',
  '06:00 AM to 07:00 AM',
  '07:00 AM to 08:00 AM',
  '08:00 AM to 09:00 AM',
  '09:00 AM to 10:00 AM',
  '10:00 AM to 11:00 AM',
  '11:00 AM to 12:00 PM',
  '12:00 PM to 01:00 PM',
  '01:00 PM to 02:00 PM',
  '02:00 PM to 03:00 PM',
  '03:00 PM to 04:00 PM',
  '04:00 PM to 05:00 PM',
  '05:00 PM to 06:00 PM',
  '06:00 PM to 07:00 PM',
  '07:00 PM to 08:00 PM',
  '08:00 PM to 09:00 PM',
  '09:00 PM to 10:00 PM',
  '10:00 PM to 11:00 PM',
  '11:00 PM to 11:59 PM',
]

export const SelectTime = ({
  time,
  isDisabled,
  onChange,
}: {
  time: string[]
  isDisabled: boolean
  onChange: (date: string[]) => void
}) => {
  const [timeToSet, setTimeToSet] = useState<string[]>(
    time.length > 0 ? time : ['Select availability time']
  )

  useEffect(() => {
    setTimeToSet(time.length > 0 ? time : ['Select availability time'])
  }, [time, setTimeToSet])

  const handleChange = useCallback(
    (event: SelectChangeEvent<typeof timeToSet>) => {
      const {
        target: { value },
      } = event
      let data = typeof value === 'string' ? value.split(',') : value
      const dt = new Date()

      if (value.length === 0) {
        data = ['Select availability time']
      } else {
        data = data.filter((d) => d !== 'Select availability time')
      }

      data.sort((a, b) => {
        const split1 = a.split(' to ')
        const firstTimeA = new Date(
          dt.toDateString() + ' ' + split1[0]
        ).getTime()

        const split2 = b.split(' to ')
        const firstTimeB = new Date(
          dt.toDateString() + ' ' + split2[0]
        ).getTime()

        return firstTimeA - firstTimeB
      })

      setTimeToSet(data)
      onChange(data.filter((d) => d !== 'Select availability time'))
    },
    [setTimeToSet, onChange]
  )

  return (
    <Select
      multiple
      placeholder="Select time"
      value={timeToSet}
      disabled={isDisabled}
      onChange={handleChange}
      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
      renderValue={(selected) =>
        selected.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Chip key={'Select Time'} label={'Select Time'} />
          </Box>
        )
      }
      MenuProps={MenuProps}
    >
      {dateAndTime.map((dateAndTime) => (
        <MenuItem key={dateAndTime} value={dateAndTime}>
          {dateAndTime}
        </MenuItem>
      ))}
    </Select>
  )
}

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

type DateProps = {
  startDate: Date
  endDate: Date
}

export type TimeSetterProps = [
  string[],
  string[],
  string[],
  string[],
  string[],
  string[],
  string[]
]

export const Availability = ({
  availability,
  id,
  refetch,
}: {
  availability: DateProps[]
  id: string
  refetch: () => void
}) => {
  const [time, setTime] = useState<TimeSetterProps>([
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ])
  const [timeToPass, setTimeToPass] = useState<TimeSetterProps>([
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ])
  const [isEdit, setIsEdit] = useState(false)

  const editTime = useCallback(
    (date: DateProps[]) => {
      let newTime: TimeSetterProps = [[], [], [], [], [], [], []]
      date?.forEach((d) => {
        const startDt = new Date(d.startDate)
        const endDt = new Date(d.endDate)
        const day = startDt.getDay()
        const startAndEnd = `${startDt.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })} to ${endDt.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}`
        newTime[day] = [...newTime[day], startAndEnd]
      })
      setTimeToPass(newTime)
      setTime(newTime)
    },
    [setTime, setTimeToPass]
  )

  useEffect(() => {
    editTime(availability)
  }, [availability, editTime])

  const changeTimeToPass = useCallback(() => {
    setTimeToPass(() => [...time])
  }, [time, setTimeToPass])

  const onSubmit = useCallback(() => {
    updateAvailability(id, timeToPass).finally(() => {
      refetch()
      setIsEdit(false)
    })
  }, [timeToPass, setIsEdit, id, refetch])

  useEffect(() => {
    if (!isEdit) changeTimeToPass()
  }, [isEdit, changeTimeToPass])

  return (
    <Flex flexDirection={'column'} flex={1} sx={{ gap: 2 }}>
      <Flex flexDirection={['column', 'row']} sx={{ gap: 2 }}>
        <Text flex={1} as={'h3'}>
          Availability
        </Text>
        <Button
          backgroundcolor={isEdit ? 'red' : undefined}
          textcolor={isEdit ? 'white' : undefined}
          hovercolor={isEdit ? '#B22222' : undefined}
          activecolor={isEdit ? '#FF2400' : undefined}
          hovertextcolor={isEdit ? 'white' : undefined}
          activetextcolor={isEdit ? 'white' : undefined}
          onClick={() => setIsEdit((d) => !d)}
        >
          {!isEdit ? 'Edit' : 'Cancel'}
        </Button>
        {isEdit && <Button onClick={onSubmit}>Save</Button>}
      </Flex>
      {days.map((day, i) => (
        <Flex key={i} flexDirection={'column'} sx={{ gap: 2 }}>
          <Text as={'h4'}>{day}</Text>

          <SelectTime
            isDisabled={!isEdit}
            time={timeToPass?.[i] ?? []}
            onChange={(value) => {
              setTimeToPass((d) => {
                let nd: TimeSetterProps = [...d]
                nd[i] = value
                return nd
              })
            }}
          />
        </Flex>
      ))}
    </Flex>
  )
}
