import React from 'react'

import { deepmerge } from '@mui/utils'
import { experimental_extendTheme as extendMuiTheme } from '@mui/material/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import {
  extendTheme as extendJoyTheme,
  StyledEngineProvider,
  CssVarsProvider
} from '@mui/joy/styles'

const muiTheme = extendMuiTheme({
  // This is required to point to `var(--joy-*)` because we are using `CssVarsProvider` from Joy UI.
  cssVarPrefix: 'joy'
})

const joyTheme = extendJoyTheme()

const theme = deepmerge(muiTheme, joyTheme)

export const ThemeProvider = ({ children }) => (
  <StyledEngineProvider injectFirst>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  </StyledEngineProvider>
)
