import { Children, useState } from 'react'
import FormLabel from '@mui/joy/FormLabel'
import Box from '@mui/joy/Box'
import TextField from '@mui/joy/TextField'
import Option from '@mui/joy/Option'
import Slider from '@mui/joy/Slider'
import FormHelperText from '@mui/joy/FormHelperText'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker'
import { Choice, MultipleChoiceField } from './MultipleChoiceField'
import { SelectField } from './SelectField'
import IconButton from '@mui/joy/IconButton'
import Tooltip from '@mui/joy/Tooltip'
import { Divider } from '@mui/joy'
import Typography from '@mui/joy/Typography'

function FieldsRow ({ children, columns }) {
  return <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: columns || `repeat(${Children.count(children)}, 1fr)`,
      gap: 2,
      mb: 2,
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
        <FieldsRow columns='1fr 3fr'>
          <TextField
            sx={{ minWidth: 0 }}
            label="Dive Number"
            size="lg"
            value="128"
          />
          <TextField
            sx={{ minWidth: 0 }}
            label="Date"
            size="lg"
            value="Tuesday, November 1, 2022"
            endDecorator={
              <Tooltip
                placement="top-end"
                variant="outlined"
                arrow
                title={
                  <CalendarPicker
                    sx={{ width: '100%' }}
                    date={date}
                    onChange={setDate}
                  />
                }
              >
                <IconButton variant="plain">
                  <CalendarMonthIcon />
                </IconButton>
              </Tooltip>
            }
          />
        </FieldsRow>
        <MultipleChoiceField label="Dive type">
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
        <Divider sx={{ '--Divider-childPosition': `0%` }}>
          <Typography level='h5'>Time</Typography>
        </Divider>
        <FieldsRow>
          <TextField
            sx={{ minWidth: 0 }}
            label="Total duration"
            size="lg"
            value="60:00"
            endDecorator="mins"
          />
          <TextField
            sx={{ minWidth: 0 }}
            label="Bottom time"
            size="lg"
            value="12:00"
            endDecorator="mins"
          />
        </FieldsRow>
        <FieldsRow>
          <TextField
            label="Start time"
            size="lg"
            value="12:45 PM"
          />
          <TextField
            label="End time"
            size="lg"
            value="01:45 PM"
          />
        </FieldsRow>
        <Divider sx={{ '--Divider-childPosition': `0%` }}>
          <Typography level='h5'>Depth</Typography>
        </Divider>
        <FieldsRow>
          <TextField
            sx={{ minWidth: 0 }}
            label="Maximum Depth"
            size="lg"
            value="35.4"
            endDecorator="meters"
          />
          <TextField
            sx={{ minWidth: 0 }}
            label="Average Depth"
            size="lg"
            value="10.4"
            endDecorator="meters"
          />
        </FieldsRow>
        <Divider sx={{ '--Divider-childPosition': `0%` }}>
          <Typography level='h5'>Water</Typography>
        </Divider>
        <FieldsRow>
          <TextField
            sx={{ minWidth: 0 }}
            label="Average temperature"
            size="lg"
            value="23"
            endDecorator="ºC"
          />
          <SelectField
            sx={{ minWidth: '100%' }}
            label="Salinity"
            size="lg"
            defaultValue="sea"
          >
            <Option value="fresh">Fresh (1.00 kg/l)</Option>
            <Option value="brackish">Brackish (1.02 kg/l)</Option>
            <Option value="sea">Sea (1.03 kg/l)</Option>
          </SelectField>
          <SelectField
            sx={{ minWidth: '100%' }}
            label="Visibility"
            size="lg"
            defaultValue="good"
          >
            <Option value="good">Good (+20m)</Option>
            <Option value="medium">Medium (10-20m)</Option>
            <Option value="bad">Bad (-5m)</Option>
          </SelectField>
        </FieldsRow>
        <Divider sx={{ '--Divider-childPosition': `0%` }}>
          <Typography level='h5'>Gear</Typography>
        </Divider>
        <TextField
          label="Weights"
          size="lg"
          value="6"
          endDecorator="kg"
        />
        <Divider sx={{ '--Divider-childPosition': `0%` }}>
          <Typography level='h5'>Gas</Typography>
        </Divider>
        <FieldsRow>
          <SelectField
            sx={{ minWidth: '100%' }}
            label="Tank volume"
            size="lg"
            defaultValue="10-liters"
          >
            <Option value="7-liters">7 liters</Option>
            <Option value="10-liters">10 liters</Option>
            <Option value="12-liters">12 liters</Option>
            <Option value="15-liters">15 liters</Option>
          </SelectField>
          <GasMixtureField
            defaultValue={21}
          />
        </FieldsRow>
        <FieldsRow>
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
        </FieldsRow>
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
