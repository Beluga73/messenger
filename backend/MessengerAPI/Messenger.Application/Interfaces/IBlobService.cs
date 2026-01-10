using Azure.Storage.Blobs.Models;

namespace Messenger.Application.Interfaces;

public interface IBlobService
{
    string GenerateUploadSasUri(string blobName);
}