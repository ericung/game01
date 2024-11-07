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

// const isDev = process.env.NODE_ENV === 'development';

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
        // console.log('SignalR connection established', connection.baseUrl);
    } catch (err) {
        // console.error('SignalR Connection Error: ', err);
        setTimeout(() => startSignalRConnection(connection), 5000);
    }
};

export const SignalRConnection = async () => {
    // let connected = false;

    const options = {
        //logMessageContent: isDev,
        logger: LogLevel.Warning,/*LogLevel.Error,*/
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

    await startSignalRConnection(connection);

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
        connection.id = userInfo.connectionId;
        // var datalist = document.getElementById("networks");
        // var newOption = document.createElement("option");

        //newOption.value = connectionId;
        //datalist.appendChild(newOption);
    });

    connection.on("JoinedGroup", async function (userInfo) {
        connection.user = userInfo.userName;
        connection.group = userInfo.group;

        /*
        document.getElementById("user").value = userInfo.userName;
        document.getElementById("group").value = userInfo.group;
        */
        // user = userInfo.userName;
        // await refreshGroups();
    });

    connection.on("RemovedGroup", function (userInfo) {
        document.getElementById("group").value = userInfo.group;
        // user = userInfo.userName;
    });

    connection.on("SendGroupList", function (groupList) {
        var groups = document.getElementById("groupList");
        while (groups.options.length) {
            groups.remove(0);
        }
        var options = groups.options;
        options[0] = new Option("", "");
        for (let i = 0; i < groupList.length; i++) {
            options[options.length] = new Option(groupList[i], groupList[i]);
        }
    });

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

