import React from 'react'

import { DiveList } from './DiveList'

export default {
  title: 'Components/DiveList',
  component: DiveList,
  argTypes: {}
}

const Template = (args) => (
  <DiveList {...args}>
    <DiveList.Item
      name='Thomas Reef'
      date='25/10/2022 10:30 AM'
      depth='48.2 m'
      time='00:38'
    />
    <DiveList.Divider />
    <DiveList.Item
      name='Thomas Reef'
      date='25/10/2022 10:30 AM'
      depth='48.2 m'
      time='00:38'
    />
  </DiveList>
)

export const Default = Template.bind({})
Default.args = {}
