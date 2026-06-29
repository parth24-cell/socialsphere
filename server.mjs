import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port: Number(port) });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    }
  });

  // Track online users
  const onlineUsers = new Map(); // userId -> Set of socket ids

  io.on("connection", (socket) => {
    // console.log("A user connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(`user_${userId}`);
      socket.userId = userId;
      
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      // Broadcast online status
      socket.broadcast.emit("user_online", userId);
    });

    socket.on("join_conversation", (conversationId) => {
      socket.join(`conv_${conversationId}`);
    });

    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conv_${conversationId}`);
    });

    socket.on("typing", ({ conversationId, userId }) => {
      socket.to(`conv_${conversationId}`).emit("typing", { conversationId, userId });
    });

    socket.on("stop_typing", ({ conversationId, userId }) => {
      socket.to(`conv_${conversationId}`).emit("stop_typing", { conversationId, userId });
    });

    socket.on("send_message", (message) => {
      socket.to(`conv_${message.conversationId}`).emit("new_message", message);
      
      if (message.recipientIds) {
        message.recipientIds.forEach((id) => {
          socket.to(`user_${id}`).emit("notification_new_message", message);
        });
      }
    });

    // Real-time events for DM Upgrades
    socket.on("message_edit", ({ conversationId, message }) => {
      socket.to(`conv_${conversationId}`).emit("message_edited", message);
    });

    socket.on("message_delete", ({ conversationId, messageId, deletedForUsers, isDeleted }) => {
      socket.to(`conv_${conversationId}`).emit("message_deleted", { messageId, deletedForUsers, isDeleted });
    });

    socket.on("message_reaction", ({ conversationId, messageId, reactions }) => {
      socket.to(`conv_${conversationId}`).emit("message_reacted", { messageId, reactions });
    });

    socket.on("message_pin", ({ conversationId, messageId, isPinned, pinnedAt }) => {
      socket.to(`conv_${conversationId}`).emit("message_pinned", { messageId, isPinned, pinnedAt });
    });

    socket.on("user_idle", (userId) => {
      socket.broadcast.emit("user_idle_status", { userId, isIdle: true });
    });

    socket.on("user_active", (userId) => {
      socket.broadcast.emit("user_idle_status", { userId, isIdle: false });
    });

    socket.on("disconnect", async () => {
      if (socket.userId) {
        const socketSet = onlineUsers.get(socket.userId);
        if (socketSet) {
          socketSet.delete(socket.id);
          if (socketSet.size === 0) {
            onlineUsers.delete(socket.userId);
            
            // Broadcast offline status
            socket.broadcast.emit("user_offline", socket.userId);

            // Update lastSeen in database
            try {
              await prisma.user.update({
                where: { id: socket.userId },
                data: { lastSeen: new Date() }
              });
            } catch (err) {
              console.error("Failed to update lastSeen on disconnect", err);
            }
          }
        }
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
