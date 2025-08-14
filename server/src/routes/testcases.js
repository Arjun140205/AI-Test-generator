import express from 'express';
import TestCase from '../models/testcase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all test cases for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  const testcases = await TestCase.find({ user: req.user.id }).sort({ updatedAt: -1 });
  res.json({ testcases });
});

// Get a single test case by ID
router.get('/:id', authMiddleware, async (req, res) => {
  const testcase = await TestCase.findOne({ _id: req.params.id, user: req.user.id });
  if (!testcase) return res.status(404).json({ error: 'Not found' });
  res.json({ testcase });
});

// Create a new test case
router.post('/', authMiddleware, async (req, res) => {
  const { filePath, framework, code, summary } = req.body;
  if (!filePath || !code) return res.status(400).json({ error: 'filePath and code required' });
  const testcase = await TestCase.create({
    user: req.user.id,
    filePath,
    framework,
    versions: [{ code, summary }]
  });
  res.json({ testcase });
});

// Update (add new version) to a test case
router.put('/:id', authMiddleware, async (req, res) => {
  const { code, summary } = req.body;
  const testcase = await TestCase.findOne({ _id: req.params.id, user: req.user.id });
  if (!testcase) return res.status(404).json({ error: 'Not found' });
  testcase.versions.push({ code, summary });
  testcase.updatedAt = new Date();
  await testcase.save();
  res.json({ testcase });
});

// Delete a test case
router.delete('/:id', authMiddleware, async (req, res) => {
  const testcase = await TestCase.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!testcase) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

// Restore a previous version
router.post('/:id/restore', authMiddleware, async (req, res) => {
  const { versionIndex } = req.body;
  const testcase = await TestCase.findOne({ _id: req.params.id, user: req.user.id });
  if (!testcase) return res.status(404).json({ error: 'Not found' });
  if (typeof versionIndex !== 'number' || versionIndex < 0 || versionIndex >= testcase.versions.length) {
    return res.status(400).json({ error: 'Invalid version index' });
  }
  // Move selected version to the end (latest)
  const version = testcase.versions[versionIndex];
  testcase.versions.push({ ...version, createdAt: new Date() });
  testcase.updatedAt = new Date();
  await testcase.save();
  res.json({ testcase });
});

export default router;
