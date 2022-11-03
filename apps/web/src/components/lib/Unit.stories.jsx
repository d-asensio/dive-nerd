import React from 'react'

import { Unit } from './Unit'

export default {
  title: 'Library/Unit',
  component: Unit,
  argTypes: {}
}

const Template = args => <Unit {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'Meters per second',
  symbol: 'm/s'
}
