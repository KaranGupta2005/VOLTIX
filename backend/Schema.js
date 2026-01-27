import Joi from "joi";

// station schema
export const createStationSchema = Joi.object({
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
        Joi.number().min(-90).max(90), // latitude
        Joi.number().min(-180).max(180) // longitude
      )
      .length(2)
      .required()
      .messages({
        "array.length": "Coordinates must contain exactly 2 values [latitude, longitude]",
        "any.required": "Coordinates are required",
      }),
  }).required(),
  locationFlags: Joi.object({
    isHighway: Joi.boolean().default(false),
    isMall: Joi.boolean().default(false),
    isOffice: Joi.boolean().default(false),
  }).optional(),
  operator: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min": "Operator name must be at least 2 characters",
      "string.max": "Operator name must be at most 50 characters",
      "any.required": "Operator is required",
    }),
  installationDate: Joi.date()
    .required()
    .messages({
      "any.required": "Installation date is required",
    }),
  status: Joi.string()
    .valid("active", "maintenance", "offline")
    .default("active")
    .messages({
      "any.only": "Status must be active, maintenance, or offline",
    }),
  currentInventory: Joi.number()
    .integer()
    .min(0)
    .max(Joi.ref("maxInventory"))
    .default(0)
    .messages({
      "number.min": "Current inventory cannot be negative",
      "number.max": "Current inventory cannot exceed max inventory",
    }),
  queueLength: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      "number.min": "Queue length cannot be negative",
    }),
  pricePerKwh: Joi.number()
    .min(0)
    .max(50)
    .required()
    .messages({
      "number.min": "Price per kWh cannot be negative",
      "number.max": "Price per kWh cannot exceed ₹50",
      "any.required": "Price per kWh is required",
    }),
  rating: Joi.number()
    .min(1)
    .max(5)
    .default(3)
    .messages({
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must be at most 5",
    }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

export const updateStationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).optional(),
  status: Joi.string().valid("active", "maintenance", "offline").optional(),
  currentInventory: Joi.number().integer().min(0).optional(),
  queueLength: Joi.number().integer().min(0).optional(),
  pricePerKwh: Joi.number().min(0).max(50).optional(),
  rating: Joi.number().min(1).max(5).optional(),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

// signal log schema
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
  }).required(),
  status: Joi.string()
    .valid("normal", "warning", "critical", "offline")
    .required()
    .messages({
      "any.only": "Status must be normal, warning, critical, or offline",
      "any.required": "Status is required",
    }),
  mlPredictions: Joi.object({
    failureProbability: Joi.number()
      .min(0)
      .max(1)
      .optional()
      .messages({
        "number.min": "Failure probability must be at least 0",
        "number.max": "Failure probability must be at most 1",
      }),
    anomalyScore: Joi.number()
      .min(0)
      .max(1)
      .optional()
      .messages({
        "number.min": "Anomaly score must be at least 0",
        "number.max": "Anomaly score must be at most 1",
      }),
    riskLevel: Joi.string()
      .valid("low", "medium", "high", "critical")
      .optional()
      .messages({
        "any.only": "Risk level must be low, medium, high, or critical",
      }),
  }).optional(),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

// decision log schema
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
    .valid("routine_monitoring", "threshold_breach", "user_request", "system_alert", "external_event")
    .required()
    .messages({
      "any.only": "Trigger event must be one of routine_monitoring, threshold_breach, user_request, system_alert, or external_event",
      "any.required": "Trigger event is required",
    }),
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
  }).required(),
  humanOverride: Joi.boolean()
    .default(false)
    .messages({
      "boolean.base": "Human override must be a boolean",
    }),
  approvedBySupervisor: Joi.boolean()
    .default(true)
    .messages({
      "boolean.base": "Approved by supervisor must be a boolean",
    }),
  auditResults: Joi.object({
    anomalyDetected: Joi.boolean()
      .default(false)
      .messages({
        "boolean.base": "Anomaly detected must be a boolean",
      }),
    complianceViolation: Joi.boolean()
      .default(false)
      .messages({
        "boolean.base": "Compliance violation must be a boolean",
      }),
    auditScore: Joi.number()
      .min(0)
      .max(1)
      .optional()
      .messages({
        "number.min": "Audit score must be at least 0",
        "number.max": "Audit score must be at most 1",
      }),
  }).optional(),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

// energy market schema
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
    peakDemand: Joi.number()
      .min(0)
      .default(0)
      .messages({
        "number.min": "Peak demand cannot be negative",
      }),
    baseLoad: Joi.number()
      .min(0)
      .default(0)
      .messages({
        "number.min": "Base load cannot be negative",
      }),
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
    humidity: Joi.number()
      .min(0)
      .max(100)
      .default(50)
      .messages({
        "number.min": "Humidity cannot be negative",
        "number.max": "Humidity must be at most 100%",
      }),
    weatherCondition: Joi.string()
      .valid("sunny", "cloudy", "rainy", "stormy", "foggy", "snowy")
      .default("sunny")
      .messages({
        "any.only": "Weather condition must be sunny, cloudy, rainy, stormy, foggy, or snowy",
      }),
    airQuality: Joi.number()
      .min(0)
      .max(500)
      .default(50)
      .messages({
        "number.min": "Air quality cannot be negative",
        "number.max": "Air quality must be at most 500",
      }),
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
    transmissionCost: Joi.number()
      .min(0)
      .default(0.5)
      .messages({
        "number.min": "Transmission cost cannot be negative",
      }),
    distributionCost: Joi.number()
      .min(0)
      .default(1.0)
      .messages({
        "number.min": "Distribution cost cannot be negative",
      }),
    regulatoryCharges: Joi.number()
      .min(0)
      .default(0.2)
      .messages({
        "number.min": "Regulatory charges cannot be negative",
      }),
  }).required(),
  mlPredictions: Joi.object({
    predictedPrice: Joi.number()
      .min(0)
      .optional()
      .messages({
        "number.min": "Predicted price cannot be negative",
      }),
    priceCategory: Joi.string()
      .valid("low", "medium", "high", "very_high")
      .optional()
      .messages({
        "any.only": "Price category must be low, medium, high, or very_high",
      }),
    confidence: Joi.number()
      .min(0)
      .max(1)
      .optional()
      .messages({
        "number.min": "Confidence must be at least 0",
        "number.max": "Confidence must be at most 1",
      }),
    priceDirection: Joi.string()
      .valid("up", "down", "stable")
      .optional()
      .messages({
        "any.only": "Price direction must be up, down, or stable",
      }),
    volatilityForecast: Joi.number()
      .min(0)
      .max(100)
      .optional()
      .messages({
        "number.min": "Volatility forecast cannot be negative",
        "number.max": "Volatility forecast must be at most 100",
      }),
  }).optional(),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

// user schema
export const createUserSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^USR_\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "User ID must follow format USR_000001",
      "any.required": "User ID is required",
    }),
  profile: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name must be at most 100 characters",
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
    phone: Joi.string()
      .pattern(/^\+91[6-9]\d{9}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be a valid Indian mobile number (+91XXXXXXXXXX)",
        "any.required": "Phone number is required",
      }),
  }).required(),
  location: Joi.object({
    city: Joi.string()
      .valid("Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata")
      .required()
      .messages({
        "any.only": "City must be one of Mumbai, Delhi, Bangalore, Chennai, or Kolkata",
        "any.required": "City is required",
      }),
    preferredStations: Joi.array()
      .items(
        Joi.string().pattern(/^ST\d{3}$/).messages({
          "string.pattern.base": "Station ID must follow format ST001-ST999",
        })
      )
      .optional(),
  }).required(),
  vehicle: Joi.object({
    type: Joi.string()
      .valid("sedan", "suv", "hatchback", "commercial")
      .required()
      .messages({
        "any.only": "Vehicle type must be sedan, suv, hatchback, or commercial",
        "any.required": "Vehicle type is required",
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
    chargingSpeed: Joi.string()
      .valid("standard", "fast", "ultra")
      .default("standard")
      .messages({
        "any.only": "Charging speed must be standard, fast, or ultra",
      }),
  }).required(),
  subscription: Joi.object({
    plan: Joi.string()
      .valid("basic", "premium", "enterprise")
      .required()
      .messages({
        "any.only": "Subscription plan must be basic, premium, or enterprise",
        "any.required": "Subscription plan is required",
      }),
    startDate: Joi.date()
      .required()
      .messages({
        "any.required": "Subscription start date is required",
      }),
    endDate: Joi.date()
      .greater(Joi.ref("startDate"))
      .required()
      .messages({
        "date.greater": "End date must be after start date",
        "any.required": "Subscription end date is required",
      }),
    isActive: Joi.boolean()
      .default(true)
      .messages({
        "boolean.base": "Is active must be a boolean",
      }),
  }).required(),
  usage: Joi.object({
    totalSessions: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        "number.min": "Total sessions cannot be negative",
      }),
    avgSessionDuration: Joi.number()
      .min(0)
      .default(0)
      .messages({
        "number.min": "Average session duration cannot be negative",
      }),
    totalEnergyConsumed: Joi.number()
      .min(0)
      .default(0)
      .messages({
        "number.min": "Total energy consumed cannot be negative",
      }),
    totalAmountSpent: Joi.number()
      .min(0)
      .default(0)
      .messages({
        "number.min": "Total amount spent cannot be negative",
      }),
  }).optional(),
  preferences: Joi.object({
    maxDistance: Joi.number()
      .min(1)
      .max(50)
      .default(10)
      .messages({
        "number.min": "Max distance must be at least 1 km",
        "number.max": "Max distance must be at most 50 km",
      }),
    pricePreference: Joi.string()
      .valid("lowest", "balanced", "premium")
      .default("balanced")
      .messages({
        "any.only": "Price preference must be lowest, balanced, or premium",
      }),
    notificationsEnabled: Joi.boolean()
      .default(true)
      .messages({
        "boolean.base": "Notifications enabled must be a boolean",
      }),
  }).optional(),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

export const updateUserSchema = Joi.object({
  profile: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    phone: Joi.string().pattern(/^\+91[6-9]\d{9}$/).optional(),
  }).optional(),
  location: Joi.object({
    city: Joi.string().valid("Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata").optional(),
    preferredStations: Joi.array().items(Joi.string().pattern(/^ST\d{3}$/)).optional(),
  }).optional(),
  vehicle: Joi.object({
    type: Joi.string().valid("sedan", "suv", "hatchback", "commercial").optional(),
    batteryCapacity: Joi.number().min(10).max(200).optional(),
    chargingSpeed: Joi.string().valid("standard", "fast", "ultra").optional(),
  }).optional(),
  preferences: Joi.object({
    maxDistance: Joi.number().min(1).max(50).optional(),
    pricePreference: Joi.string().valid("lowest", "balanced", "premium").optional(),
    notificationsEnabled: Joi.boolean().optional(),
  }).optional(),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

// ml prediction schema
export const mlPredictionRequestSchema = Joi.object({
  sensorData: Joi.object({
    temperature: Joi.number().min(-50).max(150).required(),
    voltage: Joi.number().min(0).max(500).required(),
    current: Joi.number().min(0).max(200).required(),
    vibration: Joi.number().min(0).max(5.0).required(),
    humidity: Joi.number().min(0).max(100).required(),
    uptime: Joi.number().min(0).max(100).required(),
    errorRate: Joi.number().min(0).required(),
  }).optional(),
  stationData: Joi.object({
    weather: Joi.string().valid("sunny", "rainy", "cloudy", "stormy").optional(),
    temperature: Joi.number().min(-10).max(50).optional(),
    stationCapacity: Joi.number().integer().min(1).max(20).optional(),
    stationType: Joi.string().valid("standard", "fast", "ultra").optional(),
    isHighway: Joi.number().valid(0, 1).optional(),
    isMall: Joi.number().valid(0, 1).optional(),
    isOffice: Joi.number().valid(0, 1).optional(),
    isHoliday: Joi.number().valid(0, 1).optional(),
    nearbyEvent: Joi.number().valid(0, 1).optional(),
  }).optional(),
  marketData: Joi.object({
    gridDemand: Joi.number().min(0).max(10000).optional(),
    gridSupply: Joi.number().min(0).max(12000).optional(),
    gridFrequency: Joi.number().min(45).max(55).optional(),
    temperature: Joi.number().min(-50).max(60).optional(),
    solarIrradiance: Joi.number().min(0).max(1500).optional(),
    windSpeed: Joi.number().min(0).max(50).optional(),
    coalPrice: Joi.number().min(0).max(10000).optional(),
    gasPrice: Joi.number().min(0).max(100).optional(),
    carbonPrice: Joi.number().min(0).max(5000).optional(),
  }).optional(),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

// route optimization schema
export const routeRequestSchema = Joi.object({
  startCoords: Joi.array()
    .items(
      Joi.number().min(-90).max(90), // latitude
      Joi.number().min(-180).max(180) // longitude
    )
    .length(2)
    .required()
    .messages({
      "array.length": "Start coordinates must contain exactly 2 values [latitude, longitude]",
      "any.required": "Start coordinates are required",
    }),
  endCoords: Joi.array()
    .items(
      Joi.number().min(-90).max(90), // latitude
      Joi.number().min(-180).max(180) // longitude
    )
    .length(2)
    .required()
    .messages({
      "array.length": "End coordinates must contain exactly 2 values [latitude, longitude]",
      "any.required": "End coordinates are required",
    }),
  profile: Joi.string()
    .valid("driving", "walking", "cycling")
    .default("driving")
    .messages({
      "any.only": "Profile must be driving, walking, or cycling",
    }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

export const stationOptimizationRequestSchema = Joi.object({
  userLocation: Joi.array()
    .items(
      Joi.number().min(-90).max(90), // latitude
      Joi.number().min(-180).max(180) // longitude
    )
    .length(2)
    .required()
    .messages({
      "array.length": "User location must contain exactly 2 values [latitude, longitude]",
      "any.required": "User location is required",
    }),
  stations: Joi.array()
    .items(
      Joi.object({
        stationId: Joi.string().pattern(/^ST\d{3}$/).required(),
        name: Joi.string().required(),
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required(),
        queueLength: Joi.number().integer().min(0).required(),
        pricePerKwh: Joi.number().min(0).required(),
        rating: Joi.number().min(1).max(5).required(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one station must be provided",
      "any.required": "Stations array is required",
    }),
  preferences: Joi.object({
    distanceWeight: Joi.number().min(0).max(1).default(0.4),
    queueWeight: Joi.number().min(0).max(1).default(0.3),
    priceWeight: Joi.number().min(0).max(1).default(0.2),
    ratingWeight: Joi.number().min(0).max(1).default(0.1),
  }).optional(),
}).options({
  abortEarly: false,
  allowUnknown: false,
});