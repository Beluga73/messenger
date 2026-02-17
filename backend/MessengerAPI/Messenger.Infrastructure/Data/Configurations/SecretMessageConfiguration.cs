using Messenger.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Messenger.Infrastructure.Data.Configurations;

public class SecretMessageConfiguration : IEntityTypeConfiguration<SecretMessage>
{
    public void Configure(EntityTypeBuilder<SecretMessage> builder)
    {
        builder.HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(m => new { m.SecretChatId, m.SentAt });
        builder.HasIndex(m => m.ExpiresAt)
            .HasFilter("\"ExpiresAt\" IS NOT NULL AND \"IsDestroyed\" = false");
    }
}
