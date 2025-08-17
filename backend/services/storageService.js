const { getStorage } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

class StorageService {
  get bucket() {
    return getStorage().bucket();
  }

  async uploadFile(file, folder = 'uploads') {
    try {
      const fileName = this.generateFileName(file.originalname);
      const filePath = `${folder}/${fileName}`;
      const fileUpload = this.bucket.file(filePath);

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        public: true,
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
          console.error('Upload error:', error);
          reject(new Error('Failed to upload file to storage'));
        });

        stream.on('finish', async () => {
          try {
            // Make the file publicly accessible
            await fileUpload.makePublic();
            
            // Get the public URL
            const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filePath}`;
            
            resolve({
              fileName,
              filePath,
              fileUrl: publicUrl,
              size: file.size,
              contentType: file.mimetype,
            });
          } catch (error) {
            reject(error);
          }
        });

        stream.end(file.buffer);
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async deleteFile(filePath) {
    try {
      const file = this.bucket.file(filePath);
      await file.delete();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file from storage');
    }
  }

  async getSignedUrl(filePath, expiresIn = 3600000) { // 1 hour default
    try {
      const file = this.bucket.file(filePath);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresIn,
      });
      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  generateFileName(originalName) {
    const extension = originalName.split('.').pop();
    const uniqueName = `${uuidv4()}.${extension}`;
    return uniqueName;
  }

  extractFilePathFromUrl(fileUrl) {
    // Extract file path from public URL
    const bucketName = this.bucket.name;
    const baseUrl = `https://storage.googleapis.com/${bucketName}/`;
    
    if (fileUrl.startsWith(baseUrl)) {
      return fileUrl.replace(baseUrl, '');
    }
    
    // If it's already a file path, return as is
    return fileUrl;
  }
}

module.exports = new StorageService();
