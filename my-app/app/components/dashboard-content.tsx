"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Phone,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  PanelLeftOpen,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardMap from "./DashboardMap";

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
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

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
      <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-900">
        <DashboardMap
          stations={stationsData}
          selectedStation={selectedStation}
          onStationSelect={setSelectedStation}
          className="w-full h-full"
        />
      </div>

      {/* Floating Station Panel (Glassmorphism Overlay) - Collapsible */}
      <AnimatePresence mode="wait">
        {isPanelCollapsed ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => setIsPanelCollapsed(false)}
            className="absolute top-4 left-4 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl p-3 hover:bg-white/70 dark:hover:bg-slate-900/70 transition-colors"
          >
            <PanelLeftOpen className="w-6 h-6" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute top-4 left-4 bottom-4 w-96 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Panel Header */}
            <div className="p-5 border-b border-border/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Station Tracking</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Search className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsPanelCollapsed(true)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                </div>
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
                        <span className="font-semibold text-sm">
                          {station.to}
                        </span>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Details Bar */}
      {selectedStation && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`absolute bottom-4 right-4 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-xl p-4 ${isPanelCollapsed ? "left-4" : "left-[420px]"}`}
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
