import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { createTheme } from '@mui/material'
import { DataProvider } from 'contexts'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { Router } from 'next/router'
import { Main } from 'components/main'

const theme = createTheme()

NProgress.configure({ showSpinner: false })

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Router.events.on('routeChangeStart', (url) => {
      NProgress.start()
    })

    Router.events.on('routeChangeComplete', (url) => {
      NProgress.done(false)
    })
  }, [Router])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => NProgress.start())
      return () => {
        window.removeEventListener('beforeunload', () => NProgress.done(false))
      }
    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        <Main isLink={true}>
          <Component {...pageProps} />
        </Main>
      </DataProvider>
    </ThemeProvider>
  )
}
