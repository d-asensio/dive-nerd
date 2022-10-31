import { useEffectOnce } from 'react-use'
import { Routes, Route } from 'react-router-dom'
import { run } from '@regenerate/core'

import DiveLogPage from './pages/DiveLogPage'
import DiveViewerPage from './pages/DiveViewerPage'
import LoginPage from './pages/LoginPage'

import { divesService } from './entities'

import { withAuthenticationRequired } from '@auth0/auth0-react'

const ProtectedRoute = ({ component, ...args }) => {
  const Component = withAuthenticationRequired(component, args)
  return <Component />
}

function App () {
  useEffectOnce(() => {
    run(
      divesService.fetchDives()
    )
  })

  return (
    <Routes>
      <Route index path='/login' element={<LoginPage />} />
      <Route index path='/' element={<ProtectedRoute component={DiveLogPage} />} />
      <Route path='/dive/:diveId' element={<ProtectedRoute component={DiveViewerPage} />} />
    </Routes>
  )
}

export default App
