import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Router, Routes } from "react-router-dom"
import NoteEditor from "./components/NoteEditor"
import PrivateRoute from "./components/common/PrivateRoute"
import Login from "./components/common/Login"

export default function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Navigate to="/canvas" replace />
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/canvas" element={
          <PrivateRoute>
            <NoteEditor />
          </PrivateRoute>
        } />
      </Routes>

    </BrowserRouter>
  )
}

