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

// Update bulk order status (Admin)
exports.updateBulkOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Contacted', 'Processing', 'Resolved', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }

    const bulkOrder = await BulkOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!bulkOrder) {
      return res.status(404).json({ success: false, message: 'Bulk order not found' });
    }

    res.status(200).json({ success: true, data: bulkOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete single bulk order (Admin)
exports.deleteBulkOrder = async (req, res) => {
  try {
    const bulkOrder = await BulkOrder.findByIdAndDelete(req.params.id);
    
    if (!bulkOrder) {
      return res.status(404).json({ success: false, message: 'Bulk order not found' });
    }

    res.status(200).json({ success: true, message: 'Bulk order deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


