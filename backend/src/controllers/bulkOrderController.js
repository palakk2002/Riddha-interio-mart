const BulkOrder = require('../models/BulkOrder');

// Create bulk order inquiry
exports.createBulkOrder = async (req, res) => {
  try {
    const { name, phone, email, items, message } = req.body;
    const bulkOrder = await BulkOrder.create({
      name,
      phone,
      email,
      items,
      message
    });
    res.status(201).json({ success: true, data: bulkOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all bulk orders (Admin)
exports.getAllBulkOrders = async (req, res) => {
  try {
    const bulkOrders = await BulkOrder.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bulkOrders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Seed dummy data
exports.seedBulkOrders = async (req, res) => {
  try {
    const dummy = [
      {
        name: "Corporate Interiors Pvt Ltd",
        contact: "9876543210 / info@corpinteriors.com",
        items: [
          { name: "Executive Leather Chair", quantity: 50, category: "Office Furniture" },
          { name: "Conference Table", quantity: 5, category: "Office Furniture" }
        ],
        message: "Looking for a full office setup for our new branch."
      },
      {
        name: "Grand Residency Hotel",
        contact: "8887776665 / procure@grandresidency.com",
        items: [
          { name: "Premium Velvet Sofa", quantity: 20, category: "Living Room" },
          { name: "King Size Bed Frame", quantity: 15, category: "Bedroom" }
        ],
        message: "Urgently need these for our lobby renovation."
      }
    ];
    await BulkOrder.insertMany(dummy);
    res.status(201).json({ success: true, message: "Dummy data seeded" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Clear all bulk orders
exports.clearBulkOrders = async (req, res) => {
  try {
    await BulkOrder.deleteMany({});
    res.status(200).json({ success: true, message: "All bulk orders cleared" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
