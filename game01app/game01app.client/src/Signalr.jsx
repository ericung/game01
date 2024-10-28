import * as signalR from '@microsoft/signalr'

const URL = "https://localhost:7276/messageHub";

export const SignalRConnection = () => {
    let connection;
    let connectionId;
    let connected = false;

    connection = new signalR.HubConnectionBuilder()
        .withUrl(URL, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();

    // REGION: GroupActions
    async function createGroup() {
        var input = document.getElementById("group");
        var newGroup = input.value;

        await connection.invoke("LeaveGroup", connectionId).catch(function (err) {
            return console.error(err.toString());
        });

        await connection.invoke("JoinGroup", connectionId, newGroup).catch(function (err) {
            return console.error(err.toString());
        });
    }

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
    
    // ENDREGION: GroupActions
    connection.start().then(function () {
        connected = true;
    }).catch(function (err) {
        console.error("Connection failed: ", err)
        return "";
    });

    connection.on("ReceiveMessage", function (user, message) {
        if (message.Message.Blue !== undefined) {
            // unitsBlue = message.Message.Blue;
        }

        if (message.Message.Red !== undefined) {
            // unitsRed = message.Message.Red;
        }

        if (message.Message.Ball !== undefined) {
            // ball = message.Message.Ball;
        }

        // send draw event
        // draw()
    });

    connection.on("Connected", function (userInfo) {
        connectionId = userInfo.connectionId;
        var datalist = document.getElementById("networks");
        var newOption = document.createElement("option");

        newOption.value = connectionId;
        datalist.appendChild(newOption);
        // user = userInfo.userName;
        // document.getElementById("user").value = user;
    });

    connection.on("JoinedGroup", async function (userInfo) {
        document.getElementById("user").value = userInfo.userName; 
        document.getElementById("group").value = userInfo.group;
        // user = userInfo.userName;
        // await refreshGroups();
    });

    connection.on("RemovedGroup", function (userInfo) {
        document.getElementById("group").value = userInfo.group;
        // user = userInfo.userName;
    });

    connection.on("SendGroupList", function (groupList) {
        // $("#groupList").empty();
        var groups = document.getElementById("groupList");
        var options = groups.options;
        options[0] = new Option("", "");
        for (let i = 0; i < groupList.length; i++) {
            options[options.length] = new Option(groupList[i], groupList[i]);
        }
    });

    async function WaitForConnection() {
        while (true) {
            if (connected) {
                return;
            }
            else {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    }
};





