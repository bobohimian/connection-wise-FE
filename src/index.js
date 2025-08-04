import { ReactFlowProvider } from '@xyflow/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { ToastProvider } from './components/common/toast.jsx';
import store from './store/index.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ReactFlowProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ReactFlowProvider>
  </Provider >,
  // </React.StrictMode>,
);
