import { useState, useEffect, useCallback } from 'react'
import { Flex, Text } from 'rebass'
import { Button } from 'components/button'
import { getAllService } from 'api/service.api'

import { useApi } from 'hooks'
import { Option, Select as SelectService } from 'components/select'
import { Services as UserService } from 'entities'
import { addUserService, removeService } from 'api'
import { useRouter } from 'next/router'
import { Loading } from 'components/loading'

const AddService = ({
  onSubmit,
  service,
  disabled,
}: {
  onSubmit: (id?: string, callback?: () => void) => void
  service: UserService[]
  disabled: boolean
}) => {
  const { data } = useApi(async () => await getAllService())
  const [isAddService, setIsAddService] = useState<boolean>(false)
  const [value, setValue] = useState<Option>()

  useEffect(() => {
    setValue(undefined)
  }, [isAddService, setValue])

  const isInArrayOfService = useCallback(
    (d: UserService) => {
      return service.some((s) => s.id === d.id)
    },
    [service]
  )

  return (
    <Flex flexDirection={'column'} sx={{ gap: 10 }}>
      <Flex sx={{ gap: 10 }}>
        <Button
          backgroundcolor={isAddService ? 'red' : undefined}
          textcolor={isAddService ? 'white' : undefined}
          hovercolor={isAddService ? '#B22222' : undefined}
          activecolor={isAddService ? '#FF2400' : undefined}
          hovertextcolor={isAddService ? 'white' : undefined}
          activetextcolor={isAddService ? 'white' : undefined}
          onClick={() => setIsAddService((d) => !d)}
          style={{ width: 120 }}
        >
          {!isAddService ? 'Add Service' : 'Cancel'}
        </Button>
        {isAddService && (
          <Button
            onClick={() =>
              onSubmit(value?.value, () => {
                setIsAddService(false)
              })
            }
            style={{ width: 120 }}
            disabled={disabled}
          >
            Save
          </Button>
        )}
      </Flex>
      {isAddService && (
        <SelectService
          className="basic-single"
          classNamePrefix="select"
          isSearchable={true}
          name="color"
          options={data?.data
            ?.filter((d: UserService) => !isInArrayOfService(d))
            .map((d: UserService) => ({
              label: d.name,
              value: d.id,
            }))}
          value={value}
          onChange={(v) => setValue(v as Option)}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,

              primary25: '#f7efe3',
              primary: '#3f352c',
            },
          })}
        />
      )}
    </Flex>
  )
}

export const Services = ({
  id,
  service,
  refetch,
}: {
  id: string
  service: UserService[]
  refetch: () => void
}) => {
  const [submitting, setSubmitting] = useState(false)
  const submitService = useCallback(
    async (sId?: string, callback?: () => void) => {
      setSubmitting(true)
      addUserService(id, sId ?? '').finally(() => {
        setSubmitting(false)
        refetch()
        callback?.()
      })
    },
    [refetch, id, setSubmitting]
  )

  const deleteService = useCallback(
    async (sId?: string, callback?: () => void) => {
      setSubmitting(true)
      removeService(id, sId ?? '').finally(() => {
        setSubmitting(false)
        refetch()
        callback?.()
      })
    },
    [refetch, id, setSubmitting]
  )

  return (
    <Flex flexDirection={'column'} sx={{ gap: 2 }} mt={20} mb={20}>
      {submitting && <Loading />}
      <Flex flexDirection={['column', 'row']}>
        <Text flex={1} as={'h3'}>
          Services
        </Text>
      </Flex>
      {service.map((d, k) => (
        <Text
          key={d.name}
          as={'h4'}
          flex={1}
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
        >
          <Text flex={1}>
            {k + 1}. {d.name}
          </Text>
          <Button
            backgroundcolor={'red'}
            textcolor={'white'}
            hovercolor={'#B22222'}
            activecolor={'#FF2400'}
            hovertextcolor={'white'}
            activetextcolor={'white'}
            style={{ width: 80 }}
            onClick={() => deleteService(d.id)}
            disabled={submitting}
          >
            Remove
          </Button>
        </Text>
      ))}
      <AddService
        onSubmit={submitService}
        service={service}
        disabled={submitting}
      />
    </Flex>
  )
}
