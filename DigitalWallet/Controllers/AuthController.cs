using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using DigitalWalletAPI.Data;
using DigitalWalletAPI.Models;

namespace DigitalWalletAPI.Controllers
{
    /// <summary>
    /// Handles user authentication, including login, logout, and JWT token generation.
    /// </summary>
    [ApiController]
    [Route("api/auth")]
    public class AuthController(WalletDbContext context, IConfiguration configuration) : ControllerBase
    {
        private readonly WalletDbContext _context = context;
        private readonly IConfiguration _configuration = configuration;

        /// <summary>
        /// Registers a new user and returns a JWT token in an HTTP-only cookie.
        /// </summary>
        /// <param name="registerRequest">User registration details (username and password).</param>
        /// <returns>Returns a success message if registration is successful, otherwise returns an error message.</returns>
        /// <response code="200">User registered successfully.</response>
        /// <response code="400">Invalid request or username already exists.</response>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User registerRequest)
        {
            if (string.IsNullOrWhiteSpace(registerRequest.Username) || string.IsNullOrWhiteSpace(registerRequest.PasswordHash))
            {
                return BadRequest(new { message = "Username and password are required." });
            }

            // Check if username already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == registerRequest.Username);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Username is already taken." });
            }

            // Hash password before storing
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerRequest.PasswordHash);

            // Create user
            var newUser = new User
            {
                Username = registerRequest.Username,
                PasswordHash = hashedPassword
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = GenerateJwtToken(newUser);

            // Create a wallet for the new user
            var newWallet = new Wallet
            {
                Id = Guid.NewGuid(),
                UserId = newUser.Id,
                Balance = 0
            };

            _context.Wallets.Add(newWallet);
            await _context.SaveChangesAsync();

            // Set JWT as HTTP-only cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(2)
            };

            Response.Cookies.Append("jwt", token, cookieOptions);

            return Ok(new { message = "User registered successfully", user = newUser, wallet = newWallet });
        }


        /// <summary>
        /// Authenticates a user and returns a JWT token in an HTTP-only cookie.
        /// </summary>
        /// <param name="loginRequest">User credentials (username and password).</param>
        /// <returns>Returns a success message if authentication is successful, otherwise returns an unauthorized error.</returns>
        /// <response code="200">User authenticated successfully.</response>
        /// <response code="401">Invalid credentials provided.</response>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginRequest)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginRequest.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.PasswordHash, user.PasswordHash))
                return Unauthorized(new { message = "Invalid credentials."});

            user.PasswordHash = "";
            var token = GenerateJwtToken(user);
            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == user.Id);



            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(2)
            };

            Response.Cookies.Append("jwt", token, cookieOptions);
            user.PasswordHash = "";

            return Ok(new { message = "Logged in successfully" , user, wallet });
        }

        /// <summary>
        /// Logs out the user by clearing the authentication cookie.
        /// </summary>
        /// <returns>Returns a success message when the user is logged out.</returns>
        /// <response code="200">User logged out successfully.</response>
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Logged out successfully" });
        }

        /// <summary>
        /// Generates a JWT token for authenticated users.
        /// </summary>
        /// <param name="user">The authenticated user.</param>
        /// <returns>A JWT token as a string.</returns>
        /// <exception cref="Exception">Throws if the JWT key is missing.</exception>
        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration.GetValue<string>("Jwt:Key");

            if (string.IsNullOrWhiteSpace(jwtKey))
                throw new Exception("JWT Key is missing or empty.");

            var key = Encoding.UTF8.GetBytes(jwtKey);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("userId", user.Id.ToString())
            };

            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
