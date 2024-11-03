//import { HubConnection } from '@microsoft/signalr';
import { useEffect } from 'react';
//import { getSignalRConnection } from '@/utilities/signalr';
//import { useAppDispatch, useToast } from '@/hooks';
//import { telemetryReceived } from '@/pages/telemetry/reducers/telemetrySlice';
import { SignalRConnection } from './Signalr';

export const useConnectionHub = (connect) => {
    let connection;
    // const dispatch;
    // const toast;
    // let received = false;
  
    useEffect(() => {

        if (!connect) {
            return;
        }

        async function subscribe() {
            connection = await SignalRConnection();

          /*
          connection.on('subscribed', (response: string) => {
            console.log(response);
            toast(response, 'success');
          });

          connection.on('telemetry', (telemetryData: TelemetryData[]) => {
            if (!received) {
              received = true;
              toast('Receiving data...', 'info');
            }
            dispatch(telemetryReceived(telemetryData));
          });

          await connection.invoke('subscribe');
          */
        }

        subscribe();

        return () => {
            /*
            if (connection) {
                connection.invoke('unsubscribe').then(() => {
                    connection.off('subscribed');
                    connection.off('telemetry');

                    const message = 'Unsubscribed from Telemetry Hub'; 
                    console.log(message);

                    //toast(message, 'success');
                });
            }*/
        }

    }, [connect]);

}
