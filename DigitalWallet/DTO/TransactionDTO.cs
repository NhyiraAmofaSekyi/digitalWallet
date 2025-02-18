using System;

namespace DigitalWalletAPI.DTOs
{
    public class TransactionDTO
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public Guid? SenderWalletId { get; set; }
        public Guid? ReceiverWalletId { get; set; }
        public string? SenderUsername { get; set; }
        public string? ReceiverUsername { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
