import React, { createContext, useContext, useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
        .withUrl('/your-signalr-hub')
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

/*
import React, { useEffect } from 'react';
import { useSignalR } from './SignalRContext';

const MyComponent = () => {
  const { data } = useSignalR();

  useEffect(() => {
    // This effect will re-run whenever 'data' from the SignalR context changes
    console.log('New data received:', data);
  }, [data]);

  return (
    <div>
      { Render your component here, using 'data' if necessary }
    </div>
  );
};
*/

export const useSignalR = () => useContext(SignalRContext);
