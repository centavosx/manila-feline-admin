import { CircularProgress, InputAdornment } from '@mui/material'

import { Button } from 'components/button'
import { FormContainer } from 'components/forms'
import { FormInput } from 'components/input'
import { Text } from 'components/text'

import { Formik, FormikHelpers, FormikValues } from 'formik'
import { useState, useCallback, Dispatch, SetStateAction } from 'react'
import { Flex } from 'rebass'
import { theme } from 'utils/theme'
import ButtonModal from './Modal'

type InputFieldProp = {
  field: string
  type?: string
  label: string
  placeHolder: string
  important?: {
    onSearch: (val: string) => Promise<any>
  }
}

export type ModalFlexProps = {
  onSubmit: (
    values: any,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>

  modalText: string
  fields?: InputFieldProp[]
  initial?: any
  availableText?: string
  validationSchema?: any
  isError?: boolean
}

export const CreateModalFlex = ({
  onSubmit,
  validationSchema,
  modalText,
  fields,
  initial,
  availableText,
  isError,
}: ModalFlexProps) => {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  type Initial = ReturnType<typeof initial>

  const onSearch = useCallback(
    async (
      event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
      onChange: (val: string) => void,
      onChangeValue?: (val: string) => Promise<any>
    ) => {
      if (!isSearching) {
        setIsSearching(true)
        onChangeValue?.(event.target.value)
          .then(() => setIsAvailable(true))
          .catch(() => setIsAvailable(false))
          .finally(() => setIsSearching(false))
      }
      onChange(event.target.value)
    },
    [setIsAvailable, setIsSearching, isSearching]
  )

  return (
    <Formik<Initial>
      initialValues={initial}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ isSubmitting, values, handleChange, submitForm, errors }) => (
        <FormContainer
          label={modalText}
          flexProps={{
            sx: { gap: 10 },
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            padding: 20,
            width: '100%',
          }}
        >
          <Flex
            sx={{
              gap: [10],
              flexDirection: 'column',
              width: '100%',
              alignSelf: 'center',
            }}
          >
            {[fields?.find((d) => !!d.important)].map((d, key) => (
              <FormInput
                key={key}
                name={d?.field!}
                label={d?.label!}
                variant="filled"
                type={d?.type}
                inputcolor={{
                  labelColor: 'gray',
                  backgroundColor: 'white',
                  borderBottomColor: theme.mainColors.first,
                  color: 'black',
                }}
                sx={{ color: 'black', width: '100%' }}
                placeholder={d?.placeHolder}
                value={
                  !!d?.field
                    ? values?.[d.field as unknown as string]
                    : undefined
                }
                onChange={(e) =>
                  onSearch(e, handleChange(d?.field!), d?.important?.onSearch)
                }
                InputProps={{
                  endAdornment: isSearching && (
                    <InputAdornment position="end">
                      <CircularProgress size={24} />
                    </InputAdornment>
                  ),
                }}
              />
            ))}

            {!isAvailable ? (
              <>
                {fields
                  ?.filter((d) => !d.important)
                  .map((d, i) => (
                    <FormInput
                      key={i}
                      type={d.type}
                      name={d.field}
                      label={d.label}
                      placeholder={d.placeHolder}
                      variant="filled"
                      inputcolor={{
                        labelColor: 'gray',
                        backgroundColor: 'white',
                        borderBottomColor: theme.mainColors.first,
                        color: 'black',
                      }}
                      sx={{ color: 'black', width: '100%' }}
                    />
                  ))}
              </>
            ) : (
              <Text sx={{ color: isError ? 'red' : 'green' }}>
                {availableText}
              </Text>
            )}
          </Flex>

          <Flex width={'100%'} justifyContent={'center'} mt={[10, 20, 30]}>
            <ButtonModal
              backgroundcolor={theme.mainColors.eight}
              activecolor={theme.colors.verylight}
              hovercolor={theme.mainColors.second}
              textcolor={theme.colors.verylight}
              disabled={
                Object.keys(errors).length > 0 ||
                isSubmitting ||
                isSearching ||
                (isError ? isAvailable : undefined)
              }
              style={{ width: '200px' }}
              modalChild={({ onSubmit, setOpen }) => {
                return (
                  <AreYouSure
                    cancelText="No"
                    confirmText="Yes"
                    onSubmit={() => {
                      onSubmit()
                    }}
                    setOpen={setOpen}
                  />
                )
              }}
              onSubmit={async () => await submitForm()}
            >
              Submit
            </ButtonModal>
          </Flex>
        </FormContainer>
      )}
    </Formik>
  )
}

type Props = {
  refetch: () => void

  selected: any[]
  setSelected: Dispatch<SetStateAction<any[]>>
  modalText: string
}

export const AreYouSure = ({
  setOpen,
  onSubmit,
  cancelText,
  confirmText,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
  onSubmit: () => void
  cancelText: string
  confirmText: string
}) => {
  return (
    <Flex
      sx={{ gap: 10 }}
      justifyContent={'center'}
      alignItems="center"
      flexDirection="column"
    >
      <Text
        width={'100%'}
        textAlign={'center'}
        sx={{
          fontSize: 24,
          color: 'black',
          fontWeight: 'bold',
        }}
      >
        Are you sure?
      </Text>
      <Flex sx={{ gap: 10 }}>
        <Button
          style={{ padding: 12 }}
          backgroundcolor="red"
          textcolor="white"
          hovercolor="#B22222"
          activecolor="#FF2400"
          hovertextcolor="white"
          activetextcolor="white"
          onClick={() => setOpen(false)}
        >
          {cancelText}
        </Button>
        <Button style={{ padding: 12 }} onClick={onSubmit}>
          {confirmText}
        </Button>
      </Flex>
    </Flex>
  )
}

export const ConfirmationModal = ({
  refetch,

  selected,
  setSelected,
  modalCreate: { onSubmit: modalSubmit, ...others },
  onRemove,
}: Props & { modalCreate: ModalFlexProps; onRemove: () => Promise<void> }) => {
  return (
    <Flex p={10} alignItems={'end'} width={'100%'} sx={{ gap: 10 }}>
      <ButtonModal
        style={{ alignSelf: 'end' }}
        modalChild={({ onSubmit }) => {
          return (
            <CreateModalFlex
              onSubmit={async (values, helpers) => {
                await modalSubmit?.(values, helpers)
                onSubmit()
              }}
              {...others}
            />
          )
        }}
        onSubmit={refetch}
      >
        Add
      </ButtonModal>
      {selected.length > 0 && (
        <ButtonModal
          backgroundcolor="red"
          textcolor="white"
          hovercolor="#B22222"
          activecolor="#FF2400"
          hovertextcolor="white"
          activetextcolor="white"
          modalChild={({ onSubmit, setOpen }) => {
            return (
              <AreYouSure
                cancelText="Cancel"
                confirmText="Remove"
                onSubmit={() => {
                  onRemove().finally(() => {
                    setSelected([])
                    onSubmit()
                  })
                }}
                setOpen={setOpen}
              />
            )
          }}
          onSubmit={refetch}
        >
          Remove access
        </ButtonModal>
      )}
    </Flex>
  )
}
