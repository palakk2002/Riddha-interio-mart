const ActivityLog = require('../models/ActivityLog');

/**
 * Log administrative or system operations to MongoDB
 * @param {Object} params
 * @param {string} params.action - E.g. 'Approved Seller Account'
 * @param {string} params.target - E.g. 'Modern Decor Pvt'
 * @param {string} params.user - E.g. 'Admin'
 * @param {string} params.role - E.g. 'Super Admin' or 'Manager'
 * @param {string} [params.ipAddress] - E.g. '192.168.1.5'
 */
exports.logSystemActivity = async ({ action, target, user, role, ipAddress }) => {
  try {
    await ActivityLog.create({
      action,
      target,
      user: user || 'System',
      role: role || 'System',
      ipAddress: ipAddress || '127.0.0.1'
    });
  } catch (err) {
    console.error('Failed to log system activity:', err);
  }
};
