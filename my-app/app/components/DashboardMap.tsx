"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Zap, Clock, AlertTriangle } from "lucide-react";
import "leaflet/dist/leaflet.css";

/* ------------------ DYNAMIC LEAFLET (NO SSR) ------------------ */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Circle = dynamic(() => import("react-leaflet").then((m) => m.Circle), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});

interface Station {
  id: string;
  from: string;
  to: string;
  status: string;
  statusLabel: string;
  power: string;
  vehicle: string;
  owner: string;
  ownerAvatar: string;
  address: string;
  timeRemaining: string;
  batteryLevel: number;
  // Optional coordinates for real positioning
  lat?: number;
  lng?: number;
}

interface DashboardMapProps {
  stations?: Station[];
  selectedStation?: Station | null;
  onStationSelect?: (station: Station) => void;
  className?: string;
}

// Default coordinates for Mumbai area
const DEFAULT_CENTER: [number, number] = [19.076, 72.8777];

// Station positions (mapped to their approximate locations in Mumbai)
const stationPositions: Record<string, [number, number]> = {
  "ST-4012": [19.0826, 72.8458], // Andheri East
  "ST-4015": [19.1176, 72.906], // Powai
  "ST-4018": [19.033, 73.0297], // Navi Mumbai
  "ST-4021": [19.1075, 72.8263], // Juhu
  "ST-4025": [19.0073, 72.8313], // Lower Parel
};

export default function DashboardMap({
  stations = [],
  selectedStation,
  onStationSelect,
  className = "h-full w-full",
}: DashboardMapProps) {
  const [mounted, setMounted] = useState(false);
  const [userPosition, setUserPosition] =
    useState<[number, number]>(DEFAULT_CENTER);

  /* ------------------ CLIENT-ONLY LEAFLET SETUP ------------------ */
  useEffect(() => {
    setMounted(true);

    (async () => {
      const L = (await import("leaflet")).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
    })();

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.warn("GPS error:", err),
        { enableHighAccuracy: true },
      );
    }
  }, []);

  const getStationPosition = (station: Station): [number, number] => {
    if (station.lat && station.lng) {
      return [station.lat, station.lng];
    }
    return stationPositions[station.id] || DEFAULT_CENTER;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#22c55e"; // green-500
      case "queued":
        return "#f59e0b"; // amber-500
      case "maintenance":
        return "#ef4444"; // red-500
      default:
        return "#6b7280"; // gray-500
    }
  };

  if (!mounted) {
    return (
      <div
        className={`${className} bg-slate-100 dark:bg-slate-900 animate-pulse flex items-center justify-center`}
      >
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={12}
        className="h-full w-full rounded-inherit"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User location marker */}
        <Marker position={userPosition}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Station markers */}
        {stations.map((station) => {
          const position = getStationPosition(station);
          const color = getStatusColor(station.status);

          return (
            <Circle
              key={station.id}
              center={position}
              radius={300}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: selectedStation?.id === station.id ? 0.4 : 0.2,
                weight: selectedStation?.id === station.id ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onStationSelect?.(station),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[180px]">
                  <div className="font-semibold text-sm mb-1">
                    Station {station.id}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {station.address}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: color }}
                    >
                      {station.statusLabel}
                    </span>
                    <span>{station.power}</span>
                  </div>
                  {station.status !== "maintenance" && (
                    <div className="mt-2 text-xs text-gray-500">
                      Battery: {station.batteryLevel}% • {station.timeRemaining}
                    </div>
                  )}
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}
