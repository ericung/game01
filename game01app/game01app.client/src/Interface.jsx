import { useEffect, useState, useRef } from 'react';
import { SignalRConnection } from './Signalr';

// const URL = "https://localhost:7276/messageHub";

// REGION: GroupActions

/*
async function refreshGroups() {
    await connection.invoke("GetGroups", connectionId).catch(function (err) {
        return console.error(err.toString());
    });
}

async function changeGroups() {
    document.getElementById("group").value = document.getElementById("groupList").value;
    let newGroup = document.getElementById("groupList").value;

    await connection.invoke("LeaveGroup", connectionId).catch(function (err) {
        return console.error(err.toString());
    });

    await connection.invoke("JoinGroup", connectionId, newGroup).catch(function (err) {
        return console.error(err.toString());
    });
}
*/

// ENDREGION: GroupActions

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

    async function createGroup() {
        var input = document.getElementById("group");

        if ((input === null)||(input === "")) {
            return;
        }

        var newGroup = input.value;

        await connection.invoke("LeaveGroup", connection.id).catch(function (err) {
            return console.error(err.toString());
        });

        try {
            await connection.invoke("JoinGroup", connection.id === null ? "" : connection.id, newGroup).catch(function (err) {
                return console.error(err.toString());
            });
        }
        catch (error) {
            console.log(error.toString());
        }

        setConnection(connection);
    }

    async function refreshGroups() {
        try {
            await connection.invoke("GetGroups", connection.id).catch(function (err) {
                return console.error(err.toString());
            });
        }
        catch (error) {
            console.log(error.toString());
        }
    }

    async function changeGroups() {
        try {
            document.getElementById("group").value = document.getElementById("groupList").value;
            let newGroup = document.getElementById("groupList").value;

            await connection.invoke("LeaveGroup", connection.id).catch(function (err) {
                return console.error(err.toString());
            });

            await connection.invoke("JoinGroup", connection.id, newGroup).catch(function (err) {
                return console.error(err.toString());
            });
        }
        catch (error) {
            console.log(error.toString());
        }
    }

    if (mountRef.current) {
        return (
            <>
                <div id="menuleftcontent">
                    <form>
                        <b>Connection</b>
                        <input id="connection" value="id" disabled/>
                        <b>User</b>
                        <input id="user" value={ user } disabled/>
                        <br />
                        <b>Network</b>
                        <input list="networks" id="network" name="network" />
                        <datalist id="networks"></datalist>
                        <br />
                        <b>Group</b>
                        <input id="group" name="group" />
                        <input type="button" value="Create" onClick={createGroup} />
                        <br />
                        <b>Group List</b>
                        <select id="groupList" onChange={changeGroups}></select>
                        <br />
                        <input type="button" value="Refresh Groups" onClick={refreshGroups}/>
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

 