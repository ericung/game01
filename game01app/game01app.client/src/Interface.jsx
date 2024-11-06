import { useEffect, useState, useRef } from 'react';
import { SignalRConnection } from './Signalr';

// const URL = "https://localhost:7276/messageHub";

const Interface = () => {
    const [connection, setConnection] = useState(null);
    const [user /*, setUser*/] = useState("red");
    const mountRef = useRef(false);

    useEffect(() => {
        if (!mountRef.current) {
            const getConnection = async () => {
                const connection = await SignalRConnection();
                setConnection(connection);

                await connection.invoke("Connect").catch(function (err) {
                    return console.error(err.toString());
                });

                setConnection(connection);
                document.getElementById("connection").value = connection.id;
            };

            getConnection();
            return () => {
                mountRef.current = true;
            };
        }
        
        return () => {
            //conn.stop();
        }
    }, [connection]);
    if (mountRef.current) {
        return (
            <>
                <div id="menuleftcontent">
                    <form>
                        <b>Connection</b>
                        <input id="connection" value={ connection.id } disabled/>
                        <b>User</b>
                        <input id="user" value={ user } disabled/>
                        <br />
                        <b>Network</b>
                        <input list="networks" id="network" name="network" />
                        <datalist id="networks"></datalist>
                        <br />
                        <b>Group</b>
                        <input id="group" name="group" />
                        {/*<input type="button" value="Create" onClick={connection.createGroup()} />*/}
                        <br />
                        <b>Group List</b>
                        {/*<select id="groupList" onChange="changeGroups()"></select>*/}
                        <br />
                        {/*<input type="button" value="Refresh Groups" onClick="refreshGroups()"/>*/}
                        <br />
                        <b>Units</b>
                        <input type="text" id="units" />
                    </form>
                </div>
            </>
        )
    }
}

export default Interface;
