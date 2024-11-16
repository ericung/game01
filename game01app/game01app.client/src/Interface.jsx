import { useEffect, useContext, useRef } from 'react';
import * as signalR from "@microsoft/signalr";
import { Context } from "./SignalRContext";
import { SignalRConnection } from "./Signalr";

const Interface = () => {
    const { connectionId, /*setConnectionId, */user/*, setUser*/ } = useContext(Context);
    const mountRef = useRef(false);

    useEffect(() => {
        if (!mountRef.current) {
            mountRef.current = true;
            return () => {
            };
        }

        // document.getElementById("network").value = connectionId;

        return () => {
            //conn.stop();
        }
    }, []);

    // REGION: GroupActions

    async function createGroup() {
        /*
        var input = document.getElementById("group");

        if ((input === null)||(input === "")) {
            return;
        }

        var newGroup = input.value;

        try {
            await connection.invoke("LeaveGroup", connection.id).catch(function (err) {
                return console.error(err.toString());
            });

            await connection.invoke("JoinGroup", connection.id === null ? "" : connection.id, newGroup).catch(function (err) {
                return console.error(err.toString());
            });

            await connection.invoke("GetGroups", connection.id).catch(function (err) {
                return console.error(err.toString());
            });

        }
        catch (error) {
            console.log(error.toString());
        }
        */
    }

    async function refreshGroups() {
        /*
        try {
            await connection.invoke("GetGroups", connection.id).catch(function (err) {
                return console.error(err.toString());
            });

            setConnection(connection);
        }
        catch (error) {
            console.log(error.toString());
        }
        */
    }

    async function changeGroups() {
        /*
        try {
            document.getElementById("group").value = document.getElementById("groupList").value;
            let newGroup = document.getElementById("groupList").value;

            await connection.invoke("LeaveGroup", connection.id).catch(function (err) {
                return console.error(err.toString());
            });

            await connection.invoke("JoinGroup", connection.id, newGroup).catch(function (err) {
                return console.error(err.toString());
            });

            setConnection(connection);
            setUser(connection.user);

            await connection.invoke("GetGroups", connection.id).catch(function (err) {
                return console.error(err.toString());
            });
        }
        catch (error) {
            console.log(error.toString());
        }
        */
    }

    // ENDREGION: GroupActions

    return (
        <>
            <div>
                <div id="menuleftcontent">
                    <form>
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
            </div>
        </>
    )
}

export default Interface;

 