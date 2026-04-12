const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    name: { type: String, trim: true, default: '' },
    categories: {
      type: [String],
      enum: ['Police', 'Clerk', 'Teaching', 'Others', 'All'],
      default: ['All'],
    },
    isActive: { type: Boolean, default: true },
    token: { type: String }, // for unsubscribe
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscriber', subscriberSchema);
