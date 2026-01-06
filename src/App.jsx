import React from 'react'
import "./App.css";
import AppRoutes from './AppRoutes'
import { Toaster } from "react-hot-toast"
import {LoginProvider} from '../src/contexts/LoginContext.jsx';

function App() {
  return (
    <div className='text-base'>
      <LoginProvider>
        <AppRoutes />
      </LoginProvider>
      <Toaster position="top-center" />
    </div>
  )
}

export default App
