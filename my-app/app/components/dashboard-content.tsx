"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Zap,
  Phone,
  MessageCircle,
  ChevronRight,
  Clock,
  Battery,
  Activity,
  CheckCircle,
  AlertTriangle,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for stations
const stationsData = [
  {
    id: "ST-4012",
    from: "Mumbai Central",
    to: "Andheri West",
    status: "active",
    statusLabel: "Charging",
    power: "150 kW",
    vehicle: "Tesla Model 3",
    owner: "Rahul Sharma",
    ownerAvatar: "RS",
    address: "Plot 12, MIDC Industrial Area, Andheri East, Mumbai 400093",
    timeRemaining: "45 min",
    batteryLevel: 65,
  },
  {
    id: "ST-4015",
    from: "Bandra Station",
    to: "Powai Hub",
    status: "active",
    statusLabel: "Charging",
    power: "50 kW",
    vehicle: "MG ZS EV",
    owner: "Priya Patel",
    ownerAvatar: "PP",
    address: "Hiranandani Gardens, Powai, Mumbai 400076",
    timeRemaining: "1h 20min",
    batteryLevel: 32,
  },
  {
    id: "ST-4018",
    from: "Thane West",
    to: "Navi Mumbai",
    status: "queued",
    statusLabel: "Queued",
    power: "22 kW",
    vehicle: "Tata Nexon EV",
    owner: "Amit Kumar",
    ownerAvatar: "AK",
    address: "Sector 15, CBD Belapur, Navi Mumbai 400614",
    timeRemaining: "2h 10min",
    batteryLevel: 18,
  },
  {
    id: "ST-4021",
    from: "Juhu Beach",
    to: "Santacruz",
    status: "maintenance",
    statusLabel: "Maintenance",
    power: "0 kW",
    vehicle: "—",
    owner: "Tech Team",
    ownerAvatar: "TT",
    address: "Juhu Tara Road, Santacruz West, Mumbai 400049",
    timeRemaining: "—",
    batteryLevel: 0,
  },
  {
    id: "ST-4025",
    from: "Dadar TT",
    to: "Lower Parel",
    status: "active",
    statusLabel: "Charging",
    power: "120 kW",
    vehicle: "Hyundai Ioniq 5",
    owner: "Sneha Reddy",
    ownerAvatar: "SR",
    address: "Phoenix Mills Compound, Lower Parel, Mumbai 400013",
    timeRemaining: "25 min",
    batteryLevel: 82,
  },
];

export function HomeContent() {
  const [selectedStation, setSelectedStation] = useState(stationsData[0]);
  const [activeFilter, setActiveFilter] = useState("active");

  const filteredStations = stationsData.filter((station) => {
    if (activeFilter === "active")
      return station.status === "active" || station.status === "queued";
    return station.status === "maintenance";
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "queued":
        return "bg-amber-500";
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string, label: string) => {
    const colors: Record<string, string> = {
      active:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      queued:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      maintenance:
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <Badge
        className={`${colors[status] || colors.active} rounded-full text-xs font-medium px-2 py-0.5`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status)} mr-1.5 inline-block`}
        ></span>
        {label}
      </Badge>
    );
  };

  return (
    <div className="relative h-[calc(100vh-140px)] rounded-3xl overflow-hidden border border-border/50 shadow-sm">
      {/* Full-Screen Map Background */}
      <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900">
        {/* Simulated Map Background */}
        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(100,116,139,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(100,116,139,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          ></div>

          {/* Simulated Roads */}
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-slate-300 dark:bg-slate-700"></div>
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-300 dark:bg-slate-700"></div>
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-slate-300 dark:bg-slate-700"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-slate-300 dark:bg-slate-700"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-slate-300 dark:bg-slate-700"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-slate-300 dark:bg-slate-700"></div>

          {/* Station Markers */}
          <div className="absolute top-[30%] left-[45%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40 animate-pulse">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-green-500 flex items-center justify-center">
                <span className="text-[8px] font-bold text-green-600">1</span>
              </div>
            </div>
          </div>

          <div className="absolute top-[55%] left-[65%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="absolute top-[45%] left-[30%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="absolute top-[70%] left-[78%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/40">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="absolute top-[25%] left-[72%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40 animate-pulse"
                style={{ animationDelay: "1s" }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Selected Station Tooltip (on map) */}
          {selectedStation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-[28%] left-[55%] bg-background/95 backdrop-blur-md rounded-xl shadow-xl border border-border/50 p-3 max-w-52"
            >
              <p className="text-xs text-muted-foreground mb-1">
                Station {selectedStation.id}
              </p>
              <p className="text-sm font-medium leading-snug">
                {selectedStation.address}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Station Panel (Glassmorphism Overlay) */}
      <div className="absolute top-4 left-4 bottom-4 w-96 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-2xl flex flex-col overflow-hidden">
        {/* Panel Header */}
        <div className="p-5 border-b border-border/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Station Tracking</h2>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Filter Tabs */}
          <Tabs
            value={activeFilter}
            onValueChange={setActiveFilter}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted/50 p-1">
              <TabsTrigger
                value="active"
                className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                On the way
              </TabsTrigger>
              <TabsTrigger
                value="maintenance"
                className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Offline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Station List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredStations.map((station) => (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md rounded-2xl border bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm ${
                  selectedStation?.id === station.id
                    ? "border-primary ring-2 ring-primary/20 bg-white dark:bg-slate-800"
                    : "border-border/30 hover:border-border/50"
                }`}
                onClick={() => setSelectedStation(station)}
              >
                {/* Station Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {station.from}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">{station.to}</span>
                  </div>
                  {getStatusBadge(station.status, station.statusLabel)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Station {station.id}
                </p>

                {/* Expanded Details (for selected) */}
                <AnimatePresence>
                  {selectedStation?.id === station.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-border/30 space-y-3">
                        {/* From Location */}
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full border-2 border-muted-foreground"></div>
                            <div className="w-0.5 h-8 bg-muted-foreground/30 my-1"></div>
                            <div className="w-3 h-3 rounded-full bg-foreground"></div>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground">
                                From
                              </p>
                              <p className="text-sm">{station.from}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground">
                                Delivery Address
                              </p>
                              <p className="text-sm">{station.address}</p>
                            </div>
                          </div>
                        </div>

                        {/* Owner/Driver Info */}
                        <div className="flex items-center justify-between bg-muted/20 rounded-xl p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                              {station.ownerAvatar}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {station.owner}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {station.vehicle}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="rounded-full h-9 w-9 bg-white/50 dark:bg-slate-800/50"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="rounded-full h-9 w-9 bg-white/50 dark:bg-slate-800/50"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <Button className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90">
                          View details
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Details Bar */}
      {selectedStation && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-4 left-[420px] right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Station</p>
                <p className="font-bold text-lg">{selectedStation.id}</p>
              </div>
              {getStatusBadge(
                selectedStation.status,
                selectedStation.statusLabel,
              )}
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Driver</p>
                  <p className="font-medium text-sm">{selectedStation.owner}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">From</p>
                <p className="font-medium text-sm">{selectedStation.from}</p>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">To</p>
                <p className="font-medium text-sm">{selectedStation.to}</p>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">Time Remaining</p>
                <p className="font-medium text-sm">
                  {selectedStation.timeRemaining}
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">Battery</p>
                <p className="font-medium text-sm">
                  {selectedStation.batteryLevel}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
