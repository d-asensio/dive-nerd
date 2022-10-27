import React from 'react'
import ReactDOM from 'react-dom/client'

import { CssVarsProvider } from '@mui/joy/styles'

import App from './App'
import { GlobalStyle } from './styles/GlobalStyle'
import reportWebVitals from './reportWebVitals'

import 'mapbox-gl/dist/mapbox-gl.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <CssVarsProvider>
      <App />
    </CssVarsProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
