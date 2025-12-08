using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Messenger.Application.Dtos;
using Microsoft.Extensions.Options;

namespace Messenger.Application.Services;

public class PhoneVerificationService(HttpClient httpClient, IOptions<FirebaseSettings> firebaseOptions)
{
    private const string BaseUrl = "https://identitytoolkit.googleapis.com/v1";
    private readonly FirebaseSettings _firebaseSettings = firebaseOptions.Value;

    public async Task<string> SendVerificationCode(StartPhoneVerificationDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_firebaseSettings.ApiKey))
            throw new InvalidOperationException("Firebase API key is not configured.");

        var response = await httpClient.PostAsJsonAsync(
            $"{BaseUrl}/accounts:sendVerificationCode?key={_firebaseSettings.ApiKey}",
            new { dto.PhoneNumber, dto.RecaptchaToken },
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException($"Failed to send verification code via Firebase: {error}");
        }

        var payload = await response.Content.ReadFromJsonAsync<SendVerificationResponse>(cancellationToken)
                      ?? throw new InvalidOperationException("Firebase response missing session info.");

        if (string.IsNullOrWhiteSpace(payload.SessionInfo))
            throw new InvalidOperationException("Firebase response did not include session info.");

        return payload.SessionInfo;
    }

    public async Task<VerifiedPhoneResult> VerifyCode(CompletePhoneVerificationDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_firebaseSettings.ApiKey))
            throw new InvalidOperationException("Firebase API key is not configured.");

        var response = await httpClient.PostAsJsonAsync(
            $"{BaseUrl}/accounts:signInWithPhoneNumber?key={_firebaseSettings.ApiKey}",
            new { dto.SessionInfo, dto.Code },
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException($"Failed to verify code via Firebase: {error}");
        }

        var payload = await response.Content.ReadFromJsonAsync<VerifyCodeResponse>(cancellationToken)
                      ?? throw new InvalidOperationException("Firebase verification response is empty.");

        if (string.IsNullOrWhiteSpace(payload.PhoneNumber))
            throw new InvalidOperationException("Firebase verification did not return a phone number.");

        if (!string.Equals(payload.PhoneNumber, dto.PhoneNumber, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Phone number mismatch during verification.");

        return new VerifiedPhoneResult(payload.IdToken, payload.PhoneNumber);
    }

    private record SendVerificationResponse([property: JsonPropertyName("sessionInfo")] string SessionInfo);

    private record VerifyCodeResponse(
        [property: JsonPropertyName("idToken")] string IdToken,
        [property: JsonPropertyName("phoneNumber")] string PhoneNumber);

    public record VerifiedPhoneResult(string IdToken, string PhoneNumber);
}