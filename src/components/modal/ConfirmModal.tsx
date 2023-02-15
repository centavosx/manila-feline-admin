import { CircularProgress, InputAdornment } from '@mui/material'
import React, { ReactElement } from 'react'
import { Button } from 'components/button'
import { FormContainer } from 'components/forms'
import { FormInput, SearchableInput } from 'components/input'
import { Text } from 'components/text'

import { Formik, FormikHelpers, FormikValues } from 'formik'
import { useState, useCallback, Dispatch, SetStateAction } from 'react'
import { Flex } from 'rebass'
import { theme } from 'utils/theme'
import ButtonModal from './Modal'

type InputFieldProp = {
  field: string
  type?: string
  label?: string
  placeHolder?: string
  important?: {
    onSearch: (val: string) => Promise<any>
  }
  custom?: {
    Jsx: React.FC<any>
  }
}

export type ModalFlexProps = {
  onSubmit: (
    values: any,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>

  modalText?: string
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

  const onSearch =
    (onChangeValue?: (val: string) => Promise<any>) => async (val?: string) => {
      if (!isSearching) {
        setIsSearching(true)
        onChangeValue?.(val ?? '')
          .then(() => setIsAvailable(true))
          .catch(() => setIsAvailable(false))
          .finally(() => setIsSearching(false))
      }
    }

  return (
    <Formik<Initial>
      initialValues={initial}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({
        isSubmitting,
        values,
        handleChange,
        submitForm,
        errors,
        setFieldError,
        ...other
      }) => (
        <FormContainer
          label={modalText}
          flexProps={{
            sx: { gap: 10 },
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            padding: 20,
            width: '100%',
            height: '100%',
          }}
        >
          <Flex
            sx={{
              gap: [10],
              flexDirection: 'column',
              width: '100%',
              alignSelf: 'center',
              overflow: 'auto',
            }}
          >
            {[fields?.find((d) => !!d.important)].map(
              (d, key) =>
                !!d && (
                  <SearchableInput
                    key={key}
                    label={d?.label!}
                    type={d?.type}
                    value={
                      !!d?.field
                        ? values?.[d.field as unknown as string]
                        : undefined
                    }
                    placeHolder={d?.placeHolder}
                    onSearch={onSearch(d?.important?.onSearch)}
                    onChange={(e) => handleChange(d?.field!)(e.target.value)}
                  />
                )
            )}

            {!isAvailable ? (
              <>
                {fields
                  ?.filter((d) => !d.important)
                  .map((d, i) =>
                    !!d.custom ? (
                      <d.custom.Jsx
                        key={i}
                        onChange={handleChange(d.field)}
                        error={errors[d.field]}
                      />
                    ) : (
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
                    )
                  )}
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
                Object.keys(errors)?.some((v) =>
                  isAvailable && v === 'password' ? false : !!v
                ) ||
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
              onSubmit={async () => {
                if (isAvailable)
                  return await onSubmit(values, {
                    ...(other as unknown as FormikHelpers<any>),
                  })
                return await submitForm()
              }}
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
  modalText?: string
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
  modalCreate,
  onRemove,
}: Props & { modalCreate?: ModalFlexProps; onRemove: () => Promise<void> }) => {
  const { onSubmit: modalSubmit, ...others } = modalCreate ?? {
    onSubmit: undefined,
  }
  return (
    <Flex p={10} alignItems={'end'} width={'100%'} sx={{ gap: 10 }}>
      {!!modalCreate && (
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
      )}
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
          Remove
        </ButtonModal>
      )}
    </Flex>
  )
}
