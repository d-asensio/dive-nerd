import { formatTimeMinutes } from '../utils/formatTime'
import TextField from '@mui/joy/TextField'

export function TimeField ({ value, ...rest }) {
  const formattedValue = typeof value === 'number' ? `${formatTimeMinutes(value)} min` : ''

  return (
    <TextField
      variant='soft'
      size='sm'
      value={formattedValue}
      {...rest}
    />
  )
}
