import stationDataService from '../services/stationDataService.js';

// Global station socket handler instance
let stationSocketHandler = null;

class StationSocketHandler {
  constructor(io) {
    this.io = io;
    this.startLiveUpdates();
  }

  startLiveUpdates() {
    // Emit updates every 30-40 seconds
    const getRandomInterval = () => 30000 + Math.random() * 10000;

    const emitUpdates = () => {
      try {
        // Get all stations data
        const stations = stationDataService.getAllStations();
        const systemOverview = stationDataService.getSystemOverview();

        // Emit system overview to all clients in system-overview room
        this.io.to('system-overview').emit('system-overview-update', {
          overview: systemOverview,
          timestamp: new Date().toISOString()
        });

        // Emit individual station updates
        stations.forEach(station => {
          this.io.to(`station-${station.id}`).emit('station-metrics-update', {
            stationId: station.id,
            status: station.status,
            health: station.health,
            demand: station.demand,
            inventory: station.inventory,
            errors: station.errors,
            timestamp: new Date().toISOString()
          });
        });

        // Emit stations list update to all clients
        this.io.emit('stations-list-update', {
          stations: stations.map(station => ({
            id: station.id,
            name: station.name,
            city: station.city,
            status: station.status,
            health: {
              uptime: station.health.uptime,
              temperature: station.health.temperature
            },
            demand: {
              queueLength: station.demand.queueLength,
              predictedCongestion: station.demand.predictedCongestion
            },
            inventory: {
              chargedBatteries: station.inventory.chargedBatteries,
              maxCapacity: station.inventory.maxCapacity,
              chargedRatio: station.inventory.chargedRatio,
              predictedStockout: station.inventory.predictedStockout
            }
          })),
          timestamp: new Date().toISOString()
        });

        // Check for alerts and emit them
        this.emitAlerts();

        console.log(`Emitted live updates for ${stations.length} stations`);
      } catch (error) {
        console.error('Error emitting station updates:', error);
      }

      // Schedule next update
      setTimeout(emitUpdates, getRandomInterval());
    };

    // Start the update cycle
    setTimeout(emitUpdates, getRandomInterval());
  }

  emitAlerts() {
    try {
      const stations = stationDataService.getAllStations();
      const alerts = [];

      stations.forEach(station => {
        // Critical errors
        if (station.status === 'error' || station.health.faultCount1h > 2) {
          alerts.push({
            id: `${station.id}-critical-${Date.now()}`,
            stationId: station.id,
            stationName: station.name,
            type: 'critical_error',
            severity: 'high',
            message: `Station ${station.id} has critical errors`,
            details: station.errors.recentErrors,
            timestamp: new Date().toISOString()
          });
        }

        // Stockout warnings
        if (station.inventory.predictedStockout && station.inventory.predictedStockout < 60) {
          alerts.push({
            id: `${station.id}-stockout-${Date.now()}`,
            stationId: station.id,
            stationName: station.name,
            type: 'stockout_warning',
            severity: 'medium',
            message: `Battery stockout predicted in ${station.inventory.predictedStockout} minutes`,
            details: {
              chargedBatteries: station.inventory.chargedBatteries,
              predictedTime: station.inventory.predictedStockout
            },
            timestamp: new Date().toISOString()
          });
        }

        // Congestion alerts
        if (station.demand.queueLength > 6) {
          alerts.push({
            id: `${station.id}-congestion-${Date.now()}`,
            stationId: station.id,
            stationName: station.name,
            type: 'congestion_alert',
            severity: 'medium',
            message: `High congestion: ${station.demand.queueLength} vehicles in queue`,
            details: {
              queueLength: station.demand.queueLength,
              avgWaitTime: station.demand.avgWaitTime
            },
            timestamp: new Date().toISOString()
          });
        }

        // Maintenance required
        if (station.health.uptime < 90) {
          alerts.push({
            id: `${station.id}-maintenance-${Date.now()}`,
            stationId: station.id,
            stationName: station.name,
            type: 'maintenance_required',
            severity: 'low',
            message: `Station uptime below 90%: ${station.health.uptime}%`,
            details: {
              uptime: station.health.uptime,
              faultCount24h: station.health.faultCount24h
            },
            timestamp: new Date().toISOString()
          });
        }
      });

      // Emit alerts if any exist
      if (alerts.length > 0) {
        this.io.emit('station-alerts', {
          alerts,
          total: alerts.length,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error emitting alerts:', error);
    }
  }
}

export default (io, socket) => {
  // Initialize global handler if not exists
  if (!stationSocketHandler) {
    stationSocketHandler = new StationSocketHandler(io);
  }

  // Join station-specific rooms
  socket.on('join-station', (stationId) => {
    socket.join(`station-${stationId}`);
    console.log(`Client ${socket.id} joined station ${stationId} room`);
  });

  socket.on('leave-station', (stationId) => {
    socket.leave(`station-${stationId}`);
    console.log(`Client ${socket.id} left station ${stationId} room`);
  });

  // Join system overview room
  socket.on('join-system-overview', () => {
    socket.join('system-overview');
    console.log(`Client ${socket.id} joined system overview room`);
  });

  socket.on('leave-system-overview', () => {
    socket.leave('system-overview');
    console.log(`Client ${socket.id} left system overview room`);
  });

  // Request immediate update
  socket.on('request-station-update', (stationId) => {
    if (stationId) {
      const station = stationDataService.getStationById(stationId);
      if (station) {
        socket.emit('station-metrics-update', {
          stationId: station.id,
          status: station.status,
          health: station.health,
          demand: station.demand,
          inventory: station.inventory,
          errors: station.errors,
          timestamp: new Date().toISOString()
        });
      }
    }
  });

  console.log(`Station handler initialized for socket ${socket.id}`);
};