import React from 'react'
import "./App.css";
import AppRoutes from './AppRoutes'
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <div className='text-base'>
      <AppRoutes />
      <Toaster position="top-center" />
    </div>
  )
}

export default App
