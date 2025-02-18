using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DigitalWalletAPI.Enums;

namespace DigitalWalletAPI.Models
{
    [Table("transactions")] 
    public class Transaction
    {
        [Key]
        [Column("id")] 
        public Guid Id { get; set; } = Guid.NewGuid(); 

        [Required]
        [Column("type", TypeName = "transaction_type")] 
        public TransactionType Type { get; set; }

        [Required]
        [Column("amount")]
        public decimal Amount { get; set; }

        [ForeignKey("SenderWallet")]
        [Column("sender_wallet_id")]
        public Guid? SenderWalletId { get; set; }

        [ForeignKey(nameof(SenderWalletId))]
        public virtual Wallet? SenderWallet { get; set; } 

        [ForeignKey("ReceiverWallet")]
        [Column("receiver_wallet_id")]
        public Guid? ReceiverWalletId { get; set; }

        [ForeignKey(nameof(ReceiverWalletId))]
        public virtual Wallet? ReceiverWallet { get; set; }
       
        [Required]
        [Column("status", TypeName = "transaction_status")] 
        public TransactionStatus Status { get; set; } = TransactionStatus.pending;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
