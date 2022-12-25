import { Button as ButtonComponent, ButtonProps as Props } from '@mui/material'
import styled from '@emotion/styled'

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
    background-color: ${({ backgroundcolor }) => backgroundcolor ?? '#f7efe3'};
    color: ${({ textcolor }) => textcolor ?? '#3f352c'};

    :hover {
      background-color: ${({ hovercolor }) => hovercolor ?? '#e1d3c2'};
      color: ${({ hovertextcolor }) => hovertextcolor ?? '#3f352c'};
    }
    :active {
      background-color: ${({ activecolor }) => activecolor ?? '#b4a79e'};
      color: ${({ activetextcolor }) => activetextcolor ?? '#3f352c'};
    }

    ${({ custom }) => custom}
  }
`
