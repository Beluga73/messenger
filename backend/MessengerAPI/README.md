# Messenger API Documentation

A RESTful API for a messenger application built with ASP.NET Core 9.0, featuring phone number authentication, real-time messaging via SignalR, and Azure Blob Storage integration.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Real-time Messaging](#real-time-messaging)
- [Database Schema](#database-schema)
- [Configuration](#configuration)
- [Deployment](#deployment)

## Features

- **Phone Number Authentication**: SMS-based verification using Twilio
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Real-time Messaging**: SignalR hub for instant message delivery
- **User Profiles**: Update name, status, and avatar
- **Conversations**: One-on-one messaging between users
- **Message History**: Retrieve conversation history with pagination
- **Read Receipts**: Mark messages as read
- **Azure Blob Storage**: Store user profile pictures

## Architecture

The project follows Clean Architecture principles with the following layers:

- **Messenger.Domain**: Core entities and domain models
- **Messenger.Application**: Business logic, DTOs, and service interfaces
- **Messenger.Infrastructure**: Data access, repositories, and external service implementations
- **MessengerWeb**: Web API controllers, SignalR hubs, and configuration

## Getting Started

### Prerequisites

- .NET 9.0 SDK
- PostgreSQL database
- Docker and Docker Compose (optional)
- Azure Storage Account (for blob storage)
- Twilio account (for SMS verification)

### Running with Docker Compose

1. Clone the repository
2. Update `appsettings.json` with your configuration:
   - PostgreSQL connection string
   - Azure Blob Storage connection string
   - Twilio credentials
   - JWT secret key

3. Build and run:
```bash
docker-compose up --build
```

The API will be available at `http://localhost:8080`

### Running Locally

1. Update `appsettings.Development.json` with your local PostgreSQL connection string
2. Run migrations:
```bash
dotnet ef database update --project MessengerAPI/Messenger.Infrastructure --startup-project MessengerAPI/MessengerWeb
```

3. Run the application:
```bash
cd MessengerAPI/MessengerWeb
dotnet run
```

## API Endpoints

### Authentication

#### POST `/api/auth/register/initiate`
Initiates phone number verification by sending an SMS code.

**Request:**
```
Content-Type: application/x-www-form-urlencoded

phoneNumber: +1234567890
```

**Response:**
```json
{
  "result": "pending"
}
```

#### POST `/api/auth/register/verify`
Verifies the SMS code and creates/authenticates the user.

**Request:**
```
Content-Type: application/x-www-form-urlencoded

phoneNumber: +1234567890
code: 123456
```

**Response:**
```json
{
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "guid-refresh-token"
}
```

#### POST `/api/auth/token/refresh`
Refreshes the JWT token using a refresh token.

**Request:**
```
Content-Type: application/x-www-form-urlencoded

token: refresh-token-guid
```

**Response:**
```json
{
  "jwtToken": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

#### POST `/api/auth/logout/all`
Logs out the user from all devices (requires authentication).

**Headers:**
```
Authorization: Bearer {jwtToken}
```

**Response:**
```json
200 OK
```

### Profile Management

#### PUT `/api/profile/update/text`
Updates user's name and status.

**Headers:**
```
Authorization: Bearer {jwtToken}
Content-Type: application/json
```

**Request Body:**
```json
{
  "newStatus": "Available",
  "newName": "John Doe"
}
```

**Response:**
```json
{
  "userid": "guid",
  "name": "John Doe",
  "username": "user_1234567890",
  "phoneNumber": "+1234567890",
  "status": "Available"
}
```

#### POST `/api/profile/upload/picture`
Uploads a profile picture.

**Headers:**
```
Authorization: Bearer {jwtToken}
Content-Type: multipart/form-data
```

**Request:**
```
file: [image file]
```

**Response:**
```json
{
  "userid": "guid",
  "name": "John Doe",
  "username": "user_1234567890",
  "phoneNumber": "+1234567890",
  "status": "Available"
}
```

### Messaging

#### POST `/api/messages/send`
Sends a message to another user.

**Headers:**
```
Authorization: Bearer {jwtToken}
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Hello, how are you?",
  "recipientId": "recipient-guid"
}
```

**Response:**
```json
{
  "id": "message-guid",
  "conversationId": "conversation-guid",
  "senderId": "sender-guid",
  "senderName": "John Doe",
  "content": "Hello, how are you?",
  "sentAt": "2024-01-01T12:00:00Z",
  "isRead": false,
  "readAt": null
}
```

#### GET `/api/messages/conversation/{conversationId}`
Retrieves messages from a conversation with pagination.

**Headers:**
```
Authorization: Bearer {jwtToken}
```

**Query Parameters:**
- `skip` (optional): Number of messages to skip (default: 0)
- `take` (optional): Number of messages to retrieve (default: 50)

**Response:**
```json
[
  {
    "id": "message-guid",
    "conversationId": "conversation-guid",
    "senderId": "sender-guid",
    "senderName": "John Doe",
    "content": "Hello!",
    "sentAt": "2024-01-01T12:00:00Z",
    "isRead": true,
    "readAt": "2024-01-01T12:05:00Z"
  }
]
```

#### GET `/api/messages/conversations`
Gets all conversations for the authenticated user.

**Headers:**
```
Authorization: Bearer {jwtToken}
```

**Response:**
```json
[
  {
    "id": "conversation-guid",
    "user1Id": "user1-guid",
    "user1Name": "John Doe",
    "user1AvatarUrl": "https://...",
    "user2Id": "user2-guid",
    "user2Name": "Jane Smith",
    "user2AvatarUrl": "https://...",
    "lastMessage": {
      "id": "message-guid",
      "content": "Hello!",
      "sentAt": "2024-01-01T12:00:00Z"
    },
    "lastMessageAt": "2024-01-01T12:00:00Z",
    "unreadCount": 2
  }
]
```

#### POST `/api/messages/conversation/{conversationId}/read`
Marks all messages in a conversation as read.

**Headers:**
```
Authorization: Bearer {jwtToken}
```

**Response:**
```json
{
  "success": true
}
```

## Authentication

The API uses JWT Bearer tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer {jwtToken}
```

### Token Expiration
- JWT tokens expire after 15 minutes (configurable)
- Refresh tokens expire after 30 days
- Use the refresh token endpoint to obtain a new JWT token

### Session Management
- Each user has a `SessionSecretVersion` that increments on logout
- Tokens become invalid when the session version changes
- Use `/api/auth/logout/all` to invalidate all tokens

## Real-time Messaging

The API includes a SignalR hub for real-time message delivery.

### Connection

Connect to the hub at: `/hubs/messages`

**JavaScript Example:**
```javascript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://api.example.com/hubs/messages", {
        accessTokenFactory: () => jwtToken
    })
    .build();

await connection.start();
```

### Hub Methods

#### Join Conversation
```javascript
await connection.invoke("JoinConversation", conversationId);
```

#### Leave Conversation
```javascript
await connection.invoke("LeaveConversation", conversationId);
```

### Hub Events

#### NewMessage
Fired when a new message is received.

```javascript
connection.on("NewMessage", (message) => {
    console.log("New message:", message);
});
```

#### MessageSent
Fired when a message is sent in a conversation.

```javascript
connection.on("MessageSent", (message) => {
    console.log("Message sent:", message);
});
```

#### MessagesRead
Fired when messages are marked as read.

```javascript
connection.on("MessagesRead", (conversationId, userId) => {
    console.log("Messages read in conversation:", conversationId);
});
```

## Database Schema

### User
- `Id` (Guid, PK)
- `PhoneNumber` (string, required, unique)
- `Username` (string)
- `Name` (string, nullable)
- `Status` (string, nullable)
- `AvatarUrl` (string)
- `SessionSecretVersion` (int)
- `RefreshTokens` (collection)

### RefreshToken
- `Id` (Guid, PK)
- `Token` (string, unique)
- `UserId` (Guid, FK)
- `Expires` (DateTime)
- `Created` (DateTime)
- `Revoked` (DateTime, nullable)
- `IsActive` (computed)

### Conversation
- `Id` (Guid, PK)
- `User1Id` (Guid, FK)
- `User2Id` (Guid, FK)
- `LastMessageAt` (DateTime)
- `Messages` (collection)

### Message
- `Id` (Guid, PK)
- `ConversationId` (Guid, FK)
- `SenderId` (Guid, FK)
- `Content` (string)
- `SentAt` (DateTime)
- `IsRead` (bool)
- `ReadAt` (DateTime, nullable)

## Configuration

### appsettings.json

```json
{
  "ConnectionStrings": {
    "postgres": "Host=localhost;Port=5432;Database=MessengerDb;Username=admin;Password=password",
    "AzureBlobStorage": "DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net"
  },
  "TwilioConfiguration": {
    "AccountSid": "your-account-sid",
    "AuthToken": "your-auth-token",
    "PathServiceSid": "your-service-sid"
  },
  "AuthSettings": {
    "SecretKey": "your-super-secret-jwt-key-should-be-long-and-secure",
    "TokenLifetimeMinutes": 15
  }
}
```

### Environment Variables

You can override configuration using environment variables:
- `ConnectionStrings__postgres`
- `ConnectionStrings__AzureBlobStorage`
- `TwilioConfiguration__AccountSid`
- `TwilioConfiguration__AuthToken`
- `TwilioConfiguration__PathServiceSid`
- `AuthSettings__SecretKey`
- `AuthSettings__TokenLifetimeMinutes`

## Deployment

### Docker

Build the Docker image:
```bash
docker build -t messengerweb -f MessengerAPI/MessengerWeb/Dockerfile MessengerAPI/
```

Run with Docker Compose:
```bash
docker-compose up -d
```

### Production Considerations

1. **Security**:
   - Use strong JWT secret keys
   - Enable HTTPS
   - Configure CORS properly
   - Store secrets in Azure Key Vault or similar

2. **Performance**:
   - Use connection pooling for PostgreSQL
   - Implement caching for frequently accessed data
   - Use CDN for blob storage

3. **Monitoring**:
   - Enable application insights
   - Set up logging
   - Monitor database performance

## Swagger Documentation

When running in Development mode, Swagger UI is available at:
- `http://localhost:8080/swagger`

## Error Handling

The API returns standard HTTP status codes:
- `200 OK`: Successful request
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include a message:
```json
{
  "message": "Error description"
}
```

## License

This project is licensed under the MIT License.

