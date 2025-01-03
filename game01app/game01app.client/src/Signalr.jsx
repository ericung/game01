import {
  JsonHubProtocol,
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType
} from '@microsoft/signalr';

const URL = "https://localhost:7276/messageHub";

export class SignalRConnection  {
    constructor() {
        let connected = false;

        const options = {
            logger: LogLevel.Warning,/*LogLevel.Error,*/
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        };

         const connection = new HubConnectionBuilder()
            .withUrl(URL, options)
            .withAutomaticReconnect()
            .withHubProtocol(new JsonHubProtocol())
            .configureLogging(LogLevel.Information)
            .build();

        connection.serverTimeoutInMilliseconds = 60000;
        connection.keepAliveIntervalInMilliseconds = 15000;

        const startSignalRConnection = async () => {
            try {
                await connection.start().then(function () {
                    connected = true;
                }).catch(function () {
                    return "";
                });
            } catch (err) {
                console.log(err.toString());
                setTimeout(() => startSignalRConnection(connection), 5000);
            }
        };

        connection.on("ReceiveMessage", function (user, message) {
            if (message.Message.Blue !== undefined) {
                connection.unitsBlue = message.Message.Blue;
            }

            if (message.Message.Red !== undefined) {
                connection.unitsRed = message.Message.Red;
            }

            if (message.Message.Ball !== undefined) {
                connection.ball = message.Message.Ball;
            }

            // send draw event
            // draw()
        });

        connection.on("Connected", function (userInfo) {
            connection.id = userInfo.connectionId;
        });

        connection.on("JoinedGroup", async function (userInfo) {
            connection.user = userInfo.userName;
            connection.group = userInfo.group;
        });

        connection.on("RemovedGroup", function () {
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

        connection.onclose(async () => {
            // await startSignalRConnection();
        });

        startSignalRConnection();

        return connection;
    }
};

