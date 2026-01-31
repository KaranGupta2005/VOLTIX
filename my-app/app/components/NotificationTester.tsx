"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { subscribePush, unsubscribePush, checkPushSubscription, testPushNotification } from "../services/pushService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, TestTube, Trash2, CheckCircle, AlertCircle, Info, Zap } from "lucide-react";

export default function NotificationTester() {
  const { 
    notifications, 
    unreadCount, 
    isConnected, 
    markAsRead, 
    markAllAsRead, 
    clearNotification, 
    clearAllNotifications 
  } = useNotifications();
  
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkPushStatus();
  }, []);

  const checkPushStatus = async () => {
    const isEnabled = await checkPushSubscription();
    setIsPushEnabled(isEnabled);
  };

  const handleEnablePush = async () => {
    setIsLoading(true);
    try {
      const success = await subscribePush();
      if (success) {
        setIsPushEnabled(true);
        alert("✅ Push notifications enabled!");
      } else {
        alert("❌ Failed to enable push notifications");
      }
    } catch (error) {
      console.error("Push subscription error:", error);
      alert("❌ Error enabling push notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisablePush = async () => {
    setIsLoading(true);
    try {
      const success = await unsubscribePush();
      if (success) {
        setIsPushEnabled(false);
        alert("✅ Push notifications disabled!");
      } else {
        alert("❌ Failed to disable push notifications");
      }
    } catch (error) {
      console.error("Push unsubscription error:", error);
      alert("❌ Error disabling push notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestPush = async () => {
    setIsLoading(true);
    try {
      const success = await testPushNotification();
      if (success) {
        alert("✅ Test notification sent! Check your notifications.");
      } else {
        alert("❌ Failed to send test notification");
      }
    } catch (error) {
      console.error("Test push error:", error);
      alert("❌ Error sending test notification");
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "ERROR":
      case "ALERT":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "WARNING":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "AGENT":
        return <Zap className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
      case "ERROR":
      case "ALERT":
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
      case "WARNING":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
      case "AGENT":
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification System Tester
          </CardTitle>
          <CardDescription>
            Test and manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              Socket: {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Push Notification Controls */}
          <div className="flex flex-wrap gap-2">
            {!isPushEnabled ? (
              <Button 
                onClick={handleEnablePush} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                {isLoading ? "Enabling..." : "Enable Push Notifications"}
              </Button>
            ) : (
              <Button 
                onClick={handleDisablePush} 
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <BellOff className="h-4 w-4" />
                {isLoading ? "Disabling..." : "Disable Push Notifications"}
              </Button>
            )}

            <Button 
              onClick={handleTestPush} 
              disabled={isLoading || !isPushEnabled}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {isLoading ? "Sending..." : "Test Push"}
            </Button>

            {notifications.length > 0 && (
              <>
                <Button 
                  onClick={markAllAsRead} 
                  variant="outline"
                  size="sm"
                >
                  Mark All Read
                </Button>
                <Button 
                  onClick={clearAllNotifications} 
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} unread</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-sm">Notifications will appear here when received</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id || index}
                  className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm truncate">
                            {notification.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {notification.type}
                          </Badge>
                          {notification.priority && notification.priority !== 'medium' && (
                            <Badge 
                              variant={notification.priority === 'critical' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {notification.priority}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatTimestamp(notification.timestamp)}</span>
                          {notification.category && (
                            <span className="capitalize">{notification.category.replace('_', ' ')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id!)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => clearNotification(notification.id!)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}