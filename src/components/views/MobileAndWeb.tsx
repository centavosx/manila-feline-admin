import styled from '@emotion/styled'
import mediaQueries from './media'

export const WebView = styled.div`
  display: block;
  width: 100%;

  ${mediaQueries.tablet`
    display:none;
  `};
`

export const MobileView = styled.div`
  display: none;
  ${mediaQueries.tablet`
    display:block;
  `}
`
