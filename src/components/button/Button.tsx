import { Button as ButtonComponent, ButtonProps as Props } from '@mui/material'
import styled from '@emotion/styled'
import { theme } from 'utils/theme'

export type ButtonProps = {
  backgroundcolor?: string
  activecolor?: string
  hovercolor?: string
  textcolor?: string
  hovertextcolor?: string
  activetextcolor?: string
  custom?: any
} & Props

const StyledButton = ({ className, sx, ...props }: ButtonProps) => {
  return (
    <ButtonComponent className={className} {...props}>
      {props?.children}
    </ButtonComponent>
  )
}
export const Button = styled(StyledButton)`
  && {
    font-weight: bold;
    background-color: ${({ backgroundcolor }) =>
      backgroundcolor ?? theme.colors.blackgray};
    color: ${({ textcolor }) => textcolor ?? theme.colors.pink};
    :disabled {
      background-color: gray;
      color: white;
    }
    :hover {
      background-color: ${({ hovercolor }) => hovercolor ?? '#7A7A7A'};
      color: ${({ hovertextcolor }) => hovertextcolor ?? 'pink'};
    }
    :active {
      background-color: ${({ activecolor }) => activecolor ?? '#707070'};
      color: ${({ activetextcolor }) => activetextcolor ?? 'pink'};
    }

    ${({ custom }) => custom}
  }
`
