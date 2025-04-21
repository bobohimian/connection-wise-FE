import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store'
import './index.css'
import { ToastProvider } from "./components/provider/toast";
import { ReactFlowProvider } from '@xyflow/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ReactFlowProvider>
        <ToastProvider>
            <App />
        </ToastProvider>
    </ReactFlowProvider>
  </Provider >

  // </React.StrictMode>
)
