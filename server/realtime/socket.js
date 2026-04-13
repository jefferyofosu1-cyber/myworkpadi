/**
 * server/realtime/socket.js
 * Socket.io server for real-time job tracking and location updates.
 * 
 * Namespaces:
 *   /customer  — customer clients track job progress
 *   /tasker    — tasker clients send location + status updates
 *
 * Authentication: JWT in handshake.auth.token (same JWT as REST API)
 */

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-here';

// ─── JWT Auth Middleware ───────────────────────────────────────────────────────
function socketAuthMiddleware(socket, next) {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

  if (!token) {
    return next(new Error('Authentication required. Provide token in handshake.auth.token'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded; // { userId, role, phone }
    next();
  } catch (err) {
    next(new Error('Invalid or expired token'));
  }
}

// ─── Setup Function ───────────────────────────────────────────────────────────
export function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Apply auth to all namespaces
  io.use(socketAuthMiddleware);

  // ─── Namespace: /customer ──────────────────────────────────────────────────
  const customerNS = io.of('/customer');
  customerNS.use(socketAuthMiddleware);

  customerNS.on('connection', (socket) => {
    console.log(`[Socket] Customer connected: ${socket.user.userId}`);

    // Customer joins their active booking room to receive real-time updates
    socket.on('join:job', (bookingId) => {
      if (!bookingId) return socket.emit('error', { message: 'bookingId required' });
      const room = `job:${bookingId}`;
      socket.join(room);
      console.log(`[Socket] Customer ${socket.user.userId} joined room ${room}`);
      socket.emit('joined', { room, bookingId });
    });

    socket.on('leave:job', (bookingId) => {
      socket.leave(`job:${bookingId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Customer ${socket.user.userId} disconnected: ${reason}`);
    });
  });

  // ─── Namespace: /tasker ────────────────────────────────────────────────────
  const taskerNS = io.of('/tasker');
  taskerNS.use(socketAuthMiddleware);

  taskerNS.on('connection', (socket) => {
    console.log(`[Socket] Tasker connected: ${socket.user.userId}`);

    // Tasker joins their active booking room
    socket.on('join:job', (bookingId) => {
      if (!bookingId) return socket.emit('error', { message: 'bookingId required' });
      socket.join(`job:${bookingId}`);
      socket.currentJobId = bookingId;
      console.log(`[Socket] Tasker ${socket.user.userId} joined job ${bookingId}`);
    });

    // Tasker broadcasts real-time location to customer's room
    socket.on('location:update', ({ lat, lng }) => {
      if (!socket.currentJobId) {
        return socket.emit('error', { message: 'Join a job room first' });
      }
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return socket.emit('error', { message: 'lat and lng must be numbers' });
      }

      const payload = {
        lat,
        lng,
        taskerId: socket.user.userId,
        timestamp: new Date().toISOString(),
      };

      // Broadcast to ALL in the job room (customer will receive this)
      customerNS.to(`job:${socket.currentJobId}`).emit('location:update', payload);
    });

    // Tasker emits status change event (e.g., arrived, started)
    socket.on('status:update', ({ bookingId, status }) => {
      if (!bookingId || !status) return;
      customerNS.to(`job:${bookingId}`).emit('booking:status', {
        bookingId,
        status,
        updatedAt: new Date().toISOString(),
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Tasker ${socket.user.userId} disconnected: ${reason}`);
    });
  });

  // ─── Global Emitter (used by REST API handlers) ────────────────────────────
  // Exported so services can push updates programmatically
  io.broadcastBookingUpdate = (bookingId, payload) => {
    customerNS.to(`job:${bookingId}`).emit('booking:status', payload);
    taskerNS.to(`job:${bookingId}`).emit('booking:status', payload);
  };

  console.log('[Socket.io] Server initialized with /customer and /tasker namespaces');
  return io;
}
