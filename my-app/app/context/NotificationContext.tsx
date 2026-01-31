"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useNotifications, Notification } from "../hooks/useNotifications";
import { subscribePush, checkPushSubscription } from "../services/pushService";
import { useAuth } from "../hooks/useAuth";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  isPushEnabled: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  enablePushNotifications: () => Promise<boolean>;
  getNotificationsByType: (type: string) => Notification[];
  getNotificationsByCategory: (category: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getNotificationsByType,
    getNotificationsByCategory
  } = useNotifications();

  const [isPushEnabled, setIsPushEnabled] = useState(false);

  useEffect(() => {
    // Check push notification status when user is authenticated
    if (user) {
      checkPushStatus();
    }
  }, [user]);

  const checkPushStatus = async () => {
    try {
      const isEnabled = await checkPushSubscription();
      setIsPushEnabled(isEnabled);
    } catch (error) {
      console.error("Failed to check push status:", error);
    }
  };

  const enablePushNotifications = async (): Promise<boolean> => {
    try {
      const success = await subscribePush();
      if (success) {
        setIsPushEnabled(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to enable push notifications:", error);
      return false;
    }
  };

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    isConnected,
    isPushEnabled,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    enablePushNotifications,
    getNotificationsByType,
    getNotificationsByCategory
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};