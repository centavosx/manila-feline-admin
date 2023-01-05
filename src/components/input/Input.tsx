import {
  CircularProgress,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { de } from 'date-fns/locale'
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react'
import { theme } from 'utils/theme'
import { FormInput } from './FormInput'

export type InputColor = {
  inputcolor?: {
    backgroundColor?: string
    labelColor?: string
    color?: string
    borderBottomColor?: string
    hover?: {
      backgroundColor?: string
      labelColor?: string
      color?: string
    }
  }
}

const TextInput = ({
  sx,
  children,
  padding,
  ...other
}: TextFieldProps & InputColor & { padding?: number }) => {
  return <TextField sx={{ width: '100%', ...sx }} {...other} />
}
export const Input = styled(TextInput)(({ inputcolor, padding }) => ({
  borderRadius: 4,
  backgroundColor: inputcolor?.backgroundColor,
  '& label.Mui-focused': {
    color: inputcolor?.labelColor,
  },

  '& .MuiOutlinedInput-root': {
    color: inputcolor?.color,
    padding: padding ?? 1,
    '& fieldset': {
      borderColor: inputcolor?.labelColor,
    },
    '&:hover': {
      color: inputcolor?.hover?.color,
    },
    '&:hover fieldset': {
      borderColor: inputcolor?.hover?.labelColor,
    },
    '&.Mui-focused fieldset': {
      borderColor: inputcolor?.labelColor,
    },
  },
  '& .MuiInputBase-root:after': {
    borderBottomColor: inputcolor?.borderBottomColor,
  },
}))

export const SearchableInput = ({
  key,
  value,
  label,
  type,
  placeHolder,
  isSearching,
  onSearch,
  onChange,
}: {
  key?: any

  label?: string
  type?: string
  value?: string
  placeHolder?: string
  isSearching?: boolean

  onSearch?: (val?: string | undefined) => Promise<void>
  onChange:
    | ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
    | undefined
}) => {
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch?.(value)
    }, 500)
    return () => clearTimeout(delay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <Input
      key={key}
      label={label}
      variant="filled"
      type={type}
      inputcolor={{
        labelColor: 'gray',
        backgroundColor: 'white',
        borderBottomColor: theme.mainColors.first,
        color: 'black',
      }}
      sx={{ color: 'black', width: '100%' }}
      placeholder={placeHolder}
      onChange={onChange}
      value={value}
      InputProps={{
        endAdornment: isSearching && (
          <InputAdornment position="end">
            <CircularProgress size={24} />
          </InputAdornment>
        ),
      }}
    />
  )
}
