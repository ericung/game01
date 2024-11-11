import React, { useState } from "react";
import PropTypes from 'prop-types';

export const Context = React.createContext();
const ContextProvider = ({ children }) => {
    Context.propTypes = {
        children: PropTypes.object
    }
    const [connection, setConnection] = useState(null);
    const [user, setUser] = useState("red");

    return (
        <Context.Provider value={{ connection, setConnection, user, setUser }}>
            {children}
        </Context.Provider>
    );
};

ContextProvider.propTypes = {
    children: PropTypes.object
}

export default ContextProvider;