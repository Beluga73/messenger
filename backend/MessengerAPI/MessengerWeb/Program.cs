using Azure.Storage.Blobs;
using MessengerWeb.Extensions;
using Messenger.Application;
using Messenger.Application.Interfaces;
using Messenger.Application.Services;
using Messenger.Infrastructure.Data;
using Messenger.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => options.AddDefaultPolicy(policyBuilder => policyBuilder.AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()));

builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
builder.Services.AddScoped<AuthenticationService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddSingleton<PhoneVerificationService>();
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddDbContext<MessengerDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("postgres")));
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Messenger API",
        Version = "v1",
        Description = "A RESTful API for a messenger application with real-time messaging capabilities",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Messenger API Support"
        }
    });
    
    // Include XML comments for Swagger
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});
builder.Services.Configure<TwillioSettings>(builder.Configuration.GetSection("TwilioConfiguration"));
builder.Services.Configure<AuthSettings>(builder.Configuration.GetSection("AuthSettings"));
builder.Services.AddAuth(builder.Configuration);
builder.Services.AddSingleton(x =>
    new BlobServiceClient(builder.Configuration.GetConnectionString("AzureBlobStorage")));
builder.Services.AddSingleton<IBlobService, BlobService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MessengerDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();   
    app.UseSwaggerUI();   
}


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<MessengerWeb.Hubs.MessageHub>("/hubs/messages");

app.Run();