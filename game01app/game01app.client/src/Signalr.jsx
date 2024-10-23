import * as signalR from '@microsoft/signalr'

const URL = "https://localhost:7276/messageHub";

export const InitSignalRConnection = () => {

    const conn = new signalR.HubConnectionBuilder()
        .withUrl(URL, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();


    conn.start().catch(err => console.error("Connection failed: ", err));
};


