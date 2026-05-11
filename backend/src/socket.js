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
      
      let token =
        socket.handshake.auth?.token ||
        bearerToken ||
        socket.handshake.query?.token;

      // Handle case where token itself might have "Bearer " prefix from frontend
      if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
      }

      if (!token) {
        console.error('[Socket Auth] No token provided');
        return next(new Error('AUTH_TOKEN_REQUIRED'));
      }

      const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
      console.log(`[Socket Auth] Attempting verification. Token length: ${token.length}, Secret exists: ${!!process.env.JWT_SECRET}`);

      try {
        const decoded = jwt.verify(token, secret);
        socket.user = { id: decoded.id, role: decoded.role || 'user' };
        console.log(`[Socket Auth] Success! User ID: ${decoded.id}, Role: ${decoded.role}`);
      } catch (jwtErr) {
        console.error('[Socket Auth] JWT Verification failed:', jwtErr.message);
        return next(new Error('AUTH_INVALID'));
      }

      // Allow 'admin', 'seller', and 'delivery' roles
      if (socket.user.role !== 'seller' && socket.user.role !== 'admin' && socket.user.role !== 'delivery') {
        console.error(`[Socket Auth] Role ${socket.user.role} not allowed`);
        return next(new Error('AUTH_ROLE_NOT_ALLOWED'));
      }

      return next();
    } catch (err) {
      console.error('[Socket Auth] Invalid token:', err.message);
      return next(new Error('AUTH_INVALID'));
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

function notifyUserOrderStatus(userId, payload) {
  if (!io) return;
  io.to(`user:${userId}`).emit('order:status_update', payload);
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
  notifyUserOrderStatus
};
