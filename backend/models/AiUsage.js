const mongoose = require("mongoose");

const aiUsageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // format: "YYYY-MM-DD"
  count: { type: Number, default: 0 }
});

aiUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("AiUsage", aiUsageSchema);