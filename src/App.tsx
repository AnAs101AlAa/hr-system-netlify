import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from './Routes'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, Component }, index) => (
          <Route key={index} path={path} element={<Component />} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App
