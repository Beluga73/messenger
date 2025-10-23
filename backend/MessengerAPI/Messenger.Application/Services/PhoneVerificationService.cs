namespace Messenger.Application.Services;
using Microsoft.Extensions.Options;
using Twilio;
using Twilio.Rest.Verify.V2.Service;

public class PhoneVerificationService(IOptions<TwillioSettings> twillioSettings)
{
    public string SendVerificationCode(string phoneNumber)
    {
        TwilioClient.Init(twillioSettings.Value.AccountSid, twillioSettings.Value.AuthToken);

        var verification = VerificationResource.Create(
            to: phoneNumber,
            channel: "sms",
            pathServiceSid: twillioSettings.Value.PathServiceSid
        );
        
        return verification.Status;
    }
    
    public string VerifyCode(string phoneNumber, string code)
    {
        TwilioClient.Init(twillioSettings.Value.AccountSid, twillioSettings.Value.AuthToken);
        
        var verificationCheck = VerificationCheckResource.Create(
            to: phoneNumber,
            code: code,
            pathServiceSid: twillioSettings.Value.PathServiceSid
        );
        
        return verificationCheck.Status;
    }
}