using Microsoft.EntityFrameworkCore;
using Messenger.Domain.Entities;
using Messenger.Infrastructure.Data.Configurations;

namespace Messenger.Infrastructure.Data;

public class MessengerDbContext(DbContextOptions<MessengerDbContext> options ) : DbContext(options)
{
    
    
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
    }
}