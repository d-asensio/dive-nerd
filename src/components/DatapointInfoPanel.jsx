import styled from 'styled-components'
import { violet, mauve } from '@radix-ui/colors'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Text = styled.h3`
  margin: 0;
  color: ${mauve.mauve12};
  font-size: 15px;
  line-height: 19px;
  font-weight: 500;
`

const Fieldset = styled.fieldset`
  all: unset;
  display: flex;
  gap: 10px;
  align-items: center;
`

const Label = styled.label`
  font-size: 13px;
  color: ${violet.violet11};
  width: 110px;
`

const Input = styled.input`
  all: unset;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 13px;
  line-height: 1;
  color: ${violet.violet11};
  box-shadow: 0 0 0 1px ${violet.violet7};
  height: 25px;
  min-width: 80px;
  max-width: 90px;

  &:focus {
    box-shadow: 0 0 0 2px ${violet.violet8};
  }
`

function padTo2Digits (num) {
  return num.toString().padStart(2, '0')
}

function formatTime (totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
}

function TimeField ({ id, label, value, ...rest }) {
  const formattedValue = typeof value === 'number' ? `${formatTime(value)} min` : ''

  return (
    <Fieldset>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={formattedValue} {...rest} />
    </Fieldset>
  )
}

function NumericField ({ id, label, units, value, precision = 2, ...rest }) {
  const formattedValue = typeof value === 'number' ? `${value.toFixed(precision)} ${units}` : ''

  return (
    <Fieldset>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={formattedValue} {...rest} />
    </Fieldset>
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
    <Wrapper>
      <Text>Datapoint Information</Text>
      <TimeField
        readOnly
        id='time'
        label='Time'
        value={time}
      />
      <NumericField
        readOnly
        id='depth'
        label='Depth'
        value={depth}
        units='m'
      />
      <NumericField
        readOnly
        id='ambient_pressure'
        label='Ambient p.'
        value={ambientPressure}
        units='bar'
      />
      <NumericField
        readOnly
        id='ambient_pressure_delta'
        label='Ambient p. Δ'
        value={ambientPressureDelta}
        units='bar'
      />
      <NumericField
        readOnly
        id='alvelar_pressure_N2'
        label='N2 Alveolar p.'
        value={alveolarPressureN2}
        units='bar'
      />
      <NumericField
        readOnly
        id='time_delta'
        label='Time Δ'
        value={timeDelta}
        units='s'
      />
      <NumericField
        readOnly
        id='depth_delta'
        label='Depth Δ'
        value={depthDelta}
        units='m'
      />
      <NumericField
        readOnly
        id='descent_rate'
        label='Descent Rate'
        value={descentRate}
        units='bar/min'
      />
      <NumericField
        readOnly
        id='low_ceiling'
        label='Low Ceiling'
        value={lowCeiling}
        units='m'
      />
      <NumericField
        readOnly
        id='high_ceiling'
        label='High Ceiling'
        value={highCeiling}
        units='m'
      />
    </Wrapper>
  )
}
