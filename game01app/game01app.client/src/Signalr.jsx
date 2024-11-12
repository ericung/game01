import {
  JsonHubProtocol,
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType
} from '@microsoft/signalr';
import * as signalR from "@microsoft/signalr";

const URL = "https://localhost:7276/messageHub";

class SignalRConnection  {
    constructor() {
        this.connection = null;
    }

    startSignalRConnection = () => {
        let connected = false;

        const options = {
            logger: LogLevel.Warning,/*LogLevel.Error,*/
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        };

        this.connection = new HubConnectionBuilder()
            .withUrl(URL, options)
            .withAutomaticReconnect()
            .withHubProtocol(new JsonHubProtocol())
            .configureLogging(LogLevel.Information)
            .build();

        this.connection.serverTimeoutInMilliseconds = 60000;
        this.connection.keepAliveIntervalInMilliseconds = 15000;

        const startSignalRConnection = async () => {
            try {
                if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
                    await this.connection.start().then(function () {
                        connected = true;
                    }).catch(function () {
                        return "";
                    });
                }
            } catch (err) {
                console.log(err.toString());
                setTimeout(() => startSignalRConnection(this.connection), 5000);
            }
        };

        this.connection.on("ReceiveMessage", function (user, message) {
            if (message.Message.Blue !== undefined) {
                this.connection.unitsBlue = message.Message.Blue;
            }

            if (message.Message.Red !== undefined) {
                this.connection.unitsRed = message.Message.Red;
            }

            if (message.Message.Ball !== undefined) {
                this.connection.ball = message.Message.Ball;
            }

            // send draw event
            // draw()
        });

        this.connection.on("Connected", function (userInfo) {
            this.connection.id = userInfo.this.connectionId;
        });

        this.connection.on("JoinedGroup", async function (userInfo) {
            this.connection.user = userInfo.userName;
            this.connection.group = userInfo.group;
        });

        this.connection.on("RemovedGroup", function () {
        });

        this.connection.on("SendGroupList", function (groupList) {
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

        this.connection.onclose(async () => {
            await startSignalRConnection();
        });

        return this.connection;
    }
};

const signalRConnection = new SignalRConnection();

export default signalRConnection;
