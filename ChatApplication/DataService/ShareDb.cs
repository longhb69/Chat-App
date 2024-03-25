using System.Collections.Concurrent;
using ChatApplication.Models;

namespace ChatApplication.DataService
{
    public class ShareDB
    {
        private readonly ConcurrentDictionary<string, UserConnection> _connections = new();
        private readonly ConcurrentDictionary<string, UserConnection2> _connections2 = new();
        private readonly ConcurrentDictionary<string, string> _userConnectionMap = new();

        public ConcurrentDictionary<string, UserConnection> connections => _connections;
        public ConcurrentDictionary<string, UserConnection2> connections2 => _connections2;
        public ConcurrentDictionary<string, string> userConnectionMap => _userConnectionMap;

    }
}
