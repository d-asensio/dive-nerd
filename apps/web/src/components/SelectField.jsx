import FormLabel from '@mui/joy/FormLabel'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'

export function SelectField ({ label, ...rest }) {
  return <FormLabel sx={{
    gap: .5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }}>
    {label}
    <Select {...rest} />
  </FormLabel>
}
