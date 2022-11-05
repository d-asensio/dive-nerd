import React from 'react'

import { SingleChoiceField } from './SingleChoiceField'

export default {
  title: 'Library/Forms/SingleChoiceField',
  component: SingleChoiceField,
  argTypes: {}
}

const Template = args => (
  <SingleChoiceField {...args}>
    <SingleChoiceField.Item id='air' value='air'>Air</SingleChoiceField.Item>
    <SingleChoiceField.Item id='nitrox' value='nitrox'>Nitrox</SingleChoiceField.Item>
    <SingleChoiceField.Item id='trimix' value='trimix'>Trimix</SingleChoiceField.Item>
    <SingleChoiceField.Item id='heliox' value='heliox'>Heliox</SingleChoiceField.Item>
  </SingleChoiceField>
)

export const Default = Template.bind({})
Default.args = {}
