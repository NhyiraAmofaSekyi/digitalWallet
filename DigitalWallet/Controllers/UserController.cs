using Microsoft.AspNetCore.Mvc;
using DigitalWalletAPI.Data;
using DigitalWalletAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using DigitalWalletAPI.Middleware;
using DigitalWalletAPI.WSS;
using System.Net.WebSockets;

namespace DigitalWalletAPI.Controllers
{
    /// <summary>
    /// Manages user-related operations, including retrieving user information
    /// and establishing WebSocket connections.
    /// </summary>
    [Authorize]
    [ServiceFilter(typeof(AuthorizeUser))]
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly WalletDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly WebSocketService _webSocketService;

        /// <summary>
        /// Initializes a new instance of the <see cref="UsersController"/> class.
        /// </summary>
        /// <param name="context">The EF Core context for database operations.</param>
        /// <param name="configuration">The application configuration for accessing app settings.</param>
        /// <param name="webSocketService">Service for managing WebSocket connections.</param>
        public UsersController(
            WalletDbContext context,
            IConfiguration configuration,
            WebSocketService webSocketService)
        {
            _context = context;
            _configuration = configuration;
            _webSocketService = webSocketService;
        }

        /// <summary>
        /// Retrieves user information by user ID and the associated wallet data, if any.
        /// </summary>
        /// <param name="walletId">The identifier of the user to retrieve.</param>
        /// <returns>
        /// A status code of 200 (OK) along with the user and wallet information,
        /// or 404 (Not Found) if the user does not exist.
        /// </returns>
        [HttpGet("connect/{walletId}")]
        public async Task Connect(Guid walletId)
        {
            if (!HttpContext.WebSockets.IsWebSocketRequest)
            {
                HttpContext.Response.StatusCode = 400;
                await HttpContext.Response.WriteAsync("WebSocket requests only.");
                return;
            }

            using WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            _webSocketService.AddClient(walletId, webSocket);

            var buffer = new byte[1024 * 4];

            try
            {
                while (webSocket.State == WebSocketState.Open)
                {
                    var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        Console.WriteLine($"❌ Client disconnected: {walletId}");
                        break;
                    }
                }
            }
            catch (WebSocketException ex)
            {
                Console.WriteLine($"⚠️ WebSocket error: {ex.Message}");
            }
            finally
            {
                await _webSocketService.RemoveClient(walletId);
            }
        }

    }
}
