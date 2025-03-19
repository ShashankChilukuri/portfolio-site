import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 🧑 Customer Schema
const customerSchema = new mongoose.Schema({
  // Basic Information
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String }, // URL for profile pic

  // Portfolio References (for multiple portfolios if needed)
  portfolios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' }],

  // Subscription Info
  subscriptionPlan: {
    type: String,
    enum: ['Free', '1 Month', '3 Months', '6 Months', '12 Months'],
    default: 'Free'
  },
  subscriptionStartDate: { type: Date },
  subscriptionEndDate: { type: Date },

  // Security
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  
},{timestamps:true});

// Pre-save hook to hash the password before saving
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check password
customerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check subscription status
customerSchema.methods.isSubscriptionActive = function () {
  if (this.subscriptionPlan === 'Free') return false;
  return this.subscriptionEndDate && new Date() <= this.subscriptionEndDate;
};

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
