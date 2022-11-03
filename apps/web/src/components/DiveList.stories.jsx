import React from 'react'

import { mockDives } from '@divenerd/mock-dives'

import { DiveList } from './DiveList'
import { useDive } from '../hooks/useDive'

export default {
  title: 'User Interface/DiveList',
  component: DiveList,
  argTypes: {}
}

const Template = (args) => {
  const { samples } = useDive(mockDives['2BB70361-453E-4B9A-A947-AE62D693CA37'])

  return (
    <DiveList {...args}>
      <DiveList.Item
        name='Thomas Reef'
        date='25/10/2022 10:30 AM'
        maximumDepth='48.2 m'
        totalDuration='00:38'
        rating={4}
        samples={samples}
      />
      <DiveList.Divider />
      <DiveList.Item
        name='Thomas Reef'
        date='25/10/2022 10:30 AM'
        maximumDepth='48.2 m'
        totalDuration='00:38'
        rating={1}
        samples={samples}
      />
    </DiveList>
  )
}

export const Default = Template.bind({})
Default.args = {}
