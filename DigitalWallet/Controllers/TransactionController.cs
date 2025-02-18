using Microsoft.AspNetCore.Mvc;
using DigitalWalletAPI.Data;
using DigitalWalletAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using DigitalWalletAPI.Enums;
using DigitalWalletAPI.WSS;
using DigitalWalletAPI.Middleware;
using Microsoft.AspNetCore.Authorization;
using DigitalWalletAPI.DTOs;

namespace DigitalWalletAPI.Controllers
{
    /// <summary>
    /// Handles transactions: transfers, deposits, and withdrawals.
    /// </summary>

    [Authorize]
    [ServiceFilter(typeof(AuthorizeUser))]
    [ApiController]
    [Route("api/transactions")]
    public class TransactionController(WalletDbContext context, WebSocketService webSocketService) : ControllerBase
    {
        private readonly WalletDbContext _context = context;
        private readonly WebSocketService _webSocketService = webSocketService;

        /// <summary>
        /// Retrieves all transactions associated with a user.
        /// </summary>
        /// <param name="userId">The ID of the user whose transactions are to be retrieved.</param>
        /// <returns>A list of transactions for the specified user.</returns>
        /// <response code="200">Returns the list of transactions.</response>
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetTransactions(int userId)
        {
            var transactions = await _context.Transactions
                .Include(t => t.SenderWallet)
                    .ThenInclude(w => w!.User)
                .Include(t => t.ReceiverWallet)
                    .ThenInclude(w => w!.User)
                .Where(t => (t.SenderWallet != null && t.SenderWallet.UserId == userId)
                         || (t.ReceiverWallet != null && t.ReceiverWallet.UserId == userId))
                .OrderByDescending(t => t.CreatedAt)
                .Take(100)
                .ToListAsync();
            var transactionDTOs = transactions.Select(t => new TransactionDTO
            {
                Id = t.Id,
                Type = t.Type.ToString(),
                Amount = t.Amount,
                SenderWalletId = t.SenderWalletId,
                ReceiverWalletId = t.ReceiverWalletId,
                SenderUsername = t.SenderWallet != null ? t.SenderWallet.User?.Username : null,
                ReceiverUsername = t.ReceiverWallet != null ? t.ReceiverWallet.User?.Username : null,
                Status = t.Status.ToString(),
                CreatedAt = t.CreatedAt
            }).ToList();

            return Ok(transactionDTOs);
        }

        /// <summary>
        /// Creates a new transaction (transfer, deposit, or withdrawal).
        /// </summary>
        /// <param name="transactionDto">The transaction object containing the necessary details.</param>
        /// <returns>Returns a success message and transaction details if successful.</returns>
        /// <response code="200">Transaction was successful.</response>
        /// <response code="400">Invalid transaction details provided.</response>
        /// <response code="404">One or more wallets were not found.</response>
        /// <response code="500">Internal server error occurred.</response>
        /// 

        [HttpPost("{userId}")]
        public async Task<IActionResult> CreateTransaction([FromBody] TransactionDTO transactionDto)
        {
            if (transactionDto.Amount <= 0)
                return BadRequest(new { message = "Transaction amount must be greater than zero." });

            var userIdClaim = HttpContext.User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int tokenUserId))
            {
                return Unauthorized(new { message = "Invalid or missing User ID in token." });
            }

            await using var dbTransaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
            try
            {
                Wallet? senderWallet = null;
                Wallet? receiverWallet = null;

                if (transactionDto.Type == "transfer")
                {
                    if (transactionDto.SenderWalletId != null)
                    {
                        //ensures that the sender wallet id belongs to the user who sent the request
                        senderWallet = await _context.Wallets.FirstOrDefaultAsync(w => w.Id == transactionDto.SenderWalletId);
                        if (senderWallet == null || senderWallet.UserId != tokenUserId)
                        {
                            return Unauthorized(new { message = "Unauthorized: Sender wallet does not belong to the user." });
                        }
                    }

                    // If ReceiverWalletId is null, lookup using ReceiverUsername
                    if (!string.IsNullOrWhiteSpace(transactionDto.ReceiverUsername))
                    {
                        receiverWallet = await _context.Wallets
                            .Include(w => w.User)
                            .FirstOrDefaultAsync(w => w.User!.Username == transactionDto.ReceiverUsername);

                        if (receiverWallet == null)
                            return NotFound(new { message = "Receiver wallet not found for provided username." });

                        transactionDto.ReceiverWalletId = receiverWallet.Id; // Assign the found ID
                    }
                    else if (transactionDto.ReceiverWalletId != null)
                    {
                        receiverWallet = await _context.Wallets
                            .FirstOrDefaultAsync(w => w.Id == transactionDto.ReceiverWalletId);

                        if (receiverWallet == null)
                            return NotFound(new { message = "Receiver wallet not found for provided username." });
                    }
                    else
                    {
                        return BadRequest(new { message = "Receiver wallet or a valid username must be provided for transfers." });
                    }

                    senderWallet = await _context.Wallets
                        .FirstOrDefaultAsync(w => w.Id == transactionDto.SenderWalletId);

                    if (senderWallet == null || receiverWallet == null)
                        return NotFound(new { message = "One or both wallets not found." });

                    if (senderWallet.Id == receiverWallet.Id )
                        return BadRequest(new { message = "You cannot transfer to your own account" });

                    if (senderWallet.Balance < transactionDto.Amount)
                        return BadRequest(new { message = "Insufficient funds." });

                    senderWallet.Balance -= transactionDto.Amount;
                    receiverWallet.Balance += transactionDto.Amount;
                }
                else if (transactionDto.Type == "deposit")
                {
                    if (transactionDto.ReceiverWalletId == null)
                        return BadRequest(new { message = "Receiver wallet must be provided for deposits." });

                    receiverWallet = await _context.Wallets
                        .FirstOrDefaultAsync(w => w.Id == transactionDto.ReceiverWalletId);

                    if (receiverWallet == null) return NotFound(new { message = "Receiver wallet not found." });

                    receiverWallet.Balance += transactionDto.Amount;
                }
                else if (transactionDto.Type == "withdrawal")
                {
                    if (transactionDto.SenderWalletId == null)
                        return BadRequest(new { message = "Sender wallet must be provided for withdrawals." });

                    senderWallet = await _context.Wallets
                        .FirstOrDefaultAsync(w => w.Id == transactionDto.SenderWalletId);

                    if (senderWallet == null) return NotFound(new { message = "Sender wallet not found." });

                    if (senderWallet.Balance < transactionDto.Amount)
                        return BadRequest(new { message = "Insufficient funds." });

                    senderWallet.Balance -= transactionDto.Amount;
                }


                var transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                    Type = Enum.Parse<TransactionType>(transactionDto.Type, true),
                    Amount = transactionDto.Amount,
                    SenderWalletId = transactionDto.SenderWalletId,
                    ReceiverWalletId = transactionDto.ReceiverWalletId,
                    Status = TransactionStatus.completed,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();
                await dbTransaction.CommitAsync();

                transactionDto.Status = transaction.Status.ToString();
                transactionDto.Id = transaction.Id;
                transactionDto.CreatedAt = transaction.CreatedAt;

                if (senderWallet != null)
                    await _webSocketService.SendBalanceUpdate(senderWallet.Id, senderWallet.Balance, transactionDto);

                if (receiverWallet != null)
                    await _webSocketService.SendBalanceUpdate(receiverWallet.Id, receiverWallet.Balance, transactionDto);

                return Ok(new { message = "Transaction successful.", transactionDto });
            }
            catch (Exception ex)
            {
                await dbTransaction.RollbackAsync();
                return StatusCode(500, new { message = "Transaction failed please try again ", details = ex.Message });
            }
        }

    }
}