import mongoose, { Schema } from 'mongoose';

const SettingsSchema = new Schema({
  // General
  platformName: { type: String, default: "UDOFIN" },
  supportEmail: { type: String, default: "support@udofin.in" },
  maxLoanAmount: { type: String, default: "5000000" },
  minCibilScore: { type: String, default: "650" },
  autoApproveThreshold: { type: String, default: "750" },
  
  // Notifications
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: true },
  slackAlerts: { type: Boolean, default: false },
  dailyDigest: { type: Boolean, default: true },
  
  // Security
  twoFactorRequired: { type: Boolean, default: true },
  sessionTimeout: { type: String, default: "30" },
  ipWhitelist: { type: Boolean, default: false },
  auditLogging: { type: Boolean, default: true },
  
  // Appearance
  darkMode: { type: Boolean, default: false },
  compactMode: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);