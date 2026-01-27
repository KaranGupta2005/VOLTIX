import { getSocketId } from "./socketRegistry.js";
import Sub from "../models/Sub.js";
import pushService from "../services/pushService.js";

export const dispatch = async ({
  io,
  recipient,
  eventType,
  payload,
  channels,
  context = {}
}) => {
  const socketId = getSocketId(recipient.userId);

  /* via socket */
  if (channels.socket) {
    // Send to specific user room
    io.to(recipient.userId.toString()).emit("notification:new", {
      eventType,
      payload,
      timestamp: new Date().toISOString(),
      context
    });

    // Also send to role-based rooms if applicable
    if (recipient.profile?.role) {
      io.to(recipient.profile.role).emit("notification:broadcast", {
        eventType,
        payload,
        timestamp: new Date().toISOString(),
        context
      });
    }

    console.log(`📡 Socket notification sent to user ${recipient.userId} (${recipient.profile?.role})`);
  }

  /* via webpush */
  if (channels.webpush) {
    try {
      const agentType = payload.agentType || context.agentType || 'system';
      await pushService.sendAgentNotification(
        agentType,
        eventType.toLowerCase(),
        payload,
        [recipient.userId]
      );
      
      console.log(`📲 Push notification sent to user ${recipient.userId}`);
    } catch (error) {
      console.error(`❌ Push notification failed for user ${recipient.userId}:`, error.message);
    }
  }
};