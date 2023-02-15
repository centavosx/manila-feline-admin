import { CircularProgress } from '@mui/material'
import { Flex } from 'rebass'

export const Loading = () => {
  return (
    <Flex
      sx={{
        position: 'absolute',
        zIndex: 10000,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingTop: '50%',
        paddingLeft: '50%',
        height: '100vh',
        width: '100vw',
      }}
    >
      <CircularProgress size={40} />
    </Flex>
  )
}
