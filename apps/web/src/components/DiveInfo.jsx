import { useState } from 'react'
import FormLabel from '@mui/joy/FormLabel'
import Box from '@mui/joy/Box'
import TextField from '@mui/joy/TextField'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import Slider from '@mui/joy/Slider'
import FormHelperText from '@mui/joy/FormHelperText'

import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker'
import { Choice, MultipleChoiceField } from './MultipleChoiceField'
import { SelectField } from './SelectField'

function FormRow ({ children }) {
  return <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      justifyContent: 'stretch',
      gap: 2,
      width: '100%'
    }}
  >
    {children}
  </Box>
}

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
          <CalendarPicker date={date} onChange={setDate}/>
        </Box>
        <TextField
          label="Dive Number"
          size="lg"
          value="128"
        />
        <TextField
          label="Maximum Depth"
          size="lg"
          value="35.4"
          endDecorator="meters"
        />
        <TextField
          label="Average Depth"
          size="lg"
          value="10.4"
          endDecorator="meters"
        />
        <TextField
          label="Start time"
          size="lg"
          value="12:45"
        />
        <TextField
          label="End time"
          size="lg"
          value="13:45"
        />
        <TextField
          label="Total duration"
          size="lg"
          value="60:00"
          endDecorator="mins"
        />
        <TextField
          label="Bottom time"
          size="lg"
          value="12:00"
          endDecorator="mins"
        />
        <TextField
          label="Weights"
          size="lg"
          value="6"
          endDecorator="kg"
        />
        <TextField
          label="Average water temperature"
          size="lg"
          value="23"
          endDecorator="ºC"
        />
        <SelectField label='Water salinity' size="lg" defaultValue="10">
          <Option value="fresh">Fresh (1.00 kg/l)</Option>
          <Option value="brackish">Brackish (1.02 kg/l)</Option>
          <Option value="sea">Sea (1.03 kg/l)</Option>
        </SelectField>
        <MultipleChoiceField>
          <Choice value="open-water">
            Open water
          </Choice>
          <Choice value="deep">
            Deep
          </Choice>
          <Choice value="drift">
            Drift
          </Choice>
          <Choice value="wreck">
            Wreck
          </Choice>
          <Choice value="night">
            Night
          </Choice>
          <Choice value="cave">
            Cave
          </Choice>
          <Choice value="ice">
            Ice
          </Choice>
        </MultipleChoiceField>
        <SelectField label='Visibility' size="lg" defaultValue="good">
          <Option value="good">Good (+20m)</Option>
          <Option value="medium">Medium (10-20m)</Option>
          <Option value="bad">Bad (-5m)</Option>
        </SelectField>
        <FormRow>
          <SelectField
            sx={{ flex: 1, minWidth: '100%' }}
            label='Tank volume'
            size="lg"
            defaultValue="10"
          >
            <Option value="7">7 liters</Option>
            <Option value="10">10 liters</Option>
            <Option value="12">12 liters</Option>
            <Option value="15">15 liters</Option>
          </SelectField>
          <GasMixtureField
            sx={{ flex: 1 }}
            defaultValue={21}
          />
        </FormRow>
        <FormRow>
          <TextField
            sx={{ flex: 1 }}
            label="Start tank pressure"
            size="lg"
            value="200"
            endDecorator="bar"
          />
          <TextField
            sx={{ flex: 1 }}
            label="End tank pressure"
            size="lg"
            value="50"
            endDecorator="bar"
          />
        </FormRow>
        <TextField
          label="SAC Rate"
          size="lg"
          value="12"
          endDecorator="l/min"
          readOnly
        />
      </Box>
    </LocalizationProvider>
  )
}

function GasMixtureField ({ sx, defaultValue }) {
  const [value, setValue] = useState(defaultValue)

  return <FormLabel
    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    Gas mixture
    <Box sx={{ width: '100%', ...sx }}>
      <Slider
        sx={{
          '--Slider-size': 'max(30px, max(var(--Slider-thumb-size), var(--Slider-track-size)))'
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        defaultValue={defaultValue}
        step={1}
      />
    </Box>
    <FormHelperText>{value}% O2 | {100 - value}% N2</FormHelperText>
  </FormLabel>
}
