using game01.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Net.WebSockets;

namespace Objects
{

    public class ConnectionHub : Hub
    {
        private static ConcurrentDictionary<string, User> ConnectionMap = new ConcurrentDictionary<string, User>();
        private static ConcurrentDictionary<string, List<User>> GroupMap = new ConcurrentDictionary<string, List<User>>();

        public async Task JoinGroup(string connectionId, string groupName)
        {
            try
            {
                GroupMap.TryAdd(groupName, new List<User>());
                await Groups.AddToGroupAsync(connectionId, groupName);

                switch (GroupMap[groupName].Count)
                {
                    case 0:
                        ConnectionMap[connectionId].UserName = "red";
                        break;
                    case 1:
                        ConnectionMap[connectionId].UserName = "blue";
                        break;
                    default:
                        ConnectionMap[connectionId].UserName = "";
                        break;
                }

                ConnectionMap[connectionId].Group = groupName;
                GroupMap[groupName].Add(ConnectionMap[connectionId]);
            }
            catch
            {

            }

            await Clients.Client(connectionId).SendAsync("JoinedGroup", ConnectionMap[connectionId]);
        }

        public async Task LeaveGroup(string connectionId, string groupName)
        {
            try
            {
                if (GroupMap.ContainsKey(groupName))
                {
                    await Groups.RemoveFromGroupAsync(connectionId, groupName);
                    ConnectionMap[connectionId].Group = "";
                    GroupMap[groupName].Remove(ConnectionMap[connectionId]);
                    List<User> output;
                    if (GroupMap[groupName].Count == 0)
                    {
                        GroupMap.TryRemove(groupName, out output);
                        foreach(User user in output)
                        {
                            user.Group = String.Empty;
                        }
                    }
                }
            }
            catch
            {

            }

            await Clients.Client(Context.ConnectionId).SendAsync("RemovedGroup", ConnectionMap[Context.ConnectionId]);
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public async Task Connect()
        {
            ConnectionMap.TryAdd(Context.ConnectionId,
                new User
                {
                    ConnectionId = Context.ConnectionId,
                    UserName = "red",
                    Group = String.Empty
                });

            await Clients.Client(Context.ConnectionId).SendAsync("Connected", ConnectionMap[Context.ConnectionId]);
        }

        public async Task SendMessage(string user,  Unit message)
        {
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", user, message);
        }
    }
}
