import User from "../models/User.js";
import StationState from "../models/StationState.js";
import { getDistanceKm } from "./geo.js";

export const resolveRecipients = async (eventType, payload) => {
  const recipients = [];

  switch (eventType) {
    // Mechanic Agent Events
    case "HARDWARE_FAILURE":
    case "SELF_HEALING_FAILED":
    case "MAINTENANCE_REQUIRED": {
      // Notify operators and nearby technicians
      const operators = await User.find({
        $or: [
          { "profile.role": "operator" },
          { "profile.role": "admin" },
          { "profile.role": "technician" }
        ]
      });
      recipients.push(...operators);
      break;
    }

    case "SELF_HEALING_SUCCESS":
    case "SELF_HEALING_STARTED": {
      // Notify only operators for informational updates
      const operators = await User.find({
        $or: [
          { "profile.role": "operator" },
          { "profile.role": "admin" }
        ]
      });
      recipients.push(...operators);
      break;
    }

    // Traffic Agent Events
    case "INCENTIVE_OFFERED": {
      // Notify specific user
      if (payload.userId) {
        const user = await User.findOne({ userId: payload.userId });
        if (user) recipients.push(user);
      }
      break;
    }

    case "CONGESTION_ALERT":
    case "CONGESTION_CRITICAL": {
      // Notify nearby users and operators
      if (payload.stationLocation) {
        const nearbyUsers = await User.find({
          "location.coordinates": {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [payload.stationLocation.lng, payload.stationLocation.lat]
              },
              $maxDistance: 5000 // 5km radius
            }
          }
        });
        recipients.push(...nearbyUsers);
      }

      // Also notify operators
      const operators = await User.find({
        $or: [
          { "profile.role": "operator" },
          { "profile.role": "admin" }
        ]
      });
      recipients.push(...operators);
      break;
    }

    // Logistics Agent Events
    case "STOCKOUT_PREDICTED":
    case "STOCKOUT_IMMINENT":
    case "INVENTORY_CRITICAL": {
      // Notify logistics team and operators
      const logisticsTeam = await User.find({
        $or: [
          { "profile.role": "logistics" },
          { "profile.role": "operator" },
          { "profile.role": "admin" }
        ]
      });
      recipients.push(...logisticsTeam);
      break;
    }

    case "DISPATCH_INITIATED":
    case "DISPATCH_COMPLETED": {
      // Notify logistics team
      const logisticsTeam = await User.find({
        "profile.role": "logistics"
      });
      recipients.push(...logisticsTeam);
      break;
    }

    // Energy Agent Events
    case "PRICE_SPIKE":
    case "PRICE_SPIKE_CRITICAL":
    case "GRID_INSTABILITY": {
      // Notify operators and energy managers
      const energyTeam = await User.find({
        $or: [
          { "profile.role": "operator" },
          { "profile.role": "admin" },
          { "profile.role": "energy_manager" }
        ]
      });
      recipients.push(...energyTeam);
      break;
    }

    case "TRADING_OPPORTUNITY":
    case "ARBITRAGE_EXECUTED": {
      // Notify energy managers and admins
      const energyTeam = await User.find({
        $or: [
          { "profile.role": "admin" },
          { "profile.role": "energy_manager" }
        ]
      });
      recipients.push(...energyTeam);
      break;
    }

    // Auditor Agent Events
    case "ANOMALY_DETECTED":
    case "COMPLIANCE_VIOLATION":
    case "AUDIT_COMPLETE": {
      // Notify compliance team and admins
      const complianceTeam = await User.find({
        $or: [
          { "profile.role": "admin" },
          { "profile.role": "compliance" },
          { "profile.role": "auditor" }
        ]
      });
      recipients.push(...complianceTeam);
      break;
    }

    // Station-specific events
    case "STATION_OFFLINE":
    case "STATION_ONLINE": {
      // Notify operators and nearby users
      const operators = await User.find({
        $or: [
          { "profile.role": "operator" },
          { "profile.role": "admin" }
        ]
      });
      recipients.push(...operators);

      // Notify nearby users if station location provided
      if (payload.stationLocation) {
        const nearbyUsers = await User.find({
          "location.coordinates": {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [payload.stationLocation.lng, payload.stationLocation.lat]
              },
              $maxDistance: 10000 // 10km radius
            }
          }
        });
        recipients.push(...nearbyUsers);
      }
      break;
    }

    // User-specific events
    case "CHARGING_COMPLETE":
    case "CHARGING_INTERRUPTED":
    case "PAYMENT_FAILED": {
      // Notify specific user
      if (payload.userId) {
        const user = await User.findOne({ userId: payload.userId });
        if (user) recipients.push(user);
      }
      break;
    }

    default:
      console.warn(`Unknown event type: ${eventType}`);
      break;
  }

  // Remove duplicates based on userId
  const uniqueRecipients = recipients.filter((recipient, index, self) => 
    index === self.findIndex(r => r.userId === recipient.userId)
  );

  console.log("🎯 recipients:", uniqueRecipients.map((u) => ({
    id: u.userId,
    role: u.profile?.role || 'user',
  })));

  return uniqueRecipients;
};