const express = require('express');
const multer = require('multer');
const firebaseAdmin = require('firebase-admin');
const cors = require('cors');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: 'coreweb-76938.appspot.com' // Replace with your Firebase project ID
});

const app = express();
const bucket = firebaseAdmin.storage().bucket();

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set up multer to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Upload route
app.post('/upload', upload.single('resource'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const fileName = Date.now() + '-' + req.file.originalname;
  const file = bucket.file(fileName);

  try {
    // Save the file to Firebase
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Get a signed URL for downloading the file (expires in 1 hour)
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2500' // Set a far-future expiration date
    });

    // Return the signed download URL
    res.status(200).json({
      message: 'File uploaded successfully',
      downloadURL: url,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
