const { getFirestore } = require('../config/firebase');

class WorkflowService {
  constructor() {
    this.collection = 'workflows';
  }

  get db() {
    return getFirestore();
  }

  async listByOwner(ownerId) {
    const snapshot = await this.db
      .collection(this.collection)
      .where('ownerId', '==', ownerId)
      .orderBy('updatedAt', 'desc')
      .get();

    const items = [];
    snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
    return items;
  }

  async getById(id) {
    const ref = this.db.collection(this.collection).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  }

  async create(data) {
    const ref = this.db.collection(this.collection).doc();
    const now = new Date();
    const doc = {
      id: ref.id,
      name: data.name || 'Untitled Workflow',
      nodes: Array.isArray(data.nodes) ? data.nodes : [],
      connections: Array.isArray(data.connections) ? data.connections : [],
      settings: data.settings || {},
      status: data.status || 'draft',
      ownerId: data.ownerId,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    await ref.set(doc);
    return doc;
  }

  async update(id, updateData, expectedVersion) {
    const ref = this.db.collection(this.collection).doc(id);
    return this.db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return null;
      const current = snap.data();

      if (typeof expectedVersion === 'number' && current.version !== expectedVersion) {
        // Return special object signaling conflict
        return { __conflict: true, server: { id: snap.id, ...current } };
      }

      const now = new Date();
      const updated = {
        ...current,
        ...updateData,
        version: (current.version || 1) + 1,
        updatedAt: now,
      };

      tx.update(ref, updated);
      return { id: snap.id, ...updated };
    });
  }

  async delete(id) {
    await this.db.collection(this.collection).doc(id).delete();
    return true;
  }
}

module.exports = new WorkflowService();
