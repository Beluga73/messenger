using System.Security.Cryptography;
using System.Text;
using Messenger.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Messenger.Application.Services;

/// <summary>
/// Server-side AES-256-CBC encryption service for client-server message encryption.
/// Uses a server-managed master key from configuration to encrypt messages at rest.
/// </summary>
public class EncryptionService : IEncryptionService
{
    private readonly byte[] _masterKey;

    public EncryptionService(IConfiguration configuration)
    {
        var keyString = configuration["Encryption:MasterKey"];
        if (string.IsNullOrEmpty(keyString))
            throw new InvalidOperationException(
                "Encryption:MasterKey is not configured. " +
                "Generate a 256-bit key with: Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))");

        _masterKey = Convert.FromBase64String(keyString);
        
        if (_masterKey.Length != 32)
            throw new InvalidOperationException("Encryption master key must be exactly 256 bits (32 bytes).");
    }

    /// <inheritdoc />
    public (string EncryptedContent, string Iv) Encrypt(string plaintext)
    {
        using var aes = Aes.Create();
        aes.Key = _masterKey;
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor();
        var plaintextBytes = Encoding.UTF8.GetBytes(plaintext);
        var cipherBytes = encryptor.TransformFinalBlock(plaintextBytes, 0, plaintextBytes.Length);

        return (
            Convert.ToBase64String(cipherBytes),
            Convert.ToBase64String(aes.IV)
        );
    }

    /// <inheritdoc />
    public string Decrypt(string encryptedContent, string iv)
    {
        using var aes = Aes.Create();
        aes.Key = _masterKey;
        aes.IV = Convert.FromBase64String(iv);
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;

        using var decryptor = aes.CreateDecryptor();
        var cipherBytes = Convert.FromBase64String(encryptedContent);
        var plaintextBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);

        return Encoding.UTF8.GetString(plaintextBytes);
    }
}
