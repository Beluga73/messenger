namespace Messenger.Application;

public class AuthSettings
{
    public TimeSpan TokenExpiration { get; set; }
    
    public string SecretKey { get; set; }
}