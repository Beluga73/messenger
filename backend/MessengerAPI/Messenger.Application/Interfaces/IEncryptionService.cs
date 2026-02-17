namespace Messenger.Application.Interfaces;

/// <summary>
/// Server-side encryption service for client-server message encryption.
/// Uses AES-256-CBC for encrypting message content at rest.
/// </summary>
public interface IEncryptionService
{
    /// <summary>
    /// Encrypt plaintext content using AES-256. Returns (ciphertext, iv) both Base64-encoded.
    /// </summary>
    (string EncryptedContent, string Iv) Encrypt(string plaintext);
    
    /// <summary>
    /// Decrypt AES-256 encrypted content using the provided IV.
    /// </summary>
    string Decrypt(string encryptedContent, string iv);
}
