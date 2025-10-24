import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { ServiciosDashboard } from './pages/ServiciosDashboard'

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}/>
      <Route path="/servicios" element={<ServiciosDashboard />}/>
    </Routes>
  )
}
