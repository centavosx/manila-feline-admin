import { useState, useCallback, useEffect, useRef, useMemo } from 'react'

import { Flex, Text } from 'rebass'
import { format } from 'date-fns'

import { Button } from '../../button'
import { updateAvailability } from 'api'

import {
  ClockPickerView,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import IconButton from '@mui/material/IconButton'

import { FormikValidation } from 'helpers'

import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import dayjs from 'dayjs'
import { TextField } from '@mui/material'
import { start } from 'repl'
import { Form, Formik } from 'formik'
import { InputError } from 'components/input'
import { Loading } from 'components/loading'

const setTime = (
  dateToModify: string | Date,
  value: number,
  clock: ClockPickerView
) => {
  const date = new Date(dateToModify)
  if (clock === 'minutes') {
    date.setMinutes(value)
  }
  if (clock === 'hours') {
    date.setHours(value)
  }
  if (clock === 'seconds') {
    date.setSeconds(value)
  }
  return date
}

const setWholeTime = (
  dateToModify: Date | string,
  { h, m, s }: { h: string | number; m: string | number; s: string | number }
) => {
  const date = new Date(dateToModify)
  date.setHours(Number(h))
  date.setMinutes(Number(m))
  date.setSeconds(Number(s))
  return date
}

export const ExistingTime = ({
  time,
  onDelete,
  isDisabled,
}: {
  time: DateProps
  onDelete: () => void
  isDisabled: boolean
}) => {
  return (
    <Flex flexDirection={'row'} sx={{ gap: 2, width: '100%', mt: 2 }}>
      <TimePicker
        label="Start Time"
        showToolbar={true}
        value={time.startDate}
        closeOnSelect={true}
        onChange={() => {}}
        ampm={true}
        views={['hours', 'minutes']}
        ampmInClock={false}
        renderInput={(params) => <TextField {...params} sx={{ flex: 1 }} />}
        disabled={true}
      />
      <TimePicker
        label="Start Time"
        showToolbar={true}
        value={time.endDate}
        closeOnSelect={true}
        onChange={() => {}}
        ampm={true}
        views={['hours', 'minutes']}
        ampmInClock={false}
        renderInput={(params) => <TextField {...params} sx={{ flex: 1 }} />}
        disabled={true}
      />
      {!isDisabled && (
        <IconButton
          aria-label="submit"
          color="error"
          size={'small'}
          sx={{ height: 40, width: 40, alignSelf: 'center' }}
          onClick={onDelete}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Flex>
  )
}

export const NewTime = ({
  timeToSet,
  onSubmit,
}: {
  timeToSet: DateProps[]
  onSubmit: (value: DateProps) => void
}) => {
  const checkDate = useCallback(
    (date: Date) => {
      const thisDate = setWholeTime(date, {
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
      })

      return timeToSet?.some((data) => {
        if (!data.startDate || !data.endDate) return false

        const startTime = setWholeTime(thisDate, {
          h: data.startDate.getHours(),
          m: data.startDate.getMinutes(),
          s: data.startDate.getSeconds(),
        })

        const endTime = setWholeTime(thisDate, {
          h: data.endDate.getHours(),
          m: data.endDate.getMinutes(),
          s: data.endDate.getSeconds(),
        })

        return startTime <= thisDate && thisDate <= endTime
      })
    },
    [timeToSet]
  )

  return (
    <Formik<{ startDate: number | null; endDate: number | null }>
      validationSchema={FormikValidation.updateAppointment}
      initialValues={{ startDate: null, endDate: null }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true)
        const date: DateProps = {
          startDate: new Date(values.startDate as unknown as number),
          endDate: new Date(values.endDate as unknown as number),
        }
        onSubmit(date)
        setSubmitting(false)
      }}
    >
      {({ values, errors, setFieldValue, isSubmitting }) => (
        <Form>
          <Flex flexDirection={'row'} sx={{ gap: 2, width: '100%', mt: 2 }}>
            <Flex flexDirection={'column'} flex={1} sx={{ gap: 2 }}>
              <TimePicker
                label="Start Time"
                showToolbar={true}
                value={!!values.startDate ? new Date(values.startDate) : null}
                closeOnSelect={true}
                onChange={(newValue) => {
                  if (!newValue) return
                  const date = new Date(newValue.toString())

                  if (checkDate(date)) return
                  setFieldValue('startDate', date.getTime())
                }}
                ampm={true}
                views={['hours', 'minutes']}
                ampmInClock={false}
                renderInput={(params) => (
                  <TextField {...params} sx={{ flex: 1 }} />
                )}
              />
              <InputError error={errors.startDate} />
            </Flex>
            <Flex flexDirection={'column'} flex={1} sx={{ gap: 2 }}>
              <TimePicker
                label="End time"
                value={!!values.endDate ? new Date(values.endDate) : null}
                showToolbar={true}
                views={['hours', 'minutes']}
                onChange={(newValue) => {
                  if (!newValue) return
                  const date = new Date(newValue.toString())

                  if (checkDate(date)) return

                  setFieldValue('endDate', date.getTime())
                }}
                ampm={true}
                ampmInClock={false}
                renderInput={(params) => (
                  <TextField {...params} sx={{ flex: 1 }} />
                )}
                minTime={dayjs(new Date(values.startDate as unknown as number))}
                disabled={!values.startDate}
              />
              <InputError error={errors.endDate} />
            </Flex>
            <IconButton
              aria-label="submit"
              color="success"
              size={'small'}
              sx={{ height: 40, width: 40, alignSelf: 'center' }}
              type="submit"
              disabled={isSubmitting}
            >
              <SaveIcon fontSize="small" />
            </IconButton>
          </Flex>
        </Form>
      )}
    </Formik>
  )
}

export const SelectTime = ({
  time,
  isDisabled,
  onChange,
}: {
  time: DateProps[]
  isDisabled: boolean
  onChange?: (date: DateProps[]) => void
}) => {
  const [isAdd, setIsAdd] = useState<boolean>(false)

  // useEffect(() => {
  //   onChange?.(timeToSet)
  // }, [timeToSet, onChange])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Flex flexDirection={'column'} width={'100%'} sx={{ gap: 2 }}>
        {time.map((d, i) => {
          return (
            <ExistingTime
              key={JSON.stringify(d) + i}
              time={d}
              onDelete={() =>
                onChange?.(
                  time.filter(
                    (toDelete) => JSON.stringify(toDelete) !== JSON.stringify(d)
                  )
                )
              }
              isDisabled={isDisabled}
            />
          )
        })}
        {(time.length === 0 || isAdd) && !isDisabled && (
          <NewTime
            timeToSet={time}
            onSubmit={(value) => {
              onChange?.([...time, value])
              setIsAdd(false)
            }}
          />
        )}
        {time.length > 0 && !isDisabled && (
          <Flex>
            {!isAdd ? (
              <Button style={{ padding: 12 }} onClick={() => setIsAdd(true)}>
                Add New Time
              </Button>
            ) : (
              <Button
                style={{ padding: 12 }}
                backgroundcolor="red"
                textcolor="white"
                hovercolor="#B22222"
                activecolor="#FF2400"
                hovertextcolor="white"
                activetextcolor="white"
                onClick={() => setIsAdd(false)}
              >
                Cancel
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </LocalizationProvider>
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
  startDate: Date | null
  endDate: Date | null
}

export type TimeSetterProps = [
  DateProps[],
  DateProps[],
  DateProps[],
  DateProps[],
  DateProps[],
  DateProps[],
  DateProps[]
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const editTime = useCallback(
    (date: DateProps[]) => {
      let newTime: TimeSetterProps = [[], [], [], [], [], [], []]
      date?.forEach((d) => {
        if (!d.startDate || !d.endDate) return
        const startDt = new Date(d.startDate)
        const endDt = new Date(d.endDate)
        const day = startDt.getDay()
        newTime[day] = [...newTime[day], { startDate: startDt, endDate: endDt }]
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
    setIsSubmitting(true)
    updateAvailability(id, timeToPass).finally(() => {
      setIsSubmitting(false)
      refetch()
      setIsEdit(false)
    })
  }, [timeToPass, setIsEdit, id, refetch, setIsSubmitting])

  useEffect(() => {
    if (!isEdit) changeTimeToPass()
  }, [isEdit, changeTimeToPass])

  return (
    <Flex flexDirection={'column'} flex={1} sx={{ gap: 2 }}>
      {isSubmitting && <Loading />}
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
        {isEdit && (
          <Button onClick={onSubmit} disabled={isSubmitting}>
            Save
          </Button>
        )}
      </Flex>
      {days.map((day, i) => (
        <Flex key={i} flexDirection={'column'} sx={{ gap: 2 }}>
          {(timeToPass?.[i].length > 0 || isEdit) && (
            <Text as={'h4'}>{day}</Text>
          )}

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
