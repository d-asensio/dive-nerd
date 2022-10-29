import Box from '@mui/joy/Box'
import TextField from '@mui/joy/TextField'
import {formatTimeMinutes} from '../utils/formatTime';
import {formatNumber} from '../utils/formatNumber';

function TimeField ({ value, ...rest }) {
  const formattedValue = typeof value === 'number' ? `${formatTimeMinutes(value)} min` : ''

  return (
    <TextField
      variant='soft'
      size='sm'
      value={formattedValue}
      {...rest}
    />
  )
}

function NumericField ({ units, value, precision = 2, ...rest }) {
  const formattedValue = formatNumber({ value, precision, units })

  return (
    <TextField
      variant='soft'
      size='sm'
      value={formattedValue}
      {...rest}
    />
  )
}

export function DatapointInfoPanel ({ data }) {
  const {
    time,
    depth,
    ambientPressure,
    alveolarPressureN2,
    ambientPressureDelta,
    timeDelta,
    depthDelta,
    descentRate,
    lowCeiling,
    highCeiling
  } = data

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 2,
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: 2
      }}
    >
      <TimeField
        readOnly
        label='Time'
        value={time}
      />
      <TimeField
        readOnly
        label='Time Δ'
        value={timeDelta}
      />
      <NumericField
        readOnly
        label='Depth'
        value={depth}
        units='m'
      />
      <NumericField
        readOnly
        label='Depth Δ'
        value={depthDelta}
        units='m'
      />
      <NumericField
        readOnly
        label='Ambient p.'
        value={ambientPressure}
        units='bar'
      />
      <NumericField
        readOnly
        label='Ambient p. Δ'
        value={ambientPressureDelta}
        units='bar'
      />
      <NumericField
        readOnly
        label='Descent Rate'
        value={descentRate}
        units='bar/min'
      />
      <NumericField
        readOnly
        label='N2 Alveolar p.'
        value={alveolarPressureN2}
        units='bar'
      />
      <NumericField
        readOnly
        label='Low Ceiling'
        value={lowCeiling}
        units='m'
      />
      <NumericField
        readOnly
        label='High Ceiling'
        value={highCeiling}
        units='m'
      />
    </Box>
  )
}
