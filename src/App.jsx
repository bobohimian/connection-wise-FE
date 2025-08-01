import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/hoc/PrivateRoute';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import NoteEditor from './components/pages/NoteEditor';
import WebSocketProvider from './components/provider/WebSocketProvider';
export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Navigate to="/canvas" replace />
        }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/canvas/*" element={
          <PrivateRoute>
            <Routes>
              <Route index element={<Home />} />
              <Route path=":canvasId" element={
                <WebSocketProvider >
                  <NoteEditor />
                </WebSocketProvider >
              }
              />
            </Routes>
          </PrivateRoute>
        }
        />
        <Route path="*" element={<Navigate to="/login" replace />}></Route>
      </Routes>
    </BrowserRouter >
  );
}

