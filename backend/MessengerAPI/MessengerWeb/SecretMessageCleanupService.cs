using Messenger.Application.Interfaces;

namespace MessengerWeb;

/// <summary>
/// Background service that periodically destroys expired self-destructing secret messages.
/// Runs every 30 seconds.
/// </summary>
public class SecretMessageCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<SecretMessageCleanupService> _logger;
    private readonly TimeSpan _interval = TimeSpan.FromSeconds(30);

    public SecretMessageCleanupService(IServiceProvider serviceProvider, ILogger<SecretMessageCleanupService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Secret message cleanup service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var secretChatService = scope.ServiceProvider.GetRequiredService<ISecretChatService>();
                await secretChatService.DestroyExpiredMessagesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up expired secret messages");
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }
}
