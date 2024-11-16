/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";

const ConnectionContext = createContext({
    connection: null,
    setConnection: () => {}
});

export default { ConnectionContext };