import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Mapa3d } from './pages/Mapa3d'
import { ServiciosDashboard } from './pages/ServiciosDashboard'
import { HuellaDinosaurio3D } from './pages/huellaDinosaurio3D'

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}/>
      <Route path="/servicios" element={<ServiciosDashboard />}/>
      <Route path='/mapa3d' element={<Mapa3d />} />
      <Route path='/huellas3d' element={<HuellaDinosaurio3D />} />
    </Routes>
  )
}
