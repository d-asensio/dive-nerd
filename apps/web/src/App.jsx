import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { run } from '@regenerate/core'

import DiveLogPage from './pages/DiveLogPage'
import DiveViewerPage from './pages/DiveViewerPage'

import { divesService } from './services/divesService'

function App () {
  useEffect(() => {
    run(
      divesService.fetchDives()
    )
  }, [])

  return (
    <Routes>
      <Route index path='/' element={<DiveLogPage />} />
      <Route path='/dive/:diveId' element={<DiveViewerPage />} />
    </Routes>
  )
}

export default App
