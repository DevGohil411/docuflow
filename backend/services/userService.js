const { getFirestore } = require('../config/firebase');

class UserService {
  constructor() {
    this.collection = 'users';
  }

  get db() {
    return getFirestore();
  }

  async createUser(userData) {
    try {
      const userRef = this.db.collection(this.collection).doc();
      const user = {
        ...userData,
        uid: userRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await userRef.set(user);
      return { id: userRef.id, ...user };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async findUserByGoogleId(googleId) {
    try {
      const snapshot = await this.db
        .collection(this.collection)
        .where('googleId', '==', googleId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error finding user by Google ID:', error);
      throw new Error('Failed to find user');
    }
  }

  async updateUser(userId, updateData) {
    try {
      const userRef = this.db.collection(this.collection).doc(userId);
      const updatedData = {
        ...updateData,
        updatedAt: new Date(),
      };
      
      await userRef.update(updatedData);
      const doc = await userRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async getUserById(userId) {
    try {
      const doc = await this.db.collection(this.collection).doc(userId).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw new Error('Failed to get user');
    }
  }
}

module.exports = new UserService();
