import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { createTheme } from '@mui/material'
import { Main } from '../components/main'

const theme = createTheme()
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Main isLink={true}>
        <Component {...pageProps} />
      </Main>
    </ThemeProvider>
  )
}
