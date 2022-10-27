import React from 'react'

import { DivelogEntryCard } from './DivelogEntryCard'

export default {
  title: 'Components/DivelogEntryCard',
  component: DivelogEntryCard,
  argTypes: {}
}

const Template = (args) => <DivelogEntryCard {...args} />

export const Default = Template.bind({})
Default.args = {}
