import Joi from "joi";

// user signup schema
export const userSignUpSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 50 characters",
      "any.required": "Name is required",
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  phone: Joi.string()
    .pattern(/^\+91[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid Indian mobile number (+91XXXXXXXXXX)",
      "any.required": "Phone number is required",
    }),
  city: Joi.string()
    .valid("Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata")
    .required()
    .messages({
      "any.only": "City must be one of Mumbai, Delhi, Bangalore, Chennai, or Kolkata",
      "any.required": "City is required",
    }),
  vehicleType: Joi.string()
    .valid("sedan", "suv", "hatchback", "commercial")
    .lowercase()
    .default("sedan")
    .messages({
      "any.only": "Vehicle type must be sedan, suv, hatchback, or commercial",
    }),
  vehicleMake: Joi.string()
    .trim()
    .required()
    .messages({
      "any.required": "Vehicle make is required",
    }),
  vehicleModel: Joi.string()
    .trim()
    .required()
    .messages({
      "any.required": "Vehicle model is required",
    }),
  vehicleYear: Joi.number()
    .integer()
    .min(2015)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      "number.min": "Vehicle year must be 2015 or later",
      "number.max": `Vehicle year cannot be later than ${new Date().getFullYear() + 1}`,
      "any.required": "Vehicle year is required",
    }),
  batteryCapacity: Joi.number()
    .min(10)
    .max(200)
    .required()
    .messages({
      "number.min": "Battery capacity must be at least 10 kWh",
      "number.max": "Battery capacity must be at most 200 kWh",
      "any.required": "Battery capacity is required",
    }),
  registrationNumber: Joi.string()
    .trim()
    .uppercase()
    .required()
    .messages({
      "any.required": "Vehicle registration number is required",
    }),
}).options({ abortEarly: false });

// user login schema
export const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
}).options({ abortEarly: false });

// station state create schema
export const createStationStateSchema = Joi.object({
  stationId: Joi.string()
    .pattern(/^ST\d{3}$/)
    .required()
    .messages({
      "string.pattern.base": "Station ID must follow format ST001-ST999",
      "any.required": "Station ID is required",
    }),
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.min": "Station name must be at least 3 characters",
      "string.max": "Station name must be at most 100 characters",
      "any.required": "Station name is required",
    }),
  city: Joi.string()
    .valid("Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata")
    .required()
    .messages({
      "any.only": "City must be one of Mumbai, Delhi, Bangalore, Chennai, or Kolkata",
      "any.required": "City is required",
    }),
  stationType: Joi.string()
    .valid("standard", "fast", "ultra")
    .required()
    .messages({
      "any.only": "Station type must be standard, fast, or ultra",
      "any.required": "Station type is required",
    }),
  capacity: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .required()
    .messages({
      "number.min": "Capacity must be at least 1",
      "number.max": "Capacity must be at most 20",
      "any.required": "Capacity is required",
    }),
  maxInventory: Joi.number()
    .integer()
    .min(10)
    .max(500)
    .required()
    .messages({
      "number.min": "Max inventory must be at least 10",
      "number.max": "Max inventory must be at most 500",
      "any.required": "Max inventory is required",
    }),
  location: Joi.object({
    type: Joi.string()
      .valid("Point")
      .required()
      .messages({
        "any.only": "Location type must be Point",
        "any.required": "Location type is required",
      }),
    coordinates: Joi.array()
      .items(
        Joi.number().min(-180).max(180), // longitude
        Joi.number().min(-90).max(90)    // latitude
      )
      .length(2)
      .required()
      .messages({
        "array.length": "Coordinates must contain exactly 2 values [longitude, latitude]",
        "any.required": "Coordinates are required",
      }),
  }).required(),
  operator: Joi.string()
    .trim()
    .required()
    .messages({
      "any.required": "Operator is required",
    }),
  installationDate: Joi.date()
    .required()
    .messages({
      "any.required": "Installation date is required",
    }),
  pricePerKwh: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.min": "Price per kWh cannot be negative",
      "any.required": "Price per kWh is required",
    }),
}).options({ abortEarly: false });

export const updateStationStateSchema = Joi.object({
  operationalStatus: Joi.object({
    status: Joi.string().valid("active", "maintenance", "offline", "emergency").optional(),
    maintenanceScheduled: Joi.date().optional(),
    emergencyContact: Joi.string().optional(),
  }).optional(),
  realTimeData: Joi.object({
    currentInventory: Joi.number().integer().min(0).optional(),
    availableSlots: Joi.number().integer().min(0).optional(),
    queueLength: Joi.number().integer().min(0).optional(),
    avgWaitTime: Joi.number().min(0).optional(),
    currentLoad: Joi.number().min(0).max(100).optional(),
    powerConsumption: Joi.number().min(0).optional(),
  }).optional(),
  pricing: Joi.object({
    pricePerKwh: Joi.number().min(0).optional(),
    peakHourMultiplier: Joi.number().min(1.0).max(3.0).optional(),
    discountActive: Joi.boolean().optional(),
    discountPercentage: Joi.number().min(0).max(50).optional(),
  }).optional(),
}).options({ abortEarly: false });

// signal log create schema
export const createSignalLogSchema = Joi.object({
  signalId: Joi.string()
    .pattern(/^SIG_\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Signal ID must follow format SIG_000001",
      "any.required": "Signal ID is required",
    }),
  stationId: Joi.string()
    .pattern(/^ST\d{3}$/)
    .required()
    .messages({
      "string.pattern.base": "Station ID must follow format ST001-ST999",
      "any.required": "Station ID is required",
    }),
  timestamp: Joi.date()
    .required()
    .messages({
      "any.required": "Timestamp is required",
    }),
  sensorData: Joi.object({
    temperature: Joi.number()
      .min(-50)
      .max(150)
      .required()
      .messages({
        "number.min": "Temperature must be at least -50°C",
        "number.max": "Temperature must be at most 150°C",
        "any.required": "Temperature is required",
      }),
    voltage: Joi.number()
      .min(0)
      .max(500)
      .required()
      .messages({
        "number.min": "Voltage cannot be negative",
        "number.max": "Voltage must be at most 500V",
        "any.required": "Voltage is required",
      }),
    current: Joi.number()
      .min(0)
      .max(200)
      .required()
      .messages({
        "number.min": "Current cannot be negative",
        "number.max": "Current must be at most 200A",
        "any.required": "Current is required",
      }),
    vibration: Joi.number()
      .min(0)
      .max(5.0)
      .required()
      .messages({
        "number.min": "Vibration cannot be negative",
        "number.max": "Vibration must be at most 5.0 G-force",
        "any.required": "Vibration is required",
      }),
    humidity: Joi.number()
      .min(0)
      .max(100)
      .required()
      .messages({
        "number.min": "Humidity cannot be negative",
        "number.max": "Humidity must be at most 100%",
        "any.required": "Humidity is required",
      }),
    powerFactor: Joi.number()
      .min(0)
      .max(1)
      .default(0.95)
      .messages({
        "number.min": "Power factor cannot be negative",
        "number.max": "Power factor must be at most 1",
      }),
    frequency: Joi.number()
      .min(45)
      .max(55)
      .default(50)
      .messages({
        "number.min": "Frequency must be at least 45 Hz",
        "number.max": "Frequency must be at most 55 Hz",
      }),
  }).required(),
  performance: Joi.object({
    uptime: Joi.number()
      .min(0)
      .max(100)
      .required()
      .messages({
        "number.min": "Uptime cannot be negative",
        "number.max": "Uptime must be at most 100%",
        "any.required": "Uptime is required",
      }),
    errorRate: Joi.number()
      .min(0)
      .required()
      .messages({
        "number.min": "Error rate cannot be negative",
        "any.required": "Error rate is required",
      }),
    responseTime: Joi.number()
      .min(0)
      .default(0)
      .messages({
        "number.min": "Response time cannot be negative",
      }),
    throughput: Joi.number()
      .min(0)
      .default(0)
      .messages({
        "number.min": "Throughput cannot be negative",
      }),
    efficiency: Joi.number()
      .min(0)
      .max(100)
      .default(95)
      .messages({
        "number.min": "Efficiency cannot be negative",
        "number.max": "Efficiency must be at most 100%",
      }),
  }).required(),
  status: Joi.string()
    .valid("normal", "warning", "critical", "offline", "maintenance")
    .required()
    .messages({
      "any.only": "Status must be normal, warning, critical, offline, or maintenance",
      "any.required": "Status is required",
    }),
  chargingData: Joi.object({
    activeSessions: Joi.number().integer().min(0).default(0),
    totalPowerOutput: Joi.number().min(0).default(0),
    avgChargingRate: Joi.number().min(0).default(0),
    peakDemand: Joi.number().min(0).default(0),
  }).optional(),
  environmentalData: Joi.object({
    ambientTemperature: Joi.number().default(25),
    weatherCondition: Joi.string().valid("sunny", "cloudy", "rainy", "stormy", "foggy").default("sunny"),
    airQuality: Joi.number().min(0).max(500).default(50),
  }).optional(),
}).options({ abortEarly: false });

// decision log create schema
export const createDecisionLogSchema = Joi.object({
  decisionId: Joi.string()
    .pattern(/^DEC_\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Decision ID must follow format DEC_000001",
      "any.required": "Decision ID is required",
    }),
  timestamp: Joi.date()
    .required()
    .messages({
      "any.required": "Timestamp is required",
    }),
  stationId: Joi.string()
    .pattern(/^ST\d{3}$/)
    .required()
    .messages({
      "string.pattern.base": "Station ID must follow format ST001-ST999",
      "any.required": "Station ID is required",
    }),
  agent: Joi.string()
    .valid("MechanicAgent", "TrafficAgent", "LogisticsAgent", "EnergyAgent", "AuditorAgent")
    .required()
    .messages({
      "any.only": "Agent must be one of MechanicAgent, TrafficAgent, LogisticsAgent, EnergyAgent, or AuditorAgent",
      "any.required": "Agent is required",
    }),
  action: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.min": "Action must be at least 2 characters",
      "string.max": "Action must be at most 100 characters",
      "any.required": "Action is required",
    }),
  triggerEvent: Joi.string()
    .valid("routine_monitoring", "threshold_breach", "user_request", "system_alert", "external_event", "scheduled_task", "emergency")
    .required()
    .messages({
      "any.only": "Trigger event must be one of routine_monitoring, threshold_breach, user_request, system_alert, external_event, scheduled_task, or emergency",
      "any.required": "Trigger event is required",
    }),
  context: Joi.object({
    inputData: Joi.any().required(),
    environmentalFactors: Joi.object({
      weather: Joi.string().optional(),
      timeOfDay: Joi.string().optional(),
      dayOfWeek: Joi.string().optional(),
      isHoliday: Joi.boolean().optional(),
      nearbyEvents: Joi.array().items(Joi.string()).optional(),
    }).optional(),
    stationContext: Joi.object({
      currentLoad: Joi.number().optional(),
      queueLength: Joi.number().optional(),
      inventoryLevel: Joi.number().optional(),
      recentAlerts: Joi.array().items(Joi.string()).optional(),
    }).optional(),
  }).required(),
  mlMetrics: Joi.object({
    confidenceScore: Joi.number()
      .min(0)
      .max(1)
      .required()
      .messages({
        "number.min": "Confidence score must be at least 0",
        "number.max": "Confidence score must be at most 1",
        "any.required": "Confidence score is required",
      }),
    executionTime: Joi.number()
      .min(0)
      .required()
      .messages({
        "number.min": "Execution time cannot be negative",
        "any.required": "Execution time is required",
      }),
    modelVersion: Joi.string().default("1.0.0"),
    featuresUsed: Joi.array().items(Joi.string()).optional(),
    predictionAccuracy: Joi.number().min(0).max(1).optional(),
  }).required(),
  impact: Joi.object({
    costImpact: Joi.number()
      .required()
      .messages({
        "any.required": "Cost impact is required",
      }),
    revenueImpact: Joi.number()
      .required()
      .messages({
        "any.required": "Revenue impact is required",
      }),
    successRate: Joi.number()
      .min(0)
      .max(1)
      .required()
      .messages({
        "number.min": "Success rate must be at least 0",
        "number.max": "Success rate must be at most 1",
        "any.required": "Success rate is required",
      }),
    userSatisfaction: Joi.number()
      .min(0)
      .max(1)
      .required()
      .messages({
        "number.min": "User satisfaction must be at least 0",
        "number.max": "User satisfaction must be at most 1",
        "any.required": "User satisfaction is required",
      }),
    riskScore: Joi.number()
      .min(0)
      .max(1)
      .required()
      .messages({
        "number.min": "Risk score must be at least 0",
        "number.max": "Risk score must be at most 1",
        "any.required": "Risk score is required",
      }),
    environmentalImpact: Joi.object({
      carbonSaved: Joi.number().default(0),
      energyEfficiency: Joi.number().default(0),
    }).optional(),
  }).required(),
  systemMetrics: Joi.object({
    cpuUsage: Joi.number()
      .min(0)
      .max(100)
      .required()
      .messages({
        "number.min": "CPU usage cannot be negative",
        "number.max": "CPU usage must be at most 100%",
        "any.required": "CPU usage is required",
      }),
    memoryUsage: Joi.number()
      .min(0)
      .max(100)
      .required()
      .messages({
        "number.min": "Memory usage cannot be negative",
        "number.max": "Memory usage must be at most 100%",
        "any.required": "Memory usage is required",
      }),
    apiCalls: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        "number.min": "API calls cannot be negative",
        "any.required": "API calls is required",
      }),
    networkLatency: Joi.number().min(0).default(0),
    databaseQueries: Joi.number().integer().min(0).default(0),
  }).required(),
  priority: Joi.string()
    .valid("low", "medium", "high", "urgent")
    .default("medium")
    .messages({
      "any.only": "Priority must be low, medium, high, or urgent",
    }),
}).options({ abortEarly: false });

// energy market create schema
export const createEnergyMarketSchema = Joi.object({
  marketId: Joi.string()
    .pattern(/^MKT_\d{6}$/)
    .optional()
    .messages({
      "string.pattern.base": "Market ID must follow format MKT_000001",
    }),
  timestamp: Joi.date()
    .required()
    .messages({
      "any.required": "Timestamp is required",
    }),
  gridData: Joi.object({
    demand: Joi.number()
      .min(0)
      .max(10000)
      .required()
      .messages({
        "number.min": "Grid demand cannot be negative",
        "number.max": "Grid demand must be at most 10000 MW",
        "any.required": "Grid demand is required",
      }),
    supply: Joi.number()
      .min(0)
      .max(12000)
      .required()
      .messages({
        "number.min": "Grid supply cannot be negative",
        "number.max": "Grid supply must be at most 12000 MW",
        "any.required": "Grid supply is required",
      }),
    frequency: Joi.number()
      .min(45)
      .max(55)
      .default(50)
      .messages({
        "number.min": "Grid frequency must be at least 45 Hz",
        "number.max": "Grid frequency must be at most 55 Hz",
      }),
    loadFactor: Joi.number()
      .min(0)
      .max(1)
      .default(0.8)
      .messages({
        "number.min": "Load factor cannot be negative",
        "number.max": "Load factor must be at most 1",
      }),
    peakDemand: Joi.number().min(0).default(0),
    baseLoad: Joi.number().min(0).default(0),
  }).required(),
  environmentalData: Joi.object({
    temperature: Joi.number()
      .min(-50)
      .max(60)
      .required()
      .messages({
        "number.min": "Temperature must be at least -50°C",
        "number.max": "Temperature must be at most 60°C",
        "any.required": "Temperature is required",
      }),
    solarIrradiance: Joi.number()
      .min(0)
      .max(1500)
      .required()
      .messages({
        "number.min": "Solar irradiance cannot be negative",
        "number.max": "Solar irradiance must be at most 1500 W/m²",
        "any.required": "Solar irradiance is required",
      }),
    windSpeed: Joi.number()
      .min(0)
      .max(50)
      .required()
      .messages({
        "number.min": "Wind speed cannot be negative",
        "number.max": "Wind speed must be at most 50 m/s",
        "any.required": "Wind speed is required",
      }),
    humidity: Joi.number().min(0).max(100).default(50),
    weatherCondition: Joi.string().valid("sunny", "cloudy", "rainy", "stormy", "foggy", "snowy").default("sunny"),
    airQuality: Joi.number().min(0).max(500).default(50),
  }).required(),
  pricing: Joi.object({
    coalPrice: Joi.number()
      .min(0)
      .max(10000)
      .required()
      .messages({
        "number.min": "Coal price cannot be negative",
        "number.max": "Coal price must be at most ₹10000/ton",
        "any.required": "Coal price is required",
      }),
    gasPrice: Joi.number()
      .min(0)
      .max(100)
      .required()
      .messages({
        "number.min": "Gas price cannot be negative",
        "number.max": "Gas price must be at most ₹100/unit",
        "any.required": "Gas price is required",
      }),
    carbonPrice: Joi.number()
      .min(0)
      .max(5000)
      .required()
      .messages({
        "number.min": "Carbon price cannot be negative",
        "number.max": "Carbon price must be at most ₹5000/ton CO2",
        "any.required": "Carbon price is required",
      }),
    currentEnergyPrice: Joi.number()
      .min(0)
      .max(50)
      .required()
      .messages({
        "number.min": "Energy price cannot be negative",
        "number.max": "Energy price must be at most ₹50/kWh",
        "any.required": "Current energy price is required",
      }),
    transmissionCost: Joi.number().min(0).default(0.5),
    distributionCost: Joi.number().min(0).default(1.0),
    regulatoryCharges: Joi.number().min(0).default(0.2),
  }).required(),
  renewableGeneration: Joi.object({
    solar: Joi.object({
      capacity: Joi.number().min(0).default(0),
      generation: Joi.number().min(0).default(0),
      efficiency: Joi.number().min(0).max(1).default(0.2),
    }).optional(),
    wind: Joi.object({
      capacity: Joi.number().min(0).default(0),
      generation: Joi.number().min(0).default(0),
      efficiency: Joi.number().min(0).max(1).default(0.35),
    }).optional(),
    hydro: Joi.object({
      capacity: Joi.number().min(0).default(0),
      generation: Joi.number().min(0).default(0),
    }).optional(),
  }).optional(),
}).options({ abortEarly: false });