using Azure.Storage.Blobs.Models;

namespace Messenger.Application.Interfaces;

public interface IBlobService
{
    public Task GetBlobAsync(string fileName);
    
    public Task<Uri> UploadBlobAsync(string fileName, Stream stream);
}