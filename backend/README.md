# Modern Web App Backend - Firebase Edition

A complete Node.js + Express backend with Google OAuth 2.0 authentication, Firebase Firestore database, and Firebase Storage for file uploads.

## Features

- **Google OAuth 2.0 Authentication** with Passport.js and cookie-session
- **Firebase Firestore Database** with Admin SDK
- **Firebase Storage** for file uploads with Multer
- **Protected Routes** with authentication middleware
- **CORS Support** for React/Next.js frontend integration
- **Rate Limiting** and security middleware
- **Comprehensive Error Handling** with custom error classes
- **Input Validation** with Joi
- **Async/Await** patterns throughout

## Project Structure

```
backend/
├── config/
│   ├── firebase.js         # Firebase Admin SDK setup
│   ├── database.js         # Deprecated (kept for compatibility)
│   └── passport.js         # Google OAuth setup
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── fileController.js   # File management logic
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── upload.js          # Multer configuration
│   └── validation.js      # Input validation
├── services/
│   ├── userService.js     # Firestore user operations
│   ├── fileService.js     # Firestore file operations
│   └── storageService.js  # Firebase Storage operations
├── routes/
│   ├── auth.js            # Authentication routes
│   └── files.js           # File management routes
├── utils/
│   └── errorHandler.js    # Custom error classes
├── server.js              # Main application file
├── package.json           # Dependencies
└── env.example            # Environment variables template
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Firebase Storage
5. Create a service account:
   - Go to Project Settings → Service Accounts
   - Generate new private key
   - Download the JSON file

#### Configure Firebase Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Configure Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /files/{fileId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5001/auth/google/callback`

### 4. Environment Configuration

Copy `env.example` to `.env` and fill in your credentials:

```bash
cp env.example .env
```

Required environment variables:
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_CALLBACK_URL`: OAuth callback URL
- `SESSION_SECRET`: Random string for session encryption
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_CLIENT_EMAIL`: Service account email
- `FIREBASE_PRIVATE_KEY`: Service account private key (escape newlines as \\n)
- `FIREBASE_STORAGE_BUCKET`: Firebase storage bucket name
- `CORS_ORIGIN`: Frontend URL for CORS

### 6. Run the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication Routes (`/auth`)

- `GET /auth/google` - Start Google OAuth flow
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/current_user` - Get current user info
- `POST /auth/logout` - Logout user

### File Management Routes (`/files`)

All file routes require authentication.

- `GET /files` - Get all files for authenticated user
- `POST /files/upload` - Upload a new file
- `PUT /files/update/:id` - Update/replace existing file
- `DELETE /files/delete/:id` - Delete a file

### Other Routes

- `GET /` - API information
- `GET /health` - Health check

## File Upload

Supported file types:
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, Word, Excel
- Text files: TXT, CSV

Maximum file size: 10MB

## Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Input validation
- File type restrictions
- Authentication middleware

## Error Handling

The API returns consistent JSON responses:

```json
{
  "success": true/false,
  "message": "Description",
  "data": {} // Optional
}
```

## Development

For development, install nodemon:
```bash
npm install -g nodemon
```

Then use:
```bash
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Use HTTPS in production
5. Configure proper CORS origins

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
