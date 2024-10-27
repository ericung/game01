import './App.css';
import Interface from './Interface';
import Canvas from './Canvas';
import { InitSignalRConnection } from './Signalr';

function App() {
        return (
        <div id="maincontent">
            <Canvas />
            <Interface/>
            <InitSignalRConnection />
        </div>
    );
}

export default App;

