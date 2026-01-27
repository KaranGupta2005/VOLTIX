import StationState from "../models/StationState.js";

export default (io, socket) => {
  // Station status updates
  socket.on("station:subscribe", async (stationId) => {
    if (!stationId) return;
    
    socket.join(`station:${stationId}`);
    console.log(`User ${socket.userId} subscribed to station ${stationId}`);
    
    // Send current station status
    try {
      const station = await StationState.findOne({ stationId });
      if (station) {
        socket.emit("station:status", {
          stationId,
          status: station.status,
          queueLength: station.queueLength,
          availableSlots: station.availableSlots,
          lastUpdated: station.lastUpdated
        });
      }
    } catch (error) {
      console.error("Error fetching station status:", error);
    }
  });

  socket.on("station:unsubscribe", (stationId) => {
    if (!stationId) return;
    
    socket.leave(`station:${stationId}`);
    console.log(`User ${socket.userId} unsubscribed from station ${stationId}`);
  });

  // Location-based station updates
  socket.on("location:update", async ({ lat, lng, radius = 10 }) => {
    if (lat == null || lng == null) return;

    try {
      // Find nearby stations
      const nearbyStations = await StationState.find({
        "location.coordinates": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        }
      }).limit(20);

      // Join rooms for nearby stations
      nearbyStations.forEach(station => {
        socket.join(`station:${station.stationId}`);
      });

      // Send nearby stations data
      socket.emit("stations:nearby", {
        stations: nearbyStations.map(station => ({
          stationId: station.stationId,
          name: station.name,
          location: station.location,
          status: station.status,
          queueLength: station.queueLength,
          availableSlots: station.availableSlots,
          pricePerKwh: station.pricePerKwh,
          rating: station.rating
        })),
        userLocation: { lat, lng },
        radius
      });

    } catch (error) {
      console.error("Error updating location:", error);
      socket.emit("error", { message: "Failed to update location" });
    }
  });

  // Queue position updates
  socket.on("queue:join", async ({ stationId, estimatedArrival }) => {
    if (!stationId) return;

    try {
      const station = await StationState.findOne({ stationId });
      if (!station) {
        socket.emit("queue:error", { message: "Station not found" });
        return;
      }

      // Add user to queue (this would be more complex in real implementation)
      socket.join(`queue:${stationId}`);
      
      // Broadcast queue update to all users monitoring this station
      io.to(`station:${stationId}`).emit("queue:update", {
        stationId,
        queueLength: station.queueLength + 1,
        estimatedWaitTime: (station.queueLength + 1) * 15 // Rough estimate
      });

      socket.emit("queue:joined", {
        stationId,
        position: station.queueLength + 1,
        estimatedWaitTime: (station.queueLength + 1) * 15
      });

    } catch (error) {
      console.error("Error joining queue:", error);
      socket.emit("queue:error", { message: "Failed to join queue" });
    }
  });

  socket.on("queue:leave", async (stationId) => {
    if (!stationId) return;
    
    socket.leave(`queue:${stationId}`);
    
    // Broadcast queue update
    io.to(`station:${stationId}`).emit("queue:update", {
      stationId,
      userLeft: socket.userId
    });
  });
};