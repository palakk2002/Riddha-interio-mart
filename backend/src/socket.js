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

      // Only allow seller sockets for now (seller notification requirement)
      if (socket.user.role !== 'seller') {
        return next(new Error('auth/role_not_allowed'));
      }

      const sellerExists = await Seller.exists({ _id: socket.user.id });
      if (!sellerExists) return next(new Error('auth/user_not_found'));

      return next();
    } catch (err) {
      return next(new Error('auth/invalid_token'));
    }
  });

  io.on('connection', (socket) => {
    const { id, role } = socket.user || {};
    socket.join(`${role}:${id}`);
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

module.exports = {
  initSocket,
  getIO,
  notifySellerNewOrder
};

