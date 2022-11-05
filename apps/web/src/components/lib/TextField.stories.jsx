import React from 'react'

import { TextField } from './TextField'

export default {
  title: 'Library/Forms/TextField',
  component: TextField,
  argTypes: {}
}

const Template = args => <TextField {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Nice text field',
  value: 'You can write on it'
}
