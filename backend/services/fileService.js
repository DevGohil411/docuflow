const { getFirestore } = require('../config/firebase');

class FileService {
  constructor() {
    this.collection = 'files';
  }

  get db() {
    return getFirestore();
  }

  async createFile(fileData) {
    try {
      const fileRef = this.db.collection(this.collection).doc();
      const file = {
        ...fileData,
        id: fileRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await fileRef.set(file);
      return file;
    } catch (error) {
      console.error('Error creating file:', error);
      throw new Error('Failed to create file record');
    }
  }

  async getFilesByUserId(userId) {
    try {
      const snapshot = await this.db
        .collection(this.collection)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const files = [];
      snapshot.forEach(doc => {
        files.push({ id: doc.id, ...doc.data() });
      });

      return files;
    } catch (error) {
      console.error('Error getting files by user ID:', error);
      throw new Error('Failed to get files');
    }
  }

  async getFileById(fileId) {
    try {
      const doc = await this.db.collection(this.collection).doc(fileId).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting file by ID:', error);
      throw new Error('Failed to get file');
    }
  }

  async updateFile(fileId, updateData) {
    try {
      const fileRef = this.db.collection(this.collection).doc(fileId);
      const updatedData = {
        ...updateData,
        updatedAt: new Date(),
      };
      
      await fileRef.update(updatedData);
      const doc = await fileRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error updating file:', error);
      throw new Error('Failed to update file');
    }
  }

  async deleteFile(fileId) {
    try {
      await this.db.collection(this.collection).doc(fileId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file record');
    }
  }

  async getFileByIdAndUserId(fileId, userId) {
    try {
      const doc = await this.db.collection(this.collection).doc(fileId).get();
      
      if (!doc.exists) {
        return null;
      }

      const fileData = { id: doc.id, ...doc.data() };
      
      // Check if file belongs to the user
      if (fileData.userId !== userId) {
        return null;
      }
      
      return fileData;
    } catch (error) {
      console.error('Error getting file by ID and user ID:', error);
      throw new Error('Failed to get file');
    }
  }
}

module.exports = new FileService();
