using Messenger.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Messenger.Infrastructure.Data.Configurations;

public class SecretChatConfiguration : IEntityTypeConfiguration<SecretChat>
{
    public void Configure(EntityTypeBuilder<SecretChat> builder)
    {
        builder.HasOne(sc => sc.Initiator)
            .WithMany()
            .HasForeignKey(sc => sc.InitiatorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(sc => sc.Participant)
            .WithMany()
            .HasForeignKey(sc => sc.ParticipantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(sc => sc.Messages)
            .WithOne(m => m.SecretChat)
            .HasForeignKey(m => m.SecretChatId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(sc => new { sc.InitiatorId, sc.ParticipantId });
        builder.HasIndex(sc => sc.Status);
    }
}
