import React, { createContext, useContext, useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const SignalRContext = createContext();

const SignalRProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('/MessageHub')
            .build();

        newConnection.start()
            .then(() => {
            setConnection(newConnection);
        })
        .catch(err => console.error('SignalR Connection Error:', err));

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (connection) {
                connection.on('ReceiveData', (newData) => {
                setData(newData);
            });
        }
    }, [connection]);

    return (
    <SignalRContext.Provider value={{ connection, data }}>
        {children}
    </SignalRContext.Provider>
    );
};

export default SignalRProvider;


export const useSignalR = () => useContext(SignalRContext);
