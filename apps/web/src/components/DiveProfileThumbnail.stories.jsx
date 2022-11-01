import React from 'react'

import { DiveProfileThumbnail } from './DiveProfileThumbnail'

import { useDive } from '../hooks/useDive'

import { mockDives } from '@divenerd/mock-dives'

export default {
  title: 'Components/DiveProfileThumbnail',
  component: DiveProfileThumbnail,
  argTypes: {
    dive: {
      options: Object.keys(mockDives),
      mapping: mockDives,
      control: {
        type: 'select'
      }
    }
  }
}

export const Default = ({ dive, ...args }) => {
  const { samples } = useDive(dive)

  return (
    <DiveProfileThumbnail samples={samples} {...args} />
  )
}

Default.args = {
  dive: '2BB70361-453E-4B9A-A947-AE62D693CA37',
  highlighted: false
}
