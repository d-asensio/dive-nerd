import React from 'react'

import { DiveProfileChart } from './DiveProfileChart'

import { useDive } from '../hooks/useDive'

import { mockDives } from '@divenerd/mock-dives'
import { useGenerator } from '../hooks/useGenerator'
import Box from '@mui/joy/Box'
import { DiveList } from './DiveList'

export default {
  title: 'User Interface/DiveProfileChart',
  component: DiveProfileChart,
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

const Template = args => (
  <Box
    sx={{
      width: '100vw',
      height: '100vh',
      display: 'grid'
    }}
  >
    <DiveProfileChart {...args} />
  </Box>
)

export const Default = ({ dive, ...args }) => {
  const { samples } = useDive(dive)

  return (
    <Template samples={samples} {...args} />
  )
}

Default.args = {
  dive: '2BB70361-453E-4B9A-A947-AE62D693CA37'
}

export const Generator = ({ dive, ...options }) => {
  const { samples } = useGenerator(options)

  return (
      <Template samples={samples} />
  )
}
Generator.args = {
  samplingIntervals: 20,
  withPerlinNoise: false,
  segments: [
    {
      time: 0,
      depth: 0
    },
    {
      time: 2 * 60,
      depth: 35
    },
    {
      time: 12 * 60,
      depth: 35
    },
    {
      time: 14 * 60 + 13,
      depth: 15
    },
    {
      time: 15 * 60 + 43,
      depth: 6
    },
    {
      time: 16 * 60 + 45,
      depth: 6
    },
    {
      time: 17 * 60 + 45,
      depth: 3
    },
    {
      time: 21 * 60 + 40,
      depth: 3
    },
    {
      time: 22 * 60 + 40,
      depth: 0
    }
  ]
}
