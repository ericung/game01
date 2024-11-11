import React, { useEffect, useRef } from 'react';
import './App.css';
import Interface from './Interface';
import Canvas from './Canvas';
import ContextProvider from './Context';

function App() {

    return (
        <ContextProvider>
            <div id="maincontent">
                <Canvas/>
                <Interface/>
            </div>
        </ContextProvider>
    );
}

export default App;

