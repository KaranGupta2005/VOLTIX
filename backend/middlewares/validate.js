import {
    userSignUpSchema,
    userLoginSchema,
    createStationStateSchema,
    updateStationStateSchema,
    createSignalLogSchema,
    createDecisionLogSchema,
    createEnergyMarketSchema,
    createSubSchema,
    sendNotificationSchema,
    agentNotificationSchema,
} from "../Schema.js";
import Joi from "joi";
import ExpressError from "./expressError.js";

// user validations
export const validateUserSignUp = (req, res, next) => {
    const { error } = userSignUpSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    next();
};

export const validateUserLogin = (req, res, next) => {
    const { error } = userLoginSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    next();
};

//station validations
export const validateCreateStationState = (req, res, next) => {
    const { error } = createStationStateSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    next();
};

export const validateUpdateStationState = (req, res, next) => {
    const { error } = updateStationStateSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    next();
};

// signal log validations
export const validateCreateSignalLog = (req, res, next) => {
    const { error } = createSignalLogSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    next();
};

export const validateSignalLogBatch = (req, res, next) => {
    if (!Array.isArray(req.body)) {
        throw new ExpressError(400, "Request body must be an array of signal logs");
    }

    const errors = [];
    req.body.forEach((signalLog, index) => {
        const { error } = createSignalLogSchema.validate(signalLog, {
            abortEarly: false,
        });
        if (error) {
            errors.push(`Signal ${index + 1}: ${error.details.map((err) => err.message).join(", ")}`);
        }
    });

    if (errors.length > 0) {
        throw new ExpressError(400, errors.join("; "));
    }
    next();
};

// decision log validations
export const validateCreateDecisionLog = (req, res, next) => {
    const { error } = createDecisionLogSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    next();
};

export const validateDecisionLogBatch = (req, res, next) => {
    if (!Array.isArray(req.body)) {
        throw new ExpressError(400, "Request body must be an array of decision logs");
    }

    const errors = [];
    req.body.forEach((decisionLog, index) => {
        const { error } = createDecisionLogSchema.validate(decisionLog, {
            abortEarly: false,
        });
        if (error) {
            errors.push(`Decision ${index + 1}: ${error.details.map((err) => err.message).join(", ")}`);
        }
    });

    if (errors.length > 0) {
        throw new ExpressError(400, errors.join("; "));
    }
    next();
};

// energy market validations
export const validateCreateEnergyMarket = (req, res, next) => {
    const { error } = createEnergyMarketSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    next();
};

export const validateEnergyMarketBatch = (req, res, next) => {
    if (!Array.isArray(req.body)) {
        throw new ExpressError(400, "Request body must be an array of energy market records");
    }

    const errors = [];
    req.body.forEach((marketRecord, index) => {
        const { error } = createEnergyMarketSchema.validate(marketRecord, {
            abortEarly: false,
        });
        if (error) {
            errors.push(`Market Record ${index + 1}: ${error.details.map((err) => err.message).join(", ")}`);
        }
    });

    if (errors.length > 0) {
        throw new ExpressError(400, errors.join("; "));
    }
    next();
};

// ml prediction validations    
export const validateMLPredictionRequest = (req, res, next) => {
    const requiredFields = ['stationId'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        throw new ExpressError(
            400,
            "Missing required fields: " + missingFields.join(", ")
        );
    }

    // Validate stationId format
    if (req.body.stationId && !/^ST\d{3}$/.test(req.body.stationId)) {
        throw new ExpressError(400, "Station ID must follow format ST001-ST999");
    }

    next();
};

// route optimization validations
export const validateRouteRequest = (req, res, next) => {
    const { startCoords, endCoords, profile } = req.body;

    // Validate coordinates
    if (!Array.isArray(startCoords) || startCoords.length !== 2) {
        throw new ExpressError(400, "Start coordinates must be an array of [latitude, longitude]");
    }

    if (!Array.isArray(endCoords) || endCoords.length !== 2) {
        throw new ExpressError(400, "End coordinates must be an array of [latitude, longitude]");
    }

    // Validate coordinate ranges
    const [startLat, startLng] = startCoords;
    const [endLat, endLng] = endCoords;

    if (startLat < -90 || startLat > 90 || endLat < -90 || endLat > 90) {
        throw new ExpressError(400, "Latitude must be between -90 and 90");
    }

    if (startLng < -180 || startLng > 180 || endLng < -180 || endLng > 180) {
        throw new ExpressError(400, "Longitude must be between -180 and 180");
    }

    // Validate profile
    if (profile && !['driving', 'walking', 'cycling'].includes(profile)) {
        throw new ExpressError(400, "Profile must be driving, walking, or cycling");
    }

    next();
};

export const validateStationOptimizationRequest = (req, res, next) => {
    const { userLocation, stations } = req.body;

    // Validate user location
    if (!Array.isArray(userLocation) || userLocation.length !== 2) {
        throw new ExpressError(400, "User location must be an array of [latitude, longitude]");
    }

    const [lat, lng] = userLocation;
    if (lat < -90 || lat > 90) {
        throw new ExpressError(400, "Latitude must be between -90 and 90");
    }

    if (lng < -180 || lng > 180) {
        throw new ExpressError(400, "Longitude must be between -180 and 180");
    }

    // Validate stations array
    if (!Array.isArray(stations) || stations.length === 0) {
        throw new ExpressError(400, "Stations must be a non-empty array");
    }

    // Validate each station
    const requiredStationFields = ['stationId', 'name', 'latitude', 'longitude', 'queueLength', 'pricePerKwh', 'rating'];
    stations.forEach((station, index) => {
        const missingFields = requiredStationFields.filter(field => station[field] === undefined);
        if (missingFields.length > 0) {
            throw new ExpressError(400, `Station ${index + 1} missing fields: ${missingFields.join(", ")}`);
        }

        if (!/^ST\d{3}$/.test(station.stationId)) {
            throw new ExpressError(400, `Station ${index + 1} ID must follow format ST001-ST999`);
        }
    });

    next();
};

// station ID validation
export const validateStationId = (req, res, next) => {
    const { stationId } = req.params;

    if (!stationId || !/^ST\d{3}$/.test(stationId)) {
        throw new ExpressError(400, "Station ID must follow format ST001-ST999");
    }

    next();
};

// user ID validation
export const validateUserId = (req, res, next) => {
    const { userId } = req.params;

    if (!userId || !/^USR_\d{6}$/.test(userId)) {
        throw new ExpressError(400, "User ID must follow format USR_000001");
    }

    next();
};

// date range validation
export const validateDateRange = (req, res, next) => {
    const { startDate, endDate } = req.query;

    if (startDate && isNaN(Date.parse(startDate))) {
        throw new ExpressError(400, "Start date must be a valid date");
    }

    if (endDate && isNaN(Date.parse(endDate))) {
        throw new ExpressError(400, "End date must be a valid date");
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        throw new ExpressError(400, "Start date must be before end date");
    }

    next();
};

// pagination validation
export const validatePagination = (req, res, next) => {
    const { page, limit } = req.query;

    if (page && (isNaN(page) || parseInt(page) < 1)) {
        throw new ExpressError(400, "Page must be a positive integer");
    }

    if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
        throw new ExpressError(400, "Limit must be a positive integer between 1 and 100");
    }

    next();
};
// push subscription validations
export const validateCreateSub = (req, res, next) => {
    const { error } = createSubSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    next();
};

// push notification validations
export const validateSendNotification = (req, res, next) => {
    const { error } = sendNotificationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    next();
};

// agent notification validations
export const validateAgentNotification = (req, res, next) => {
    const { error } = agentNotificationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    next();
};

// socket event validations
export const validateSocketSubscription = (data) => {
    const schema = Joi.object({
        agentType: Joi.string()
            .valid("mechanic", "traffic", "logistics", "energy", "auditor")
            .optional(),
        stationId: Joi.string()
            .pattern(/^ST\d{3}$/)
            .optional(),
        eventType: Joi.string().optional(),
        userId: Joi.string()
            .pattern(/^USR_\d{6}$/)
            .optional(),
    });

    const { error } = schema.validate(data);
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    return true;
};

// location update validation
export const validateLocationUpdate = (data) => {
    const schema = Joi.object({
        lat: Joi.number()
            .min(-90)
            .max(90)
            .required()
            .messages({
                "number.min": "Latitude must be between -90 and 90",
                "number.max": "Latitude must be between -90 and 90",
                "any.required": "Latitude is required",
            }),
        lng: Joi.number()
            .min(-180)
            .max(180)
            .required()
            .messages({
                "number.min": "Longitude must be between -180 and 180",
                "number.max": "Longitude must be between -180 and 180",
                "any.required": "Longitude is required",
            }),
        radius: Joi.number()
            .min(1)
            .max(50)
            .default(10)
            .messages({
                "number.min": "Radius must be at least 1 km",
                "number.max": "Radius must be at most 50 km",
            }),
    });

    const { error } = schema.validate(data);
    if (error) {
        throw new ExpressError(
            400,
            error.details.map((err) => err.message).join(", ")
        );
    }
    return true;
};