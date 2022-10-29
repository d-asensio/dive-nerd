import { Routes, Route } from 'react-router-dom'

import DiveLogPage from './pages/DiveLogPage'
import DiveViewerPage from './pages/DiveViewerPage'

function App () {
  return (
    <Routes>
      <Route index path='/' element={<DiveLogPage />} />
      <Route path='/dive/:diveId' element={<DiveViewerPage />} />
    </Routes>
  )
}

export default App
