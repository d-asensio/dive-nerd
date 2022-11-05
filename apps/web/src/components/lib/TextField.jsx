import JoyTextField from '@mui/joy/TextField'

export function TextField ({ sx, ...rest }) {
  return <JoyTextField {...rest} sx={{ minWidth: 0, ...sx }} />
}
