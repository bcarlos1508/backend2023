import mongoose from 'mongoose';

const recoveryTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  expireAt: { type: Date, required: true },
});

recoveryTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const RecoveryToken = mongoose.model('RecoveryToken', recoveryTokenSchema);

export default RecoveryToken;
