const express = require('express');
const { getAllFiles, uploadFile, updateFile, deleteFile } = require('../controllers/fileController');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { validateFileUpdate, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// @route   GET /files
// @desc    Get all files for the authenticated user
// @access  Private
router.get('/', getAllFiles);

// @route   POST /files/upload
// @desc    Upload a new file
// @access  Private
router.post('/upload', upload.single('file'), uploadFile);

// @route   PUT /files/update/:id
// @desc    Update/replace an existing file
// @access  Private
router.put('/update/:id', 
  validateObjectId,
  upload.single('file'),
  validateFileUpdate,
  updateFile
);

// @route   DELETE /files/delete/:id
// @desc    Delete a file
// @access  Private
router.delete('/delete/:id', validateObjectId, deleteFile);

module.exports = router;
