import {
  useState,
  useCallback,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import { Checkbox, TableHead } from '@mui/material'
import { Button } from 'rebass'

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page == 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page == 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}

type TableProps = {
  dataRow: any[]
  dataCols: { field: string; name: string; isNumber?: boolean }[]
  isCheckboxEnabled?: boolean
  rowIdentifierField: string
  page: number
  pageSize: number
  total: number
  handleChangeRowsPerPage?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleChangePage?: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void
  onRowClick?: (data: any) => void
  children:
    | ((
        selected: any[],
        setSelected: Dispatch<SetStateAction<any[]>>
      ) => ReactNode)
    | ReactNode
}

export function CustomTable({
  dataRow,
  dataCols,
  isCheckboxEnabled,
  rowIdentifierField,
  page,
  pageSize,
  total,
  handleChangeRowsPerPage,
  handleChangePage,
  onRowClick,
  children,
}: TableProps) {
  const [selected, setSelected] = useState<any[]>([])

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelected(dataRow.map((d) => d[rowIdentifierField]))
        return
      }
      setSelected([])
    },
    [setSelected, dataRow, rowIdentifierField]
  )

  const handleCheckClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, data: any) => {
      if (event.target.checked) {
        return setSelected((d) => [...d, data])
      }
      return setSelected((d) => d.filter((v) => v !== data))
    },
    [setSelected]
  )

  return (
    <TableContainer component={Paper}>
      {typeof children === 'function'
        ? children(selected, setSelected)
        : children}
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            {isCheckboxEnabled && (
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={
                    selected.length > 0
                      ? selected.length === dataRow.length
                      : false
                  }
                  onChange={handleSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all desserts',
                  }}
                />
              </TableCell>
            )}
            {dataCols.map((head) => (
              <TableCell
                key={head.field}
                align={head.isNumber ? 'right' : 'left'}
              >
                {head.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataRow.map((row, i) => (
            <TableRow key={i} hover={true} onClick={() => onRowClick?.(row)}>
              {isCheckboxEnabled && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selected.includes(row[rowIdentifierField])}
                    onChange={(e) =>
                      handleCheckClick(e, row[rowIdentifierField])
                    }
                    inputProps={{
                      'aria-label': 'select all desserts',
                    }}
                  />
                </TableCell>
              )}
              {dataCols.map((d, k) => (
                <TableCell key={k} component="th" scope="row">
                  {row[d.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[1, 20, 50, 100]}
              count={total}
              rowsPerPage={pageSize}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={(e, p) => handleChangePage?.(e, p)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
