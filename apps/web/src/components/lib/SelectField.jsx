import FormLabel from '@mui/joy/FormLabel'
import Select from '@mui/joy/Select'

export function SelectField ({ label, ...rest }) {
  return (
    <FormLabel sx={{
      gap: 0.5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}
    >
      {label}
      <Select {...rest} />
    </FormLabel>
  )
}
