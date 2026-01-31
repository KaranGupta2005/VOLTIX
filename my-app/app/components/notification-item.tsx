"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Settings,
  ShieldAlert,
  Wallet,
  Zap,
  ArrowUpRight,
  Info,
} from "lucide-react";

export type NotificationType =
  | "system"
  | "alert"
  | "payment"
  | "energy"
  | "info"
  | "success";

interface NotificationItemProps {
  id: string;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  isUnread?: boolean;
  onClick?: () => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case "system":
      return <Settings size={20} className="text-blue-500" />;
    case "alert":
      return <ShieldAlert size={20} className="text-red-500" />;
    case "payment":
      return <Wallet size={20} className="text-purple-500" />;
    case "energy":
      return <Zap size={20} className="text-yellow-500" />;
    case "success":
      return <ArrowUpRight size={20} className="text-green-500" />;
    default:
      return <Info size={20} className="text-gray-500" />;
  }
};

const getIconBg = (type: NotificationType) => {
  switch (type) {
    case "system":
      return "bg-blue-50 dark:bg-blue-900/20";
    case "alert":
      return "bg-red-50 dark:bg-red-900/20";
    case "payment":
      return "bg-purple-50 dark:bg-purple-900/20";
    case "energy":
      return "bg-yellow-50 dark:bg-yellow-900/20";
    case "success":
      return "bg-green-50 dark:bg-green-900/20";
    default:
      return "bg-gray-50 dark:bg-gray-800";
  }
};

export default function NotificationItem({
  title,
  description,
  time,
  type,
  isUnread,
  onClick,
}: NotificationItemProps) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`relative p-4 mb-3 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border rounded-2xl flex gap-4 transition-all hover:shadow-md cursor-pointer ${
        isUnread
          ? "border-green-200 bg-green-50/20 dark:border-green-800 dark:bg-green-900/10"
          : "border-gray-100 dark:border-gray-800"
      }`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getIconBg(type)}`}
      >
        {getIcon(type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4
            className={`font-semibold text-sm truncate pr-2 ${isUnread ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}
          >
            {title}
          </h4>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {time}
          </span>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Unread Indicator */}
      {isUnread && (
        <div className="absolute top-5 right-4 w-2 h-2 rounded-full bg-blue-500" />
      )}
    </motion.div>
  );
}
