import {
  useCallback,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'

import Modal from '@mui/material/Modal'
import { Button, ButtonProps } from 'components/button'
import { AiOutlineClose } from 'react-icons/ai'
import { Flex } from 'rebass'

type ChildProps = {
  isOpen: boolean
  onSubmit: () => void
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function ButtonModal({
  className,
  sx,
  children,
  modalChild,
  onSubmit,
  width,
  height,
  onClose,
  ...props
}: ButtonProps & {
  modalChild?: (props: ChildProps) => ReactNode
  onSubmit?: () => void
  onClose?: () => void
  width?: string | number | string[] | number[]
  height?: string | number | string[] | number[]
}) {
  const [open, setOpen] = useState<boolean>(false)

  const onSubmitSuccess = useCallback(() => {
    onSubmit?.()
    setOpen(false)
  }, [onSubmit, setOpen])

  useEffect(() => {
    if (!open) onClose?.()
  }, [open])

  return (
    <>
      <Button className={className} {...props} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Flex
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: width ?? ['80%', 450],
            height: 'auto',
            maxHeight: height ?? ['80%', 'unset'],
            backgroundColor: 'white',
            border: '1px solid gray',
            borderRadius: '10px',
            boxShadow: 24,
            overflow: 'auto',
            p: 4,
            flexDirection: 'column',
          }}
        >
          <Flex sx={{ alignSelf: 'end' }}>
            <AiOutlineClose
              style={{ cursor: 'pointer' }}
              onClick={() => setOpen(false)}
            />
          </Flex>
          {open &&
            modalChild?.({ onSubmit: onSubmitSuccess, isOpen: open, setOpen })}
        </Flex>
      </Modal>
    </>
  )
}
