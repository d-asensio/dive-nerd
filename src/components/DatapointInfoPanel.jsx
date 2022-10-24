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

function TextField({ id, label, ...rest }) {
  return (
    <Fieldset>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...rest} />
    </Fieldset>
  )
}

export function DatapointInfoPanel({ data }) {
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
      <TextField readOnly id="time" label="Time" value={`${time} s`} />
      <TextField readOnly id="depth" label="Depth" value={`${depth.toFixed(2)} m`} />
      <TextField
        readOnly
        id="ambient_pressure"
        label="Ambient p."
        value={`${ambientPressure.toFixed(2)} bar`}
      />
      <TextField
        readOnly
        id="ambient_pressure_delta"
        label="Ambient p. Δ"
        value={`${ambientPressureDelta.toFixed(2)} bar`}
      />
      <TextField
        readOnly
        id="alvelar_pressure_N2"
        label="N2 Alveolar p."
        value={`${alveolarPressureN2.toFixed(2)} bar`}
      />
      <TextField
        readOnly
        id="time_delta"
        label="Time Δ"
        value={`${timeDelta.toFixed(2)} s`}
      />
      <TextField
        readOnly
        id="depth_delta"
        label="Depth Δ"
        value={`${depthDelta.toFixed(2)} m`}
      />
      <TextField
        readOnly
        id="descent_rate"
        label="Descent Rate"
        value={`${descentRate.toFixed(2)} bar/min`}
      />
      <TextField
        readOnly
        id="low_ceiling"
        label="Low Ceiling"
        value={`${lowCeiling.toFixed(2)} m`}
      />
      <TextField
        readOnly
        id="high_ceiling"
        label="High Ceiling"
        value={`${highCeiling.toFixed(2)} m`}
      />
    </Wrapper>
  )
}
