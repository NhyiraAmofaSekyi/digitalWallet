using System.Net.WebSockets;
using System.Text;
using System.Collections.Concurrent;
using System.Text.Json;
using DigitalWalletAPI.DTOs;

namespace DigitalWalletAPI.WSS
{
    public class WebSocketService
    {
        private static readonly ConcurrentDictionary<Guid, WebSocket> _clients = new();
        private static readonly ConcurrentDictionary<Guid, CancellationTokenSource> _pingTokens = new();

        public void AddClient(Guid walletId, WebSocket webSocket)
        {
            if (_clients.TryGetValue(walletId, out var existingSocket))
            {
                Console.WriteLine($"🔄 Replacing existing WebSocket for Wallet {walletId}");
                RemoveClient(walletId).Wait();
            }

            _clients[walletId] = webSocket;

        }

        private void StartPingRoutine(Guid walletId)
        {
            var cts = new CancellationTokenSource();
            _pingTokens[walletId] = cts;

            Task.Run(async () =>
            {
                while (!cts.Token.IsCancellationRequested)
                {
                    if (_clients.TryGetValue(walletId, out var socket) && socket.State == WebSocketState.Open)
                    {
                        try
                        {
                            await socket.SendAsync(Encoding.UTF8.GetBytes("ping"), WebSocketMessageType.Text, true, cts.Token);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"⚠️ WebSocket ping failed for Wallet {walletId}: {ex.Message}");
                            break;
                        }
                    }
                    else
                    {
                        Console.WriteLine($"🚫 WebSocket for Wallet {walletId} is closed.");
                        break;
                    }

                    await Task.Delay(TimeSpan.FromSeconds(30), cts.Token); // Ping every 30 seconds
                }

                await RemoveClient(walletId);
            }, cts.Token);
        }

        public async Task SendBalanceUpdate(Guid walletId, decimal balance, TransactionDTO transaction)
        {
            if (_clients.TryGetValue(walletId, out var socket) && socket.State == WebSocketState.Open)
            {
               var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true // Optional: makes the output more readable
                };

                var transactionJson = JsonSerializer.Serialize(transaction, options);
                var message = $"{{\"walletId\":\"{walletId}\", \"balance\": {balance} , \"transaction\": {transactionJson} }}";

                try
                {
                    await socket.SendAsync(Encoding.UTF8.GetBytes(message), WebSocketMessageType.Text, true, CancellationToken.None);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠️ WebSocket send error for Wallet {walletId}: {ex.Message}");
                    await RemoveClient(walletId);
                }
            }
            else
            {
                Console.WriteLine($"🚫 WebSocket for Wallet {walletId} is closed or not found.");
                await RemoveClient(walletId);
            }
        }

        public async Task RemoveClient(Guid walletId)
        {
            if (_clients.TryRemove(walletId, out var socket))
            {
                Console.WriteLine($"🔌 Closing WebSocket for Wallet {walletId}");

                if (_pingTokens.TryRemove(walletId, out var cts))
                {
                    cts.Cancel();
                }

                if (socket.State == WebSocketState.Open || socket.State == WebSocketState.CloseReceived)
                {
                    try
                    {
                        await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
                    }
                    catch (WebSocketException ex)
                    {
                        Console.WriteLine($"⚠️ WebSocket error while closing for Wallet {walletId}: {ex.Message}");
                    }
                }
            }
        }
    }
}
