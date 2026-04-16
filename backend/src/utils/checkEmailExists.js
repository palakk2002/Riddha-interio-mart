const User = require('../models/User');
const Admin = require('../models/Admin');
const Seller = require('../models/Seller');
const Delivery = require('../models/Delivery');

/**
 * Check if an email exists in any of the user collections
 * @param {string} email 
 * @returns {Promise<boolean>}
 */
const checkEmailExists = async (email) => {
  const [user, admin, seller, delivery] = await Promise.all([
    User.findOne({ email }),
    Admin.findOne({ email }),
    Seller.findOne({ email }),
    Delivery.findOne({ email })
  ]);

  return !!(user || admin || seller || delivery);
};

module.exports = checkEmailExists;
