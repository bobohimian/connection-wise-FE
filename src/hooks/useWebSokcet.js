import { useContext } from 'react';
import { WebSocketContext } from '../components/provider/WebSocketProvider';

export const useWebSokcet = () => {
    const context = useContext(WebSocketContext);
    if (context === null)
        throw new Error('useWebSokcet must be used within a WebSocketProvider');
    return context;
};