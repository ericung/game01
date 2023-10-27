using game01.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Net.WebSockets;

namespace Hubs
{

    public class ConnectionHub : Hub
    {
        // When the application scales, we'll need to put this information in a cache.
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

        public async Task LeaveGroup(string connectionId)
        {
            var groupName = ConnectionMap[connectionId].Group;

            if ((groupName is null) || (groupName == string.Empty))
            {
                return;
            }

            try
            {

                if (GroupMap.ContainsKey(groupName))
                {
                    await Groups.RemoveFromGroupAsync(connectionId, groupName);
                    ConnectionMap[connectionId].Group = "";
                    foreach(User user in GroupMap[groupName])
                    {
                        user.Group = String.Empty;
                    }
                    GroupMap[groupName].Remove(ConnectionMap[connectionId]);
                    GroupMap.TryRemove(groupName, out _);
                }
            }
            catch
            {

            }

            await Clients.Client(Context.ConnectionId).SendAsync("RemovedGroup", ConnectionMap[Context.ConnectionId]);
        }

        public async Task GetGroups(string connectionId)
        {
            List<string> keys = new List<string>(GroupMap.Keys);
            List<string> toRemove = new List<string>();
            for(int i = 0; i < keys.Count; i++)
            {
                if (GroupMap[keys[i]].Count == 0)
                {
                    toRemove.Add(keys[i]);
                }
            }

            foreach(string key in toRemove)
            {
                GroupMap.TryRemove(key, out _);
                keys.Remove(key);
            }

            await Clients.Client(connectionId).SendAsync("SendGroupList", keys);
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }


        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var groupName = ConnectionMap[Context.ConnectionId].Group ?? String.Empty;
            ConnectionMap.TryRemove(Context.ConnectionId, out _);
            GroupMap.TryRemove(groupName, out _);
            return base.OnDisconnectedAsync(exception);
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
