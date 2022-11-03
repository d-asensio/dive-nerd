import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker'

export function DatePicker (props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CalendarPicker
        date={props.date}
        onChange={props.onChange}
      />
    </LocalizationProvider>
  )
}
