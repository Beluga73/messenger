using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Messenger.Application.Interfaces;

namespace Messenger.Application.Services;

public class BlobService : IBlobService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName = "userpfps";

    public BlobService(BlobServiceClient blobServiceClient)
    {
        _blobServiceClient = blobServiceClient;
    }

    public string GenerateUploadSasUri(string blobName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient(blobName);

        // Create a SAS token that's valid for 10 minutes
        BlobSasBuilder sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = _containerName,
            BlobName = blobName,
            Resource = "b", // "b" stands for blob
            ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(10)
        };

        sasBuilder.SetPermissions(BlobSasPermissions.Write | BlobSasPermissions.Create);

        // Generate the full URI including the token
        return blobClient.GenerateSasUri(sasBuilder).ToString();
    }
}