/* eslint-disable no-unused-vars */
import {
  JsonHubProtocol,
  // HubConnection,
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel,
  // IHttpConnectionOptions,
  HttpTransportType
} from '@microsoft/signalr';

// import store from '@/app/store';

// let connectionId;

const URL = "https://localhost:7276/messageHub";

const isDev = process.env.NODE_ENV === 'development';

let connection;

let connectionId;

let connected = false;

/*
const getToken = (): string => {
  const state = store.getState();
  return state.app.token!;
}
*/

const startSignalRConnection = async (connection) => {
    try {
        if (connected === false) {
            await connection.start().then(function () {
                connected = true;
            }).catch(function () {
                return "";
            });
        }
        // console.assert(connection.state === HubConnectionState.Connected);
        console.log('SignalR connection established', connection.baseUrl);
    } catch (err) {
        // console.assert(connection.state === HubConnectionState.Disconnected);
        console.error('SignalR Connection Error: ', err);
        setTimeout(() => startSignalRConnection(connection), 5000);
    }
};

export const SignalRConnection = async () => {
    // let connected = false;

    const options = {
        logMessageContent: isDev,
        logger: isDev ? LogLevel.Warning : LogLevel.Error,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
        // accessTokenFactory: () => getToken()
    };

    const connection = new HubConnectionBuilder()
        .withUrl(URL, options)
        .withAutomaticReconnect()
        .withHubProtocol(new JsonHubProtocol())
        .configureLogging(LogLevel.Information)
        .build();

    connection.serverTimeoutInMilliseconds = 60000;
    connection.keepAliveIntervalInMilliseconds = 15000;

    // re-establish the connection if connection dropped
    /*
    connection.onclose(error => {
    // console.assert(connection.state === HubConnectionState.Disconnected);
    if (!!error) {
      // console.log('SignalR: connection was closed due to error.', error);
    } else {
      // console.log('SignalR: connection was closed.');
    }
    });
    */

    /*
    connection.onreconnecting(error => {
    console.assert(connection.state === HubConnectionState.Reconnecting);
    console.log('SignalR: connection lost due. Reconnecting...', error);
    });
    */

    /*
    connection.onreconnected(connectionId => {
    console.assert(connection.state === HubConnectionState.Connected);
    console.log('SignalR: connection reestablished. Connected with connectionId', connectionId);
    });
    */

    await startSignalRConnection(connection);

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
    /*
    connection.start().then(function () {
        //connected = true;
    }).catch(function (err) {
        console.error("Connection failed: ", err)
        return "";
    });
    */

    /*
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
    */

    connection.on("Connected", function (userInfo) {
        connection.id = userInfo.connectionId;
        // var datalist = document.getElementById("networks");
        // var newOption = document.createElement("option");

        //newOption.value = connectionId;
        //datalist.appendChild(newOption);
    });

    connection.on("JoinedGroup", async function (userInfo) {
        //connection.user = userInfo.connection.userName;
        connection.group = userInfo.group;

        /*
        document.getElementById("user").value = userInfo.userName;
        document.getElementById("group").value = userInfo.group;
        */
        // user = userInfo.userName;
        // await refreshGroups();
    });

    /*
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
    */

    /*
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
    */

    return connection;
};

