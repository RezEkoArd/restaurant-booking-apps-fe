
import { Routes, Route } from 'react-router-dom'
import './App.css'
import TableDetail from './pages/TableDetail'
import LoginPage from './pages/Login/page'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage/>}  />
      <Route path="/table/:id" element={<TableDetail />} />
    </Routes>
  )
}

export default App
