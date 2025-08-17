const admin = require('firebase-admin');

let firebaseInitialized = false;

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  if (!firebaseInitialized && admin.apps.length === 0) {
    try {
      // Check if all required environment variables are present
      const requiredEnvVars = [
        'FIREBASE_PROJECT_ID',
        'FIREBASE_PRIVATE_KEY',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_STORAGE_BUCKET',
        'FIREBASE_PRIVATE_KEY_ID',
        'FIREBASE_CLIENT_ID',
        'FIREBASE_CLIENT_X509_CERT_URL'
      ];

      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }

      // Handle private key formatting - it might be base64 encoded or need newline replacement
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      // If the private key doesn't start with -----BEGIN, it might be base64 encoded
      if (!privateKey.startsWith('-----BEGIN')) {
        try {
          privateKey = Buffer.from(privateKey, 'base64').toString('utf8');
        } catch (error) {
          console.warn('Private key is not base64 encoded, using as-is');
        }
      }
      
      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');

      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain: "googleapis.com"
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });

      firebaseInitialized = true;
      console.log('✅ Firebase Admin SDK initialized');
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error.message);
      console.log('⚠️  Server will continue without Firebase connection');
      console.log('💡 To fix: Configure Firebase credentials in .env file');
    }
  }
};

// Get Firestore instance
const getFirestore = () => {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  return admin.firestore();
};

// Get Storage instance
const getStorage = () => {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  return admin.storage();
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getStorage,
  admin,
};
