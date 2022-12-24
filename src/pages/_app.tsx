import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { createTheme } from '@mui/material'
import { Main } from '../components/main'
import { useRouter } from 'next/router'
import { DataProvider } from 'contexts'
import { PageProvider } from 'contexts/page.context'

const theme = createTheme()
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        <PageProvider>
          <Component {...pageProps} />
        </PageProvider>
      </DataProvider>
    </ThemeProvider>
  )
}
