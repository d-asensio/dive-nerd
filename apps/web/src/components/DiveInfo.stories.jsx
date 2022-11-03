import React from 'react'

import { DiveInfo } from './DiveInfo'

export default {
  title: 'User Interface/DiveInfo',
  component: DiveInfo,
  argTypes: {}
}

const Template = args => <DiveInfo {...args} />

export const Default = Template.bind({})
Default.args = {}
