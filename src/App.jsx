import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import RouteConfig from './routes/route'

function App() {
  return (
    <BrowserRouter>
      <RouteConfig />
    </BrowserRouter>
  )
}

export default App
