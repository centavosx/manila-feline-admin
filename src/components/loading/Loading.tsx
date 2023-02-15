import { CircularProgress } from '@mui/material'
import { Flex } from 'rebass'

export const Loading = () => {
  return (
    <Flex
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100000,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingTop: '50%',
        paddingLeft: '50%',
        height: '100%',
        width: '100%',
      }}
    >
      <CircularProgress size={40} />
    </Flex>
  )
}
