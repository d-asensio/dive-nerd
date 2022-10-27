import React from 'react'

import { DiveProfileChart } from './DiveProfileChart'

import { useDive } from '../hooks/useDive'

import dive from '../dives/Dive_2022-04-12-0704.json'

export default {
  title: 'Components/DiveProfileChart',
  component: DiveProfileChart,
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' }
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
  dive
}
