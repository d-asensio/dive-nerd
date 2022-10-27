import React from 'react'

import { DiveLogPanel } from './DiveLogPanel'
import { Default as DefaultDiveList } from './DiveList.stories'

export default {
  title: 'Components/DiveLogPanel',
  component: DiveLogPanel,
  argTypes: {}
}

const Template = (args) => (
  <DiveLogPanel {...args}>
    <DefaultDiveList />
  </DiveLogPanel>
)

export const Default = Template.bind({})
Default.args = {}
