import { StyledEngineProvider, CssVarsProvider } from '@mui/joy/styles'

export const joyUIDecorator = (Story) => (
  <StyledEngineProvider injectFirst>
    <CssVarsProvider>
      <Story />
    </CssVarsProvider>
  </StyledEngineProvider>
)
