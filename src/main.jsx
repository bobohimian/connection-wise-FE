import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store'
import './index.css'
import { ToastProvider } from "@/components/provider/toast";
import { WebSocketProvider } from "@/components/provider/WebSocketProvider";
import { ReactFlowProvider } from '@xyflow/react'
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <ReactFlowProvider>
      <WebSocketProvider wsService={1}>
        <Provider store={store}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </Provider>
      </WebSocketProvider>
    </ReactFlowProvider>
  // </React.StrictMode>
)
