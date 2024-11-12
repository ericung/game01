import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import signalRConnection from "./Signalr";
import * as signalR from "@microsoft/signalr";

export const Context = React.createContext();
const ContextProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);
    const [user, setUser] = useState("red");

    useEffect(() => {
        if (!connection || connection.state !== signalR.HubConnectionState.Disconnected) {
            signalRConnection.startSignalRConnection();
            setConnection(signalRConnection.connection);
        }

        return () => {
            //conn.stop();
        }
    });

    return (
        <Context.Provider value={{ connection, setConnection, user, setUser }}>
            {children}
        </Context.Provider>
    );
};

ContextProvider.propTypes = {
    children: PropTypes.array
}

export default ContextProvider;