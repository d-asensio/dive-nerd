import { formatNumber } from '../utils/formatNumber'
import TextField from '@mui/joy/TextField'

export function NumericField ({ units, value, precision = 2, ...rest }) {
  const formattedValue = formatNumber({ value, precision, units })

  return (
    <TextField
      variant='soft'
      size='sm'
      value={formattedValue}
      {...rest}
    />
  )
}
