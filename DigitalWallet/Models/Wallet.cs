using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DigitalWalletAPI.Models
{
    [Table("wallets")] 
    public class Wallet
    {
        [Key]
        [Column("id")] 
        public Guid Id { get; set; } = Guid.NewGuid(); 

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
        

        [Required]
        [Column("balance")]
        public decimal Balance { get; set; } = 0.00m;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
