import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Mapa3d } from './pages/Mapa3d'
import { ServiciosDashboard } from './pages/ServiciosDashboard'

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}/>
      <Route path="/servicios" element={<ServiciosDashboard />}/>
      <Route path='/mapa3d' element={<Mapa3d />} />
    </Routes>
  )
}
