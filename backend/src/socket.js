const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const Seller = require('./models/Seller');

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

      // Allow 'admin', 'seller', and 'delivery' roles
      if (socket.user.role !== 'seller' && socket.user.role !== 'admin' && socket.user.role !== 'delivery') {
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

function notifySellerNewOrder(sellerId, payload) {
  if (!io) return;
  io.to(`seller:${sellerId}`).emit('order:new', payload);
}

function notifyAdminNewOrder(adminId, payload) {
  if (!io) return;
  // If adminId is provided, notify specific admin. If not, notify all admins.
  if (adminId) {
    io.to(`admin:${adminId}`).emit('order:new', payload);
  } else {
    io.to('role:admin').emit('order:new', payload);
  }
}

function notifyAdminNewProduct(payload) {
  if (!io) return;
  // Broadcast to all admins
  io.to('role:admin').emit('product:new_request', payload);
}

function notifySellerProductApproval(sellerId, payload) {
  if (!io) return;
  io.to(`seller:${sellerId}`).emit('product:approval_update', payload);
}

function notifyDeliveryAssignment(deliveryBoyId, payload) {
  if (!io) return;
  io.to(`delivery:${deliveryBoyId}`).emit('delivery:assigned', payload);
}

function notifySellerDeliveryResponse(sellerId, payload) {
  if (!io) return;
  io.to(`seller:${sellerId}`).emit('delivery:response', payload);
}

function notifyAdminDeliveryResponse(adminId, payload) {
  if (!io) return;
  if (adminId) {
    io.to(`admin:${adminId}`).emit('delivery:response', payload);
  } else {
    io.to('role:admin').emit('delivery:response', payload);
  }
}

function notifyAdminNewDelivery(payload) {
  if (!io) return;
  io.to('role:admin').emit('delivery:new_registration', payload);
}

function notifyDeliveryApproval(deliveryBoyId, payload) {
  if (!io) return;
  io.to(`delivery:${deliveryBoyId}`).emit('delivery:approval_update', payload);
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
  notifyDeliveryApproval
};
