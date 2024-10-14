import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr'

const URL = "https://localhost:7276/messageHub";

const Interface = () => {
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        const conn = new signalR.HubConnectionBuilder()
            .withUrl(URL, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        setConnection(conn);

        conn.start().catch(err => console.error("Connection failed: ", err));

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
                    {/*<input type="button" value="Create" onClick="createGroup()" />*/}
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
