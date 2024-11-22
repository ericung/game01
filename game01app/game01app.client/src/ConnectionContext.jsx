/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";

export const ConnectionContext = createContext({
    connection: null,
    setConnection: () => { },
    user: null, 
    setUser: () => { }
});

