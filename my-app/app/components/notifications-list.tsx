"use client";

import { useState } from "react";
import NotificationItem, { NotificationType } from "./notification-item";
import NotificationDetails from "./notification-details";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "energy" as NotificationType,
    title: "Energy Surge Detected",
    description:
      "Station ST004 is experiencing a 15% power surge. Automatic stabilization engaged.",
    time: "2m ago",
    isUnread: true,
  },
  {
    id: "2",
    type: "payment" as NotificationType,
    title: "Payment Received",
    description: "User confirmed payment of ₹450 for charging session via UPI.",
    time: "12m ago",
    isUnread: true,
  },
  {
    id: "3",
    type: "alert" as NotificationType,
    title: "Maintenance Required",
    description:
      "Connector 2 at Downtown Station requires inspection. MechanicAgent alerted.",
    time: "45m ago",
    isUnread: false,
  },
  {
    id: "4",
    type: "success" as NotificationType,
    title: "Firmware Updated",
    description:
      "Successfully updated 12 stations to version v2.4.1 with 0 downtime.",
    time: "2h ago",
    isUnread: false,
  },
  {
    id: "5",
    type: "system" as NotificationType,
    title: "System Optimized",
    description:
      "TrafficAgent optimized routing, reducing average wait time by 4 minutes.",
    time: "5h ago",
    isUnread: false,
  },
  {
    id: "6",
    type: "info" as NotificationType,
    title: "Daily Report Ready",
    description: "Your daily operational summary is ready for review.",
    time: "Yesterday",
    isUnread: false,
  },
];

export default function NotificationsList() {
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedNotification, setSelectedNotification] = useState<
    (typeof MOCK_NOTIFICATIONS)[0] | null
  >(null);

  return (
    <>
      <div className="space-y-1 pr-1">
        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            {...notif}
            onClick={() => setSelectedNotification(notif)}
          />
        ))}
      </div>

      <NotificationDetails
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </>
  );
}
