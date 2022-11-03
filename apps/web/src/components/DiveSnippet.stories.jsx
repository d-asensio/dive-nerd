import React from 'react'

import { DiveSnippet } from './DiveSnippet'

export default {
  title: 'User Interface/DiveSnippet',
  component: DiveSnippet,
  argTypes: {}
}

const Template = args => <DiveSnippet {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'Anchovita',
  date: 'Two minutes ago',
  maximumDepth: '55.5 m',
  totalDuration: '00:45',
  rating: 3
}
