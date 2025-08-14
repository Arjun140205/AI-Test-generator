import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
  code: { type: String, required: true },
  summary: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const testCaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String, required: true },
  framework: { type: String, default: 'Jest' },
  versions: [versionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

testCaseSchema.index({ user: 1, filePath: 1 });

export default mongoose.model('TestCase', testCaseSchema);
