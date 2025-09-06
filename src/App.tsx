import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from './Routes'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {routes.map(({ path, Component }, index) => (
          <Route key={index} path={path} element={<Component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App
