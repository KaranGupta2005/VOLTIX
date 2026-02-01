import express from 'express';
import trafficAgent from '../agents/TrafficAgent.js';
import stationDataService from '../services/stationDataService.js';
import mlClient from '../scripts/mlClient.js';
import wrapAsync from '../middlewares/wrapAsync.js';
import ExpressError from '../middlewares/expressError.js';
import { userAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get optimal route with traffic optimization
router.post('/optimize-route', userAuth, wrapAsync(async (req, res) => {
  const { 
    userLocation, 
    destinationStationId, 
    preferences = {},
    userProfile = {}
  } = req.body;

  if (!userLocation || !Array.isArray(userLocation) || userLocation.length !== 2) {
    throw new ExpressError(400, 'Valid user location [latitude, longitude] is required');
  }

  if (!destinationStationId) {
    throw new ExpressError(400, 'Destination station ID is required');
  }

  try {
    // Get destination station
    const destinationStation = stationDataService.getStationById(destinationStationId);
    
    if (!destinationStation) {
      throw new ExpressError(404, 'Destination station not found');
    }

    // Get all nearby stations for alternatives
    const allStations = stationDataService.getAllStations();
    const nearbyStations = allStations
      .filter(s => s.id !== destinationStationId && s.status === 'operational')
      .map(s => ({
        ...s,
        distance: calculateDistance(
          userLocation[0], userLocation[1],
          s.latitude, s.longitude
        )
      }))
      .filter(s => s.distance <= (preferences.maxDistance || 10))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    // Calculate route to destination
    const destinationCoords = [destinationStation.latitude, destinationStation.longitude];
    const primaryRoute = await mlClient.calculateRoute(userLocation, destinationCoords);

    // Check if traffic agent should suggest alternatives
    const shouldSuggestAlternative = 
      destinationStation.demand?.queueLength >= 5 ||
      destinationStation.demand?.avgWaitTime >= 10 ||
      destinationStation.status !== 'operational';

    let optimization = {
      primaryRoute: {
        station: destinationStation,
        route: primaryRoute,
        estimatedWaitTime: destinationStation.demand?.avgWaitTime || 0,
        queueLength: destinationStation.demand?.queueLength || 0,
        totalTime: (primaryRoute.duration_minutes || 0) + (destinationStation.demand?.avgWaitTime || 0)
      },
      alternatives: [],
      recommendation: null,
      trafficAnalysis: null
    };

    if (shouldSuggestAlternative && nearbyStations.length > 0) {
      // Calculate routes and incentives for alternatives
      const alternativePromises = nearbyStations.map(async (station) => {
        const stationCoords = [station.latitude, station.longitude];
        const route = await mlClient.calculateRoute(userLocation, stationCoords);
        
        // Calculate incentive using traffic agent
        const incentive = await mlClient.calculateIncentive(
          {
            ...destinationStation,
            weather: 'sunny',
            temperature: 28,
            station_capacity: destinationStation.capacity,
            station_type: destinationStation.type,
            is_highway: destinationStation.isHighway ? 1 : 0,
            is_mall: destinationStation.isMall ? 1 : 0,
            is_office: destinationStation.isOffice ? 1 : 0,
            is_holiday: 0,
            nearby_event: 0
          },
          {
            ...station,
            weather: 'sunny',
            temperature: 28,
            station_capacity: station.capacity,
            station_type: station.type,
            is_highway: station.isHighway ? 1 : 0,
            is_mall: station.isMall ? 1 : 0,
            is_office: station.isOffice ? 1 : 0,
            is_holiday: 0,
            nearby_event: 0,
            distance_km: station.distance
          },
          {
            ...userProfile,
            time_value_per_minute: userProfile.timeValuePerMinute || 2,
            cost_per_km: userProfile.costPerKm || 5,
            price_sensitivity: userProfile.priceSensitivity || 0.5
          }
        );

        return {
          station,
          route,
          incentive,
          estimatedWaitTime: station.demand?.avgWaitTime || 0,
          queueLength: station.demand?.queueLength || 0,
          totalTime: (route.duration_minutes || 0) + (station.demand?.avgWaitTime || 0),
          timeSaved: optimization.primaryRoute.totalTime - ((route.duration_minutes || 0) + (station.demand?.avgWaitTime || 0))
        };
      });

      const alternatives = await Promise.all(alternativePromises);
      
      // Filter alternatives that actually save time or have good incentives
      optimization.alternatives = alternatives
        .filter(alt => 
          alt.timeSaved > 0 || 
          (alt.incentive && alt.incentive.acceptance_probability > 0.5)
        )
        .sort((a, b) => b.timeSaved - a.timeSaved);

      // Determine best recommendation
      if (optimization.alternatives.length > 0) {
        const bestAlternative = optimization.alternatives[0];
        
        optimization.recommendation = {
          type: 'alternative_station',
          station: bestAlternative.station,
          reason: `Save ${Math.round(bestAlternative.timeSaved)} minutes`,
          incentive: bestAlternative.incentive,
          savings: {
            time: Math.round(bestAlternative.timeSaved),
            money: bestAlternative.incentive?.recommended_incentive || 0
          }
        };
      }
    }

    // Get traffic analysis from agent
    const eventData = {
      type: 'route_request',
      stationId: destinationStationId,
      data: {
        queueLength: destinationStation.demand?.queueLength || 0,
        avgWaitTime: destinationStation.demand?.avgWaitTime || 0,
        availableSlots: destinationStation.capacity - (destinationStation.demand?.queueLength || 0),
        capacity: destinationStation.capacity
      }
    };

    const detection = await trafficAgent.detect(eventData);
    
    if (detection.shouldProcess) {
      const decision = await trafficAgent.decide(eventData, detection.context);
      optimization.trafficAnalysis = {
        detected: detection.reason,
        action: decision.action,
        confidence: decision.confidence,
        impact: decision.impact
      };
    }

    res.json({
      success: true,
      optimization,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Traffic Route] Optimization error:', error);
    throw new ExpressError(500, error.message);
  }
}));

// Get real-time traffic conditions for a route
router.post('/traffic-conditions', userAuth, wrapAsync(async (req, res) => {
  const { routeCoordinates } = req.body;

  if (!Array.isArray(routeCoordinates) || routeCoordinates.length < 2) {
    throw new ExpressError(400, 'Route coordinates array is required');
  }

  try {
    // Get traffic conditions (mock for now, would integrate with real traffic API)
    const conditions = {
      segments: [],
      overallLevel: 'moderate',
      totalDelay: 0,
      timestamp: new Date().toISOString()
    };

    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const start = routeCoordinates[i];
      const end = routeCoordinates[i + 1];
      
      const distance = calculateDistance(start[0], start[1], end[0], end[1]);
      const currentHour = new Date().getHours();
      
      // Simulate traffic based on time of day
      let trafficLevel, delayFactor;
      if ([8, 9, 17, 18, 19].includes(currentHour)) {
        trafficLevel = Math.random() > 0.5 ? 'heavy' : 'moderate';
        delayFactor = 1.5 + Math.random() * 0.5;
      } else if ([7, 10, 16, 20].includes(currentHour)) {
        trafficLevel = 'moderate';
        delayFactor = 1.2 + Math.random() * 0.3;
      } else {
        trafficLevel = 'light';
        delayFactor = 1.0 + Math.random() * 0.2;
      }

      const delay = (delayFactor - 1) * (distance / 30) * 60; // minutes

      conditions.segments.push({
        start,
        end,
        distance,
        trafficLevel,
        delayFactor,
        estimatedDelay: delay
      });

      conditions.totalDelay += delay;
    }

    // Determine overall traffic level
    const avgDelay = conditions.totalDelay / conditions.segments.length;
    if (avgDelay > 5) conditions.overallLevel = 'heavy';
    else if (avgDelay > 2) conditions.overallLevel = 'moderate';
    else conditions.overallLevel = 'light';

    res.json({
      success: true,
      conditions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Traffic Route] Conditions error:', error);
    throw new ExpressError(500, error.message);
  }
}));

// Update user location and get nearby stations with traffic info
router.post('/update-location', userAuth, wrapAsync(async (req, res) => {
  const { location, accuracy } = req.body;
  const userId = req.user.userId;

  if (!location || !Array.isArray(location) || location.length !== 2) {
    throw new ExpressError(400, 'Valid location [latitude, longitude] is required');
  }

  try {
    // Update user location in database (would be implemented in User model)
    // For now, just return nearby stations

    const allStations = stationDataService.getAllStations();
    const nearbyStations = allStations
      .map(station => ({
        ...station,
        distance: calculateDistance(
          location[0], location[1],
          station.latitude, station.longitude
        )
      }))
      .filter(station => station.distance <= 10) // Within 10km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    // Add traffic analysis for each station
    const stationsWithTraffic = nearbyStations.map(station => {
      const queueLevel = station.demand?.queueLength || 0;
      const waitTime = station.demand?.avgWaitTime || 0;
      
      let trafficStatus = 'low';
      if (queueLevel >= 8 || waitTime >= 15) trafficStatus = 'high';
      else if (queueLevel >= 5 || waitTime >= 10) trafficStatus = 'medium';

      return {
        ...station,
        trafficStatus,
        recommendation: trafficStatus === 'high' ? 'Consider alternative' : 'Available'
      };
    });

    res.json({
      success: true,
      location: {
        coordinates: location,
        accuracy,
        timestamp: new Date().toISOString()
      },
      nearbyStations: stationsWithTraffic,
      count: stationsWithTraffic.length
    });

  } catch (error) {
    console.error('[Traffic Route] Location update error:', error);
    throw new ExpressError(500, error.message);
  }
}));

// Get traffic incentives for a specific station
router.get('/incentives/:stationId', userAuth, wrapAsync(async (req, res) => {
  const { stationId } = req.params;
  const { userLocation } = req.query;

  if (!stationId) {
    throw new ExpressError(400, 'Station ID is required');
  }

  try {
    const station = stationDataService.getStationById(stationId);
    
    if (!station) {
      throw new ExpressError(404, 'Station not found');
    }

    // Check if station has congestion
    const queueLength = station.demand?.queueLength || 0;
    const waitTime = station.demand?.avgWaitTime || 0;

    if (queueLength < 5 && waitTime < 10) {
      return res.json({
        success: true,
        hasIncentives: false,
        message: 'No congestion detected - no incentives needed',
        station: {
          id: station.id,
          name: station.name,
          queueLength,
          waitTime
        }
      });
    }

    // Get nearby alternatives
    const allStations = stationDataService.getAllStations();
    let nearbyStations = allStations
      .filter(s => s.id !== stationId && s.status === 'operational');

    if (userLocation) {
      const [lat, lng] = userLocation.split(',').map(Number);
      nearbyStations = nearbyStations
        .map(s => ({
          ...s,
          distance: calculateDistance(lat, lng, s.latitude, s.longitude)
        }))
        .filter(s => s.distance <= 10)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
    } else {
      nearbyStations = nearbyStations.slice(0, 3);
    }

    // Calculate incentives for each alternative
    const incentives = await Promise.all(
      nearbyStations.map(async (altStation) => {
        const incentive = await mlClient.calculateIncentive(
          {
            weather: 'sunny',
            temperature: 28,
            station_capacity: station.capacity,
            station_type: station.type,
            is_highway: station.isHighway ? 1 : 0,
            is_mall: station.isMall ? 1 : 0,
            is_office: station.isOffice ? 1 : 0,
            is_holiday: 0,
            nearby_event: 0
          },
          {
            weather: 'sunny',
            temperature: 28,
            station_capacity: altStation.capacity,
            station_type: altStation.type,
            is_highway: altStation.isHighway ? 1 : 0,
            is_mall: altStation.isMall ? 1 : 0,
            is_office: altStation.isOffice ? 1 : 0,
            is_holiday: 0,
            nearby_event: 0,
            distance_km: altStation.distance || 2
          },
          {
            time_value_per_minute: 2,
            cost_per_km: 5,
            price_sensitivity: 0.5
          }
        );

        return {
          station: {
            id: altStation.id,
            name: altStation.name,
            distance: altStation.distance || 0,
            queueLength: altStation.demand?.queueLength || 0,
            waitTime: altStation.demand?.avgWaitTime || 0
          },
          incentive
        };
      })
    );

    res.json({
      success: true,
      hasIncentives: true,
      currentStation: {
        id: station.id,
        name: station.name,
        queueLength,
        waitTime
      },
      incentives: incentives.filter(i => i.incentive.acceptance_probability > 0.3),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Traffic Route] Incentives error:', error);
    throw new ExpressError(500, error.message);
  }
}));

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;
