using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Messenger.Application.Interfaces;

namespace Messenger.Application.Services;

public class BlobService : IBlobService
{
    private readonly BlobServiceClient _blobServiceClient;
    
    public BlobService(BlobServiceClient blobServiceClient)
    {
        _blobServiceClient = blobServiceClient;
    }

    public async Task GetBlobAsync(string fileName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient("images");
        var blobClient = containerClient.GetBlobClient(fileName);
        var blobInfo = await blobClient.GetPropertiesAsync();
    }
    
    public async Task<Uri> UploadBlobAsync(string fileName, Stream stream)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient("userpfps");
        var blobClient = containerClient.GetBlobClient(fileName);
        await blobClient.UploadAsync(stream);
        return blobClient.Uri;
    }
}