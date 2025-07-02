# Cloudinary Setup Guide

## Environment Variables Required

Create a `.env` file in the Server directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

## How to Get Cloudinary Credentials

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy the following values:
   - **Cloud Name**: Found in the Dashboard overview
   - **API Key**: Found in the Dashboard under "API Keys"
   - **API Secret**: Found in the Dashboard under "API Keys"

## Features Implemented

### Backend Changes:
- ✅ Multer configuration with Cloudinary storage
- ✅ File upload middleware
- ✅ Updated POST route to handle FormData
- ✅ Updated PUT route to handle file uploads
- ✅ Added GET routes for individual medicines

### Frontend Changes:
- ✅ AddMedicine component now uses file input instead of URL
- ✅ UpdateMedicine component supports file uploads with preview
- ✅ Image preview functionality
- ✅ FormData handling for file uploads

## File Upload Process

1. **Add Medicine**: 
   - User selects an image file
   - File is uploaded to Cloudinary via multer
   - Cloudinary URL is stored in the database

2. **Update Medicine**:
   - If no new file is selected, keeps existing image
   - If new file is selected, uploads to Cloudinary and updates URL

## Supported File Types

- JPG/JPEG
- PNG

Files are stored in the 'medicines' folder on Cloudinary. 