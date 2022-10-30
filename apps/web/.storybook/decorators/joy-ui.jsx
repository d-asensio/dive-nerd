import { ThemeProvider } from '../../src/providers/ThemeProvider'

export const joyUIDecorator = (Story) => (
  <ThemeProvider>
    <Story />
  </ThemeProvider>
)
