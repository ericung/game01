import './App.css';
import Interface from './Interface';
import Canvas from './Canvas';
import { SignalRConnection } from './Signalr';

function App() {
        return (
        <div id="maincontent">
            <Canvas />
            <Interface />
            <SignalRConnection />
        </div>
    );
}

export default App;

