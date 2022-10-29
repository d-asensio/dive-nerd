import { BrowserRouter } from 'react-router-dom'

export const reactRouterDecorator = (Story) => (
  <BrowserRouter>
    <Story />
  </BrowserRouter>
)
