import axios from "axios";

class MLClient {
  constructor() {
    this.baseUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    this.timeout = parseInt(process.env.ML_TIMEOUT || "30000");
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async predictFailure(sensorData) {
    try {
      const response = await this.client.post(
        "/mechanic/predict-failure",
        sensorData,
      );
      return response.data;
    } catch (error) {
      console.error("ML Service Error (predictFailure):", error.message);
      throw error;
    }
  }

  async predictTrafficDemand(stationData) {
    try {
      const response = await this.client.post(
        "/traffic/predict-demand",
        stationData,
      );
      return response.data;
    } catch (error) {
      console.error("ML Service Error (predictTrafficDemand):", error.message);
      throw error;
    }
  }

  async predictStockoutRisk(logisticsData) {
    try {
      const response = await this.client.post(
        "/logistics/predict-stockout",
        logisticsData,
      );
      return response.data;
    } catch (error) {
      console.error("ML Service Error (predictStockoutRisk):", error.message);
      throw error;
    }
  }

  async predictEnergyPrice(marketData) {
    try {
      const response = await this.client.post(
        "/energy/predict-prices",
        marketData,
      );
      return response.data;
    } catch (error) {
      console.error("ML Service Error (predictEnergyPrice):", error.message);
      throw error;
    }
  }

  async analyzeDecision(decisionData) {
    try {
      const response = await this.client.post(
        "/audit/analyze-decision",
        decisionData,
      );
      return response.data;
    } catch (error) {
      console.error("ML Service Error (analyzeDecision):", error.message);
      throw error;
    }
  }

  async checkHealth() {
    try {
      const response = await this.client.get("/health");
      return response.data;
    } catch (error) {
      console.error("ML Service Health Check Failed:", error.message);
      return { status: "down", error: error.message };
    }
  }
}

export const mlService = new MLClient();
export default mlService;
