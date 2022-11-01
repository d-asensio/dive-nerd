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
import { MultipleChoiceField } from './MultipleChoiceField'

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
        <FormLabel sx={{
          gap: .5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          Water salinity
          <Select size="lg" defaultValue="sea">
            <Option value="fresh">Fresh (1.00 kg/l)</Option>
            <Option value="brackish">Brackish (1.02 kg/l)</Option>
            <Option value="sea">Sea (1.03 kg/l)</Option>
          </Select>
        </FormLabel>
        <MultipleChoiceField>
          <MultipleChoiceField.Choice value="open-water">
            Open water
          </MultipleChoiceField.Choice>
          <MultipleChoiceField.Choice value="deep">
            Deep
          </MultipleChoiceField.Choice>
          <MultipleChoiceField.Choice value="drift">
            Drift
          </MultipleChoiceField.Choice>
          <MultipleChoiceField.Choice value="wreck">
            Wreck
          </MultipleChoiceField.Choice>
          <MultipleChoiceField.Choice value="night">
            Night
          </MultipleChoiceField.Choice>
          <MultipleChoiceField.Choice value="cave">
            Cave
          </MultipleChoiceField.Choice>
          <MultipleChoiceField.Choice value="ice">
            Ice
          </MultipleChoiceField.Choice>
        </MultipleChoiceField>
        <FormLabel sx={{
          gap: .5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          Visibility
          <Select size="lg" defaultValue="good">
            <Option value="good">Good (+20m)</Option>
            <Option value="medium">Medium (10-20m)</Option>
            <Option value="bad">Bad (-5m)</Option>
          </Select>
        </FormLabel>
        <FormLabel sx={{
          gap: .5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          Tank volume
          <Select label="Tank volume" size="lg" defaultValue="10">
            <Option value="7">7 liters</Option>
            <Option value="10">10 liters</Option>
            <Option value="12">12 liters</Option>
            <Option value="15">15 liters</Option>
          </Select>
        </FormLabel>
        <TextField
          label="Start tank pressure"
          size="lg"
          value="200"
          endDecorator="bar"
        />
        <TextField
          label="End tank pressure"
          size="lg"
          value="50"
          endDecorator="bar"
        />
        <TextField
          label="SAC Rate"
          size="lg"
          value="12"
          endDecorator="l/min"
          readOnly
        />
        <GasMixtureField defaultValue={21}/>
      </Box>
    </LocalizationProvider>
  )
}

function GasMixtureField ({ defaultValue }) {
  const [value, setValue] = useState(defaultValue)

  return <FormLabel
    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    Gas mixture
    <Box sx={{ width: 300 }}>
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
