import { useState } from 'react'
import FormLabel from '@mui/joy/FormLabel'
import Box from '@mui/joy/Box'
import Option from '@mui/joy/Option'
import Slider from '@mui/joy/Slider'
import FormHelperText from '@mui/joy/FormHelperText'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import dayjs from 'dayjs'
import { Choice, MultipleChoiceField } from './lib/MultipleChoiceField'
import { SelectField } from './lib/SelectField'
import IconButton from '@mui/joy/IconButton'
import Tooltip from '@mui/joy/Tooltip'
import Typography from '@mui/joy/Typography'

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import WaterIcon from '@mui/icons-material/Water'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Co2Icon from '@mui/icons-material/Co2'

import { Unit } from './lib/Unit'
import { Accordion } from './lib/Accordion'
import { SingleChoiceField } from './lib/SingleChoiceField'
import { DatePicker } from './lib/DatePicker'
import { TextField } from './lib/TextField'
import { FieldsRow } from './lib/FieldsRow'

function Section ({ title, children }) {
  const [expanded, setExpanded] = useState(true)
  return (
    <Accordion
      expanded={expanded}
      onChange={(_, newExpanded) => setExpanded(newExpanded)}
    >
      <Accordion.Summary aria-controls='panel1d-content' id='panel1d-header'>
        <Typography>{title}</Typography>
      </Accordion.Summary>
      <Accordion.Details>
        <Typography>
          {children}
        </Typography>
      </Accordion.Details>
    </Accordion>
  )
}

export const DiveInfo = () => {
  const [date, setDate] = useState(dayjs('2022-04-07'))

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start'
      }}
    >
      <Box sx={{ p: 2 }}>
        <FieldsRow columns='1fr 2fr'>
          <TextField
            label='Dive Number'
            size='lg'
            value='128'
          />
          <TextField
            label='Date'
            size='lg'
            value='Tuesday, November 1, 2022'
            endDecorator={
              <Tooltip
                placement='top-end'
                variant='outlined'
                arrow
                title={
                  <DatePicker date={date} onChange={setDate} />
                }
              >
                <IconButton variant='plain'>
                  <CalendarMonthIcon />
                </IconButton>
              </Tooltip>
            }
          />
        </FieldsRow>
        <MultipleChoiceField label='Dive type'>
          <Choice value='open-water'>
            Open water
          </Choice>
          <Choice value='deep'>
            Deep
          </Choice>
          <Choice value='drift'>
            Drift
          </Choice>
          <Choice value='wreck'>
            Wreck
          </Choice>
          <Choice value='night'>
            Night
          </Choice>
          <Choice value='cave'>
            Cave
          </Choice>
          <Choice value='ice'>
            Ice
          </Choice>
        </MultipleChoiceField>
      </Box>
      <Section
        title={
          <Typography
            level='h5'
            startDecorator={<AccessTimeFilledIcon />}
          >
            Time
          </Typography>
        }
      >
        <FieldsRow>
          <TextField
            label='Total duration'
            size='lg'
            value='60:00'
            endDecorator={
              <Unit name='Meters' symbol='m' />
            }
          />
          <TextField
            label='Bottom time'
            size='lg'
            value='12:00'
            endDecorator={
              <Unit name='Meters' symbol='m' />
            }
          />
        </FieldsRow>
        <FieldsRow>
          <TextField
            label='Start time'
            size='lg'
            value='12:45 PM'
          />
          <TextField
            label='End time'
            size='lg'
            value='01:45 PM'
          />
        </FieldsRow>
      </Section>
      <Section
        title={
          <Typography
            level='h5'
            startDecorator={<ArrowDownwardIcon />}
          >
            Depth
          </Typography>
        }
      >
        <FieldsRow>
          <TextField
            label='Maximum Depth'
            size='lg'
            value='35.4'
            endDecorator={
              <Unit name='Meters' symbol='m' />
            }
          />
          <TextField
            label='Average Depth'
            size='lg'
            value='10.4'
            endDecorator={
              <Unit name='Meters' symbol='m' />
            }
          />
        </FieldsRow>
      </Section>
      <Section
        title={
          <Typography
            level='h5'
            startDecorator={<WaterIcon />}
          >
            Water
          </Typography>
        }
      >
        <FieldsRow>
          <SelectField
            sx={{ minWidth: '100%' }}
            label='Visibility'
            size='lg'
            defaultValue='good'
          >
            <Option value='good'>Good (+20m)</Option>
            <Option value='medium'>Medium (10-20m)</Option>
            <Option value='bad'>Bad (-5m)</Option>
          </SelectField>
        </FieldsRow>
        <FieldsRow>
          <TextField
            label='Average temperature'
            size='lg'
            value='23'
            endDecorator={
              <Unit name='Degrees Celsius' symbol='ºC' />
            }
          />
          <SelectField
            sx={{ minWidth: 0, width: '100%' }}
            label='Salinity'
            size='lg'
            defaultValue='sea'
          >
            <Option value='fresh'>Fresh (1.00 kg/l)</Option>
            <Option value='brackish'>Brackish (1.02 kg/l)</Option>
            <Option value='sea'>Sea (1.03 kg/l)</Option>
          </SelectField>
        </FieldsRow>
      </Section>
      <Section
        title={
          <Typography
            level='h5'
            startDecorator={<ManageAccountsIcon />}
          >
            Gear
          </Typography>
        }
      >
        <TextField
          label='Weights'
          size='lg'
          value='6'
          endDecorator={
            <Unit name='Kilograms' symbol='kg' />
          }
        />
      </Section>
      <Section
        title={
          <Typography
            level='h5'
            startDecorator={<Co2Icon />}
          >
            Gas
          </Typography>
        }
      >
        <SingleChoiceField>
          <SingleChoiceField.Item id='air' value='air'>
            Air
          </SingleChoiceField.Item>
          <SingleChoiceField.Item id='nitrox' value='nitrox'>
            Nitrox
          </SingleChoiceField.Item>
          <SingleChoiceField.Item id='trimix' value='trimix'>
            Trimix
          </SingleChoiceField.Item>
          <SingleChoiceField.Item id='heliox' value='heliox'>
            Heliox
          </SingleChoiceField.Item>
        </SingleChoiceField>
        <FieldsRow>
          <SelectField
            sx={{ minWidth: 0, width: '100%' }}
            label='Tank volume'
            size='lg'
            defaultValue='10-liters'
          >
            <Option value='7-liters'>7 liters</Option>
            <Option value='10-liters'>10 liters</Option>
            <Option value='12-liters'>12 liters</Option>
            <Option value='15-liters'>15 liters</Option>
          </SelectField>
          <GasMixtureField
            defaultValue={21}
          />
        </FieldsRow>
        <FieldsRow>
          <TextField
            label='Maximum operational depth'
            size='lg'
            value='12'
            endDecorator={
              <Unit name='Meters' symbol='m' />
            }
            readOnly
          />
        </FieldsRow>
        <FieldsRow>
          <TextField
            label='Start tank pressure'
            size='lg'
            value='200'
            endDecorator={
              <Unit name='Bars' symbol='bar' />
            }
          />
          <TextField
            label='End tank pressure'
            size='lg'
            value='50'
            endDecorator={
              <Unit name='Bars' symbol='bar' />
            }
          />
        </FieldsRow>
        <FieldsRow>
          <TextField
            label='SAC Rate'
            size='lg'
            value='12'
            endDecorator={
              <Unit name='Liters per minute' symbol='l/min' />
            }
            readOnly
          />
        </FieldsRow>
      </Section>
    </Box>
  )
}

function GasMixtureField ({ sx, defaultValue }) {
  const [value, setValue] = useState(defaultValue)

  return (
    <FormLabel
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
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
  )
}
