using game01.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Net.WebSockets;

namespace Objects
{
    
    public class ConnectionHub : Hub
    {
        private static ConcurrentDictionary<string, List<User>> ConnectionMap = new ConcurrentDictionary<string, List<User>>();

        public Task JoinGroup(string groupName)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public Task LeaveGroup(string groupName)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public async Task Connect()
        {

            if (!ConnectionMap.ContainsKey(Context.ConnectionId))
            {
                ConnectionMap.TryAdd(Context.ConnectionId, new List<User> { new User
                {
                    ConnectionId = Context.ConnectionId,
                    UserIdentifier = Context.User.Identity.Name,
                    UserName = "red"
                } });

                await Clients.All.SendAsync("Connected", ConnectionMap[Context.ConnectionId][0], ConnectionMap.Keys);

                return;
            }
            else if (ConnectionMap[Context.ConnectionId].Count == 1)
            {
                ConnectionMap[Context.ConnectionId].Add(new User
                {
                    ConnectionId = Context.ConnectionId,
                    UserIdentifier = Context.User.Identity.Name,
                    UserName = "blue"
                });

                await Clients.All.SendAsync("Connected", ConnectionMap[Context.ConnectionId][1], ConnectionMap.Keys);

                return;
            }
            await Clients.All.SendAsync("Connected", null);
        }

        public async Task SendMessage(string user,  Unit message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
