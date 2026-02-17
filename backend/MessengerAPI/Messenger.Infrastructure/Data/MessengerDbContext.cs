using Microsoft.EntityFrameworkCore;
using Messenger.Domain.Entities;
using Messenger.Infrastructure.Data.Configurations;

namespace Messenger.Infrastructure.Data;

public class MessengerDbContext(DbContextOptions<MessengerDbContext> options ) : DbContext(options)
{
    
    
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<GroupMember> GroupMembers { get; set; }
    public DbSet<GroupMessage> GroupMessages { get; set; }
    public DbSet<SecretChat> SecretChats { get; set; }
    public DbSet<SecretMessage> SecretMessages { get; set; }
    
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
        modelBuilder.ApplyConfiguration(new ConversationConfiguration());
        modelBuilder.ApplyConfiguration(new MessageConfiguration());
        modelBuilder.ApplyConfiguration(new GroupConfiguration());
        modelBuilder.ApplyConfiguration(new GroupMemberConfiguration());
        modelBuilder.ApplyConfiguration(new GroupMessageConfiguration());
        modelBuilder.ApplyConfiguration(new SecretChatConfiguration());
        modelBuilder.ApplyConfiguration(new SecretMessageConfiguration());
    }
}