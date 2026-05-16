const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const Notification = require('./models/Notification');
const User = require('./models/User');

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === 'production'
          ? (process.env.SOCKET_CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean)
          : true,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.headers?.authorization;
      const bearerToken =
        typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
          ? authHeader.slice('Bearer '.length)
          : null;
      const token =
        socket.handshake.auth?.token ||
        bearerToken ||
        socket.handshake.query?.token;

      if (!token) return next(new Error('auth/token_required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: decoded.id, role: decoded.role || 'user' };

      // Allow 'admin', 'seller', 'delivery', and 'user' roles
      if (!['seller', 'admin', 'delivery', 'user'].includes(socket.user.role)) {
        return next(new Error('auth/role_not_allowed'));
      }

      return next();
    } catch (err) {
      return next(new Error('auth/invalid_token'));
    }
  });

  io.on('connection', (socket) => {
    const { id, role } = socket.user || {};
    console.log(`[Socket] New connection: ${role}:${id}`);
    
    socket.join(`${role}:${id}`);
    console.log(`[Socket] Joined room: ${role}:${id}`);
    
    // Also join a generic role room for broadcasting to all admins or sellers
    socket.join(`role:${role}`);
    console.log(`[Socket] Joined generic role room: role:${role}`);
    
    socket.emit('socket:ready', { role, id });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('socket.io not initialized');
  return io;
}

// -----------------------------------------------------------------------------
// Database Persistence Helpers
// -----------------------------------------------------------------------------

async function persistNotification({ recipient, recipientModel, title, message, type, metadata }) {
  try {
    const notification = await Notification.create({
      recipient,
      recipientModel,
      title,
      message,
      type,
      metadata
    });
    return notification;
  } catch (err) {
    console.error('Failed to persist notification:', err);
    return null;
  }
}

async function persistForAdmins({ title, message, type, metadata }) {
  try {
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      recipientModel: 'User',
      title,
      message,
      type,
      metadata
    }));
    if (notifications.length > 0) {
      const saved = await Notification.insertMany(notifications);
      return saved[0]; // Return the first one as a sample for the realtime payload
    }
  } catch (err) {
    console.error('Failed to persist admin notifications:', err);
  }
  return null;
}

// -----------------------------------------------------------------------------
// Emitting Helpers
// -----------------------------------------------------------------------------

async function notifySellerNewOrder(sellerId, payload) {
  if (!io) return;
  const notif = await persistNotification({
    recipient: sellerId,
    recipientModel: 'Seller',
    title: 'New Order',
    message: payload.message || 'You have received a new order.',
    type: 'order_update',
    metadata: payload
  });
  io.to(`seller:${sellerId}`).emit('order:new', payload);
  if (notif) io.to(`seller:${sellerId}`).emit('notification:new', notif);
}

async function notifyAdminNewOrder(adminId, payload) {
  if (!io) return;
  if (adminId) {
    const notif = await persistNotification({
      recipient: adminId,
      recipientModel: 'User',
      title: 'New Order',
      message: payload.message || 'A new order was placed.',
      type: 'order_update',
      metadata: payload
    });
    io.to(`admin:${adminId}`).emit('order:new', payload);
    if (notif) io.to(`admin:${adminId}`).emit('notification:new', notif);
  } else {
    const notif = await persistForAdmins({
      title: 'New Order',
      message: payload.message || 'A new order was placed.',
      type: 'order_update',
      metadata: payload
    });
    io.to('role:admin').emit('order:new', payload);
    // When broadcasting to role:admin, we can emit a slightly modified generic notification obj
    if (notif) io.to('role:admin').emit('notification:new', notif);
  }
}

async function notifyAdminNewProduct(payload) {
  if (!io) return;
  const notif = await persistForAdmins({
    title: 'New Product Approval',
    message: payload.message || 'A seller has requested product approval.',
    type: 'admin_alert',
    metadata: payload
  });
  io.to('role:admin').emit('product:new_request', payload);
  if (notif) io.to('role:admin').emit('notification:new', notif);
}

async function notifySellerProductApproval(sellerId, payload) {
  if (!io) return;
  const notif = await persistNotification({
    recipient: sellerId,
    recipientModel: 'Seller',
    title: 'Product Status Update',
    message: payload.message || 'Your product status has been updated.',
    type: 'seller_approval',
    metadata: payload
  });
  io.to(`seller:${sellerId}`).emit('product:approval_update', payload);
  if (notif) io.to(`seller:${sellerId}`).emit('notification:new', notif);
}

async function notifyDeliveryAssignment(deliveryBoyId, payload) {
  if (!io) return;
  const notif = await persistNotification({
    recipient: deliveryBoyId,
    recipientModel: 'Delivery',
    title: 'New Delivery Assignment',
    message: payload.message || 'You have been assigned a new delivery.',
    type: 'delivery_update',
    metadata: payload
  });
  io.to(`delivery:${deliveryBoyId}`).emit('delivery:assigned', payload);
  if (notif) io.to(`delivery:${deliveryBoyId}`).emit('notification:new', notif);
}

async function notifySellerDeliveryResponse(sellerId, payload) {
  if (!io) return;
  const notif = await persistNotification({
    recipient: sellerId,
    recipientModel: 'Seller',
    title: 'Delivery Status Update',
    message: payload.message || 'A delivery status has been updated.',
    type: 'delivery_update',
    metadata: payload
  });
  io.to(`seller:${sellerId}`).emit('delivery:response', payload);
  if (notif) io.to(`seller:${sellerId}`).emit('notification:new', notif);
}

async function notifyAdminDeliveryResponse(adminId, payload) {
  if (!io) return;
  if (adminId) {
    const notif = await persistNotification({
      recipient: adminId,
      recipientModel: 'User',
      title: 'Delivery Status Update',
      message: payload.message || 'A delivery status has been updated.',
      type: 'delivery_update',
      metadata: payload
    });
    io.to(`admin:${adminId}`).emit('delivery:response', payload);
    if (notif) io.to(`admin:${adminId}`).emit('notification:new', notif);
  } else {
    const notif = await persistForAdmins({
      title: 'Delivery Status Update',
      message: payload.message || 'A delivery status has been updated.',
      type: 'delivery_update',
      metadata: payload
    });
    io.to('role:admin').emit('delivery:response', payload);
    if (notif) io.to('role:admin').emit('notification:new', notif);
  }
}

async function notifyAdminNewDelivery(payload) {
  if (!io) return;
  const notif = await persistForAdmins({
    title: 'New Delivery Partner',
    message: payload.message || 'A new delivery partner has registered.',
    type: 'admin_alert',
    metadata: payload
  });
  io.to('role:admin').emit('delivery:new_registration', payload);
  if (notif) io.to('role:admin').emit('notification:new', notif);
}

async function notifyDeliveryApproval(deliveryBoyId, payload) {
  if (!io) return;
  const notif = await persistNotification({
    recipient: deliveryBoyId,
    recipientModel: 'Delivery',
    title: 'Account Approved',
    message: payload.message || 'Your delivery account has been approved.',
    type: 'admin_alert',
    metadata: payload
  });
  io.to(`delivery:${deliveryBoyId}`).emit('delivery:approval_update', payload);
  if (notif) io.to(`delivery:${deliveryBoyId}`).emit('notification:new', notif);
}

async function notifyUserOrderStatus(userId, payload) {
  if (!io) return;
  const notif = await persistNotification({
    recipient: userId,
    recipientModel: 'User',
    title: 'Order Status Update',
    message: payload.message || 'Your order status has changed.',
    type: 'order_update',
    metadata: payload
  });
  io.to(`user:${userId}`).emit('order:status_update', payload);
  if (notif) io.to(`user:${userId}`).emit('notification:new', notif);
}

async function notifyLowStock(sellerId, payload) {
  if (!io) return;
  
  // Notify specific seller
  if (sellerId) {
    const notif = await persistNotification({
      recipient: sellerId,
      recipientModel: 'Seller',
      title: 'Low Stock Alert',
      message: payload.message || 'A product is running low on stock.',
      type: 'stock_alert',
      metadata: payload
    });
    io.to(`seller:${sellerId}`).emit('product:low_stock', payload);
    if (notif) io.to(`seller:${sellerId}`).emit('notification:new', notif);
  }
  
  // Also notify admins
  const adminNotif = await persistForAdmins({
    title: 'Low Stock Alert',
    message: payload.message || 'A product is running low on stock.',
    type: 'stock_alert',
    metadata: payload
  });
  io.to('role:admin').emit('product:low_stock', payload);
  if (adminNotif) io.to('role:admin').emit('notification:new', adminNotif);
}

module.exports = {
  initSocket,
  getIO,
  notifySellerNewOrder,
  notifyAdminNewOrder,
  notifyAdminNewProduct,
  notifySellerProductApproval,
  notifyDeliveryAssignment,
  notifySellerDeliveryResponse,
  notifyAdminDeliveryResponse,
  notifyAdminNewDelivery,
  notifyDeliveryApproval,
  notifyUserOrderStatus,
  notifyLowStock
};
