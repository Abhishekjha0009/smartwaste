let io = null;

export const initSocket = (socketIoInstance) => {
  io = socketIoInstance;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room based on user role and user ID
    socket.on('join_rooms', ({ role, userId }) => {
      if (role) {
        socket.join(`role:${role}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room role:${role}`);
      }
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room user:${userId}`);
      }
    });

    // Handle worker live GPS stream
    socket.on('worker:location', (data) => {
      // Broadcast to authority monitoring room
      io.to('role:Authority').emit('worker:location_updated', data);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  return io;
};

// Helper notification emitters
export const emitComplaintCreated = (complaint) => {
  if (io) {
    console.log(`[Socket.IO] Emitting complaint:created for #${complaint._id}`);
    io.to('role:Authority').emit('complaint:created', {
      message: `New ${complaint.severity} severity complaint reported in ${complaint.location?.area || 'Zone'}`,
      complaint
    });
  }
};

export const emitTaskAssigned = (complaint, workerId) => {
  if (io) {
    console.log(`[Socket.IO] Emitting task:assigned to worker ${workerId}`);
    io.to(`user:${workerId}`).emit('task:assigned', {
      message: `New task assigned: ${complaint.title} (${complaint.category})`,
      complaint
    });
    io.to('role:Authority').emit('task:status_changed', complaint);
  }
};

export const emitTaskStatusUpdated = (complaint) => {
  if (io) {
    console.log(`[Socket.IO] Emitting task:status_changed for #${complaint._id}`);
    // Notify citizen
    io.to(`user:${complaint.citizenId}`).emit('complaint:updated', {
      message: `Your complaint status has changed to '${complaint.status}'`,
      complaint
    });
    // Notify authorities
    io.to('role:Authority').emit('task:status_changed', complaint);
  }
};

export const emitTaskResolved = (complaint) => {
  if (io) {
    console.log(`[Socket.IO] Emitting task:resolved for #${complaint._id}`);
    io.to(`user:${complaint.citizenId}`).emit('complaint:resolved', {
      message: `🎉 Great news! Your reported waste issue has been successfully resolved & cleaned!`,
      complaint
    });
    io.to('role:Authority').emit('task:status_changed', complaint);
  }
};
