namespace Messenger.Application.Dtos;

public record StartPhoneVerificationDto(string PhoneNumber, string RecaptchaToken);

public record CompletePhoneVerificationDto(string PhoneNumber, string Code, string SessionInfo);

