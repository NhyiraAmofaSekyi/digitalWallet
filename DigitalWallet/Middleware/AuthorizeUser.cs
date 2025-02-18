using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using DigitalWalletAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace DigitalWalletAPI.Middleware
{
    /// <summary>
    /// Authorization filter that ensures the correct user is making the request.
    /// </summary>
    public class AuthorizeUser(WalletDbContext dbContext) : IAsyncActionFilter
    {
        private readonly WalletDbContext _dbContext = dbContext;


        /// <summary>
        /// Executes before the action method and validates if the authenticated user is authorized
        /// to access the requested resource.
        /// </summary>
        /// <param name="context">The action execution context.</param>
        /// <param name="next">The delegate to execute the next filter or action.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var httpContext = context.HttpContext;
            var userIdClaim = httpContext.User.FindFirst("userId");

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int tokenUserId))
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Invalid or missing User ID in token." });
                return;
            }

            // Validate userId from route to ensure the user resources are associated with the user in the token
            if (context.ActionArguments.ContainsKey("userId"))
            {
                if (!int.TryParse(context.ActionArguments["userId"]?.ToString(), out int routeUserId) || routeUserId != tokenUserId)
                {
                    context.Result = new ObjectResult(new { message = "Unauthorized: User ID mismatch." }) { StatusCode = 403 };
                    return;
                }
            }

             // Validate walletId from route to ensure the user resources are associated with the user in the token
            if (context.ActionArguments.ContainsKey("walletId"))
            {
                if (!Guid.TryParse(context.ActionArguments["walletId"]?.ToString(), out Guid walletId))
                {
                    context.Result = new BadRequestObjectResult(new { message = "Invalid Wallet ID." });
                    return;
                }

                var wallet = await _dbContext.Wallets.FirstOrDefaultAsync(w => w.Id == walletId);
                if (wallet == null)
                {
                    context.Result = new NotFoundObjectResult(new { message = "Wallet not found." });
                    return;
                }

                if (wallet.UserId != tokenUserId)
                {
                    context.Result = new ObjectResult(new { message = "Unauthorized: Wallet does not belong to user." }) { StatusCode = 403 };
                    return;
                }
            }

            await next(); 
        }
    }
}
