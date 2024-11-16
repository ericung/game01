/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { SignalRConnection } from "./Signalr";
import * as signalR from "@microsoft/signalr";

export const Context = React.createContext();

const ContextProvider = ({ children }) => {
    let connection;
    const [connectionId, setConnectionId] = useState(null);
    const [user, setUser] = useState("red");
    const mountRef = useRef(false);

    const AwaitForConnection = async () => {
        while (true) {
            if (connection.state === signalR.HubConnectionState.Connected) {
                return;
            }
            else {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    }

    const Connect = async () => {
        await AwaitForConnection();

        if (connection.state === signalR.HubConnectionState.Connected) {
            await connection.invoke("Connect").catch(function (err) {
                return console.error(err.toString());
            });

            setConnectionId(connection.id);
        }
    }

    useEffect(() => {
        if (!mountRef.current) {
            mountRef.current = true;
            connection = new SignalRConnection();

            Connect();

            return () => {

            };
        }


        return () => {
            //conn.stop();
        }
    });

    return (
        <Context.Provider value={ connectionId, setConnectionId, user, setUser }>
            {children}
        </Context.Provider>
    );
};

ContextProvider.propTypes = {
    children: PropTypes.object
}

export default ContextProvider;