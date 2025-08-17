const workflowService = require('../services/workflowService');

// Ensure the request has an authenticated user
function requireUser(req, res) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return null;
  }
  return req.user;
}

async function listWorkflows(req, res) {
  const user = requireUser(req, res);
  if (!user) return;
  try {
    const items = await workflowService.listByOwner(user.id);
    res.json({ success: true, items });
  } catch (err) {
    console.error('List workflows error:', err);
    res.status(500).json({ success: false, message: 'Failed to list workflows' });
  }
}

async function getWorkflow(req, res) {
  const user = requireUser(req, res);
  if (!user) return;
  try {
    const wf = await workflowService.getById(req.params.id);
    if (!wf) return res.status(404).json({ success: false, message: 'Not found' });
    if (wf.ownerId !== user.id) return res.status(403).json({ success: false, message: 'Forbidden' });
    res.json({ success: true, item: wf });
  } catch (err) {
    console.error('Get workflow error:', err);
    res.status(500).json({ success: false, message: 'Failed to get workflow' });
  }
}

async function createWorkflow(req, res) {
  const user = requireUser(req, res);
  if (!user) return;
  try {
    const body = req.body || {};
    const doc = await workflowService.create({
      name: body.name,
      nodes: body.nodes,
      connections: body.connections,
      settings: body.settings,
      status: body.status,
      ownerId: user.id,
    });
    res.status(201).json({ success: true, item: doc });
  } catch (err) {
    console.error('Create workflow error:', err);
    res.status(500).json({ success: false, message: 'Failed to create workflow' });
  }
}

async function updateWorkflow(req, res) {
  const user = requireUser(req, res);
  if (!user) return;
  try {
    const id = req.params.id;
    const current = await workflowService.getById(id);
    if (!current) return res.status(404).json({ success: false, message: 'Not found' });
    if (current.ownerId !== user.id) return res.status(403).json({ success: false, message: 'Forbidden' });

    const expectedVersion = typeof req.body.version === 'number' ? req.body.version : undefined;
    const result = await workflowService.update(id, req.body, expectedVersion);

    if (result && result.__conflict) {
      return res.status(409).json({ success: false, message: 'Version conflict', server: result.server });
    }

    res.json({ success: true, item: result });
  } catch (err) {
    console.error('Update workflow error:', err);
    res.status(500).json({ success: false, message: 'Failed to update workflow' });
  }
}

async function deleteWorkflow(req, res) {
  const user = requireUser(req, res);
  if (!user) return;
  try {
    const id = req.params.id;
    const current = await workflowService.getById(id);
    if (!current) return res.status(404).json({ success: false, message: 'Not found' });
    if (current.ownerId !== user.id) return res.status(403).json({ success: false, message: 'Forbidden' });

    await workflowService.delete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete workflow error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete workflow' });
  }
}

module.exports = {
  listWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
};
