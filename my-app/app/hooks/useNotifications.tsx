"use client";

import { useEffect, useState } from "react";
import { connectSocket, getSocket } from "../config/socket";

export interface Notification {
  id?: string;
  type: "SYSTEM" | "AGENT" | "ALERT" | "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  title: string;
  message: string;
  timestamp: string;
  priority?: "low" | "medium" | "high" | "critical";
  category?: string;
  meta?: any;
  read?: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = connectSocket();

    const handleConnect = () => {
      console.log("🔔 Notification socket connected");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("🔔 Notification socket disconnected");
      setIsConnected(false);
    };

    const handleNotification = (data: any) => {
      console.log("🔔 New notification received:", data);
      const notification: Notification = {
        id: data.id || Date.now().toString(),
        type: data.type || "INFO",
        title: data.title || "Notification",
        message: data.message || "",
        timestamp: data.timestamp || new Date().toISOString(),
        priority: data.priority || "medium",
        category: data.category,
        meta: data.meta,
        read: false
      };

      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    const handleAgentDecision = (decision: any) => {
      console.log("🤖 Agent decision received:", decision);
      const notification: Notification = {
        id: decision.id || Date.now().toString(),
        type: "AGENT",
        title: `${decision.agent} Decision`,
        message: decision.explanation || decision.message || "Agent made a decision",
        timestamp: decision.timestamp || new Date().toISOString(),
        priority: decision.priority || "medium",
        category: "agent_decision",
        meta: {
          agent: decision.agent,
          action: decision.action,
          stationId: decision.stationId,
          confidence: decision.confidence
        },
        read: false
      };

      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    const handleSystemAlert = (alert: any) => {
      console.log("⚠️ System alert received:", alert);
      const notification: Notification = {
        id: alert.id || Date.now().toString(),
        type: alert.severity?.toUpperCase() || "ALERT",
        title: alert.title || "System Alert",
        message: alert.message || "",
        timestamp: alert.timestamp || new Date().toISOString(),
        priority: alert.priority || "high",
        category: "system_alert",
        meta: alert.meta,
        read: false
      };

      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    const handleStationUpdate = (update: any) => {
      console.log("🔌 Station update received:", update);
      const notification: Notification = {
        id: update.id || Date.now().toString(),
        type: "INFO",
        title: `Station ${update.stationId} Update`,
        message: update.message || `Station status changed to ${update.status}`,
        timestamp: update.timestamp || new Date().toISOString(),
        priority: "low",
        category: "station_update",
        meta: {
          stationId: update.stationId,
          status: update.status,
          location: update.location
        },
        read: false
      };

      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    // Socket event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification", handleNotification);
    socket.on("agent_decision", handleAgentDecision);
    socket.on("system_alert", handleSystemAlert);
    socket.on("station_update", handleStationUpdate);

    // Check initial connection status
    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification", handleNotification);
      socket.off("agent_decision", handleAgentDecision);
      socket.off("system_alert", handleSystemAlert);
      socket.off("station_update", handleStationUpdate);
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === id);
      return notification && !notification.read ? Math.max(0, prev - 1) : prev;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationsByType = (type: string) => {
    return notifications.filter(notification => notification.type === type);
  };

  const getNotificationsByCategory = (category: string) => {
    return notifications.filter(notification => notification.category === category);
  };

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getNotificationsByType,
    getNotificationsByCategory
  };
};