import React, { useEffect, useState, useRef } from 'react';
import { SignalRConnection } from './Signalr';

const URL = "https://localhost:7276/messageHub";

const Interface = () => {
    const [connection, setConnection] = useState(null);

    const mountRef = useRef(false);

    useEffect(() => {
        const signalr = SignalRConnection().WaitForConnection();
        setConnection(SignalRConnection().connection);

        // connection.start().catch(err => console.error("Connection failed: ", err));

        return () => {
            //conn.stop();
        }
    }, []);

    return (
        <>
            <div id="menuleftcontent">
                <form>
                    <b>User</b>
                    {/*<input id="user" value="@Model.User" disabled/>*/}
                    <br/>
                    <b>Network</b>
                    <input list="networks" id="network" name="network"/>
                    <datalist id="networks"></datalist>
                    <br/>
                    <b>Group</b>
                    <input id="group" name="group"/>
                    {/*<input type="button" value="Create" onClick={connection.createGroup()} />*/}
                    <br />
                    <b>Group List</b>
                    {/*<select id="groupList" onChange="changeGroups()">
                    </select>*/}
                    <br />
                    {/*<input type="button" value="Refresh Groups" onClick="refreshGroups()"/>*/}
                    <br />
                    <b>Units</b>
                    <input type="text" id="units"/>
                </form>
            </div>
        </>
    );
}

export default Interface;
