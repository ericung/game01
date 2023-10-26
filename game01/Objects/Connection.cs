using game01.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Objects
{
    public class ConnectionHub : Hub
    {
        public static ConcurrentDictionary<string, List<string>> ConnectedUsers = new ConcurrentDictionary<string, List<string>>();

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public async Task Connect()
        {
            await Clients.All.SendAsync("Connected", Context.ConnectionId);
        }

        public async Task SendMessage(string user,  Unit message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
