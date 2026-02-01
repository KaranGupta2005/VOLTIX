const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface RouteOptimization {
  primaryRoute: {
    station: any;
    route: any;
    estimatedWaitTime: number;
    queueLength: number;
    totalTime: number;
  };
  alternatives: Array<{
    station: any;
    route: any;
    incentive: any;
    estimatedWaitTime: number;
    queueLength: number;
    totalTime: number;
    timeSaved: number;
  }>;
  recommendation: {
    type: string;
    station: any;
    reason: string;
    incentive: any;
    savings: {
      time: number;
      money: number;
    };
  } | null;
  trafficAnalysis: any;
}

export interface TrafficConditions {
  segments: Array<{
    start: [number, number];
    end: [number, number];
    distance: number;
    trafficLevel: string;
    delayFactor: number;
    estimatedDelay: number;
  }>;
  overallLevel: string;
  totalDelay: number;
  timestamp: string;
}

export interface LocationUpdate {
  location: {
    coordinates: [number, number];
    accuracy: number;
    timestamp: string;
  };
  nearbyStations: any[];
  count: number;
}

class TrafficService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async optimizeRoute(
    userLocation: [number, number],
    destinationStationId: string,
    preferences: any = {},
    userProfile: any = {}
  ): Promise<RouteOptimization> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/traffic/optimize-route`, {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({
          userLocation,
          destinationStationId,
          preferences,
          userProfile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to optimize route");
      }

      return data.optimization;
    } catch (error) {
      console.error("Route optimization error:", error);
      throw error;
    }
  }

  async getTrafficConditions(
    routeCoordinates: Array<[number, number]>
  ): Promise<TrafficConditions> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/traffic/traffic-conditions`, {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ routeCoordinates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get traffic conditions");
      }

      return data.conditions;
    } catch (error) {
      console.error("Traffic conditions error:", error);
      throw error;
    }
  }

  async updateLocation(
    location: [number, number],
    accuracy: number
  ): Promise<LocationUpdate> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/traffic/update-location`, {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ location, accuracy }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update location");
      }

      return data;
    } catch (error) {
      console.error("Location update error:", error);
      throw error;
    }
  }

  async getIncentives(
    stationId: string,
    userLocation?: [number, number]
  ): Promise<any> {
    try {
      const url = new URL(`${API_BASE_URL}/api/traffic/incentives/${stationId}`);
      
      if (userLocation) {
        url.searchParams.append("userLocation", userLocation.join(","));
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getHeaders(),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get incentives");
      }

      return data;
    } catch (error) {
      console.error("Incentives error:", error);
      throw error;
    }
  }

  // Calculate route using ML service
  async calculateRoute(
    startCoords: [number, number],
    endCoords: [number, number],
    profile: string = "driving"
  ): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ml/route/calculate`, {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ startCoords, endCoords, profile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to calculate route");
      }

      return data.route;
    } catch (error) {
      console.error("Route calculation error:", error);
      throw error;
    }
  }

  // Get alternative routes
  async getAlternativeRoutes(
    startCoords: [number, number],
    endCoords: [number, number],
    numAlternatives: number = 3
  ): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ml/route/alternatives`, {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ startCoords, endCoords, numAlternatives }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get alternative routes");
      }

      return data.routes;
    } catch (error) {
      console.error("Alternative routes error:", error);
      throw error;
    }
  }

  // Assess route risk
  async assessRouteRisk(
    startCoords: [number, number],
    endCoords: [number, number],
    weatherConditions: any = null
  ): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ml/route/risk-assessment`, {
        method: "POST",
        headers: this.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ startCoords, endCoords, weatherConditions }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to assess route risk");
      }

      return data.assessment;
    } catch (error) {
      console.error("Route risk assessment error:", error);
      throw error;
    }
  }
}

const trafficService = new TrafficService();
export default trafficService;
