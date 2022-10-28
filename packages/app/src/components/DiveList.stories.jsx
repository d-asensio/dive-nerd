import React from 'react'

import {mockDives} from '@divenerd/mock-dives';

import { DiveList } from './DiveList'
import { useDive } from '../hooks/useDive'

export default {
  title: 'Components/DiveList',
  component: DiveList,
  argTypes: {}
}

const Template = (args) => {
  const { samples } = useDive(mockDives.diveY2022M04D12T0704)

  return (
    <DiveList {...args}>
      <DiveList.Item
        name='Thomas Reef'
        date='25/10/2022 10:30 AM'
        depth='48.2 m'
        time='00:38'
        rating={4}
        samples={samples}
      />
      <DiveList.Divider />
      <DiveList.Item
        name='Thomas Reef'
        date='25/10/2022 10:30 AM'
        depth='48.2 m'
        time='00:38'
        rating={1}
        samples={samples}
      />
    </DiveList>
  )
}

export const Default = Template.bind({})
Default.args = {}
