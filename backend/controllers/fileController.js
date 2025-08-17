const asyncHandler = require('express-async-handler');
const fileService = require('../services/fileService');
const storageService = require('../services/storageService');

const getAllFiles = asyncHandler(async (req, res) => {
  const files = await fileService.getFilesByUserId(req.user.id);
  
  res.json({
    success: true,
    count: files.length,
    files,
  });
});

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file provided',
    });
  }

  // Upload to Firebase Storage
  const uploadResult = await storageService.uploadFile(req.file);
  
  // Save file metadata to Firestore
  const fileData = {
    userId: req.user.id,
    fileName: uploadResult.fileName,
    originalName: req.file.originalname,
    fileUrl: uploadResult.fileUrl,
    filePath: uploadResult.filePath,
    fileType: req.file.mimetype,
    size: req.file.size,
  };

  const newFile = await fileService.createFile(fileData);

  res.status(201).json({
    success: true,
    message: 'File uploaded successfully',
    file: newFile,
  });
});

const updateFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fileName } = req.body;

  // Find the file and verify ownership
  const file = await fileService.getFileByIdAndUserId(id, req.user.id);
  if (!file) {
    return res.status(404).json({
      success: false,
      message: 'File not found or access denied',
    });
  }

  let updateData = {};

  // If a new file is uploaded, replace the old one
  if (req.file) {
    // Delete old file from Firebase Storage
    await storageService.deleteFile(file.filePath);

    // Upload new file
    const uploadResult = await storageService.uploadFile(req.file);

    updateData = {
      fileName: uploadResult.fileName,
      originalName: req.file.originalname,
      fileUrl: uploadResult.fileUrl,
      filePath: uploadResult.filePath,
      fileType: req.file.mimetype,
      size: req.file.size,
    };
  }

  // Update filename if provided
  if (fileName) {
    updateData.originalName = fileName;
  }

  const updatedFile = await fileService.updateFile(id, updateData);

  res.json({
    success: true,
    message: 'File updated successfully',
    file: updatedFile,
  });
});

const deleteFile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the file and verify ownership
  const file = await fileService.getFileByIdAndUserId(id, req.user.id);
  if (!file) {
    return res.status(404).json({
      success: false,
      message: 'File not found or access denied',
    });
  }

  // Delete from Firebase Storage
  await storageService.deleteFile(file.filePath);

  // Delete from Firestore
  await fileService.deleteFile(id);

  res.json({
    success: true,
    message: 'File deleted successfully',
  });
});

module.exports = {
  getAllFiles,
  uploadFile,
  updateFile,
  deleteFile,
};
