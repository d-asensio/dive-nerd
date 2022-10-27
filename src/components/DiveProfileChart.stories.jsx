import React from 'react'

import { DiveProfileChart } from './DiveProfileChart'

import { useDive } from '../hooks/useDive'

import * as dives from '../dives'

export default {
  title: 'Components/DiveProfileChart',
  component: DiveProfileChart,
  argTypes: {
    dive: {
      options: Object.keys(dives),
      mapping: dives,
      control: {
        type: 'select'
      }
    }
  }
}

const Template = ({ dive, ...args }) => {
  const { samples } = useDive(dive)

  return (
    <DiveProfileChart samples={samples} {...args} />
  )
}

export const Default = Template.bind({})
Default.args = {
  dive: 'diveY2022M04D12T0704'
}
