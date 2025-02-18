using DigitalWalletAPI.Models;
using DigitalWalletAPI.Enums;
using Microsoft.EntityFrameworkCore;

namespace DigitalWalletAPI.Data
{
    public class WalletDbContext(DbContextOptions<WalletDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Wallet>().ToTable("wallets");
            modelBuilder.Entity<Transaction>().ToTable("transactions");

            modelBuilder.HasPostgresEnum<TransactionStatus>();
            modelBuilder.HasPostgresEnum<TransactionType>();


            modelBuilder.Entity<Wallet>()
                .HasOne(w => w.User)
                .WithMany() // User does not have a collection of wallets
                .HasForeignKey(w => w.UserId)
                .HasConstraintName("fk_wallet_user")
                .OnDelete(DeleteBehavior.Cascade); // Delete wallet when user is deleted


            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.SenderWallet)
                .WithMany()
                .HasForeignKey(t => t.SenderWalletId)
                .HasConstraintName("fk_transaction_sender_wallet")
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.ReceiverWallet)
                .WithMany()
                .HasForeignKey(t => t.ReceiverWalletId)
                .HasConstraintName("fk_transaction_receiver_wallet")
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }

    }
}
