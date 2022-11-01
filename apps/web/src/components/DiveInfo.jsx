import { Children, useState } from 'react'
import FormLabel from '@mui/joy/FormLabel'
import Box from '@mui/joy/Box'
import TextField from '@mui/joy/TextField'
import Option from '@mui/joy/Option'
import Slider from '@mui/joy/Slider'
import FormHelperText from '@mui/joy/FormHelperText'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker'
import { Choice, MultipleChoiceField } from './MultipleChoiceField'
import { SelectField } from './SelectField'
import IconButton from '@mui/joy/IconButton'
import Tooltip from '@mui/joy/Tooltip'
import Typography from '@mui/joy/Typography'

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import WaterIcon from '@mui/icons-material/Water'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Co2Icon from '@mui/icons-material/Co2'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Sheet from '@mui/joy/Sheet'
import Avatar from '@mui/joy/Avatar'
import Radio from '@mui/joy/Radio'
import Divider from '@mui/joy/Divider'
import { radioClasses, RadioGroup } from '@mui/joy'

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

function Section ({ title, children }) {
  return <Box sx={{ width: '100%' }}>
    <Divider sx={{ '--Divider-childPosition': `0%` }}>
      {title}
    </Divider>
    <Box
      sx={{
        p: 2,
        width: '100%'
      }}
    >
      {children}
    </Box>
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
        <FieldsRow columns="1fr 3fr">
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
                  <CalendarMonthIcon/>
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
        <Section
          title={
            <Typography
              level="h5"
              startDecorator={<AccessTimeFilledIcon/>}
            >
              Time
            </Typography>
          }
        >
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
        </Section>
        <Section
          title={
            <Typography
              level="h5"
              startDecorator={<ArrowDownwardIcon/>}
            >
              Depth
            </Typography>
          }
        >
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
        </Section>
        <Section
          title={
            <Typography
              level="h5"
              startDecorator={<WaterIcon/>}
            >
              Water
            </Typography>
          }
        >
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
        </Section>
        <Section
          title={
            <Typography
              level="h5"
              startDecorator={<ManageAccountsIcon/>}
            >
              Gear
            </Typography>
          }
        >
          <TextField
            label="Weights"
            size="lg"
            value="6"
            endDecorator="kg"
          />
        </Section>
        <Section
          title={
            <Typography
              level="h5"
              startDecorator={<Co2Icon/>}
            >
              Gas
            </Typography>
          }
        >
          <RadioGroup
            aria-label="platform"
            defaultValue="Website"
            overlay
            name="platform"
            sx={{
              mb: 3,
              flexDirection: 'row',
              gap: 2,
              [`& .${radioClasses.checked}`]: {
                [`& .${radioClasses.action}`]: {
                  inset: -1,
                  border: '3px solid',
                  borderColor: 'primary.500',
                },
              },
              [`& .${radioClasses.radio}`]: {
                display: 'contents',
                '& > svg': {
                  zIndex: 2,
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  bgcolor: 'background.body',
                  borderRadius: '50%',
                },
              },
            }}
          >
            {['Air', 'Nitrox', 'Trimix', 'Heliox'].map((value) => (
              <Sheet
                key={value}
                variant="outlined"
                sx={{
                  width: "100%",
                  borderRadius: 'md',
                  bgcolor: 'background.level1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  minWidth: 120,
                }}
              >
                <Radio id={value} value={value} checkedIcon={<CheckCircleIcon/>}/>
                {/*<Avatar variant="soft" size="sm"/>*/}
                <Typography level='h4'>{value}</Typography>
              </Sheet>
            ))}
          </RadioGroup>
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
        </Section>
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
