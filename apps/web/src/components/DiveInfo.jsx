import { useState } from 'react'

import Box from '@mui/joy/Box'
import TextField from '@mui/joy/TextField'

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker'

export const DiveInfo = () => {
  const [date, setDate] = useState(dayjs('2022-04-07'))

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          gap: 2
        }}
      >
        <Box>
          <CalendarPicker date={date}  onChange={setDate}/>
        </Box>
        <TextField
          label="Dive Number"
          size="lg"
          value='128'
        />
        <TextField
          label="Maximum Depth"
          size="lg"
          value='35.4'
          endDecorator='meters'
        />
        <TextField
          label="Average Depth"
          size="lg"
          value='10.4'
          endDecorator='meters'
        />
        <TextField
          label="Labels"
          size="lg"
        />
      </Box>
    </LocalizationProvider>
  )
}
