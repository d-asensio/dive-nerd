import { ThemeProvider } from '../../src/providers'

export const joyUIDecorator = (Story) => (
  <ThemeProvider>
    <Story />
  </ThemeProvider>
)
