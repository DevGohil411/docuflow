const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  listWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
} = require('../controllers/workflowController');

const router = express.Router();

// List workflows for current user
router.get('/', requireAuth, listWorkflows);

// Create workflow
router.post('/', requireAuth, createWorkflow);

// Get workflow by id
router.get('/:id', requireAuth, getWorkflow);

// Update workflow by id (expects optional version for optimistic concurrency)
router.put('/:id', requireAuth, updateWorkflow);

// Delete workflow by id
router.delete('/:id', requireAuth, deleteWorkflow);

module.exports = router;
