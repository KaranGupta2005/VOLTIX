import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import webpush from "web-push";

import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import eventProcessor from "./services/eventProcessor.js";
import blockchainService from "./services/blockchainService.js";
import agentBus from "./eventBus/agentBus.js";

//routes
import mlRoutes from "./routes/ml.js";
import authRoutes from "./routes/auth.js";
import auditRoutes from "./routes/audit.js";
import notificationRoutes from "./routes/notification.js";
import pushRoutes from "./routes/push.js";
import dataRoutes from "./routes/data.js";
import agentRoutes from "./routes/agents.js";
import blockchainRoutes from "./routes/blockchain.js";
import chatRoutes from "./routes/chat.js";
import systemRoutes from "./routes/system.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

await connectDB();

// Initialize Blockchain Service
console.log("Initializing blockchain service...");
const blockchainInit = await blockchainService.initialize();
if (blockchainInit.success) {
  console.log("Blockchain service initialized successfully");
  console.log(`Contract: ${blockchainInit.contractAddress}`);
  console.log(`Wallet: ${blockchainInit.walletAddress}`);
} else {
  console.warn(
    "Blockchain service failed to initialize:",
    blockchainInit.error,
  );
  console.warn(
    "Continuing without blockchain - audit logs will be database-only",
  );
}

app.use((err, req, res, next) => {
  const status = typeof err.status === "number" ? err.status : 500;
  const message = err.message || "Internal Server Error";
  if (res.headersSent) return next(err);
  res.status(status).json({ message });
});

app.use("/api/ml", mlRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/system", systemRoutes);

// 404 handler for API routes
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint ${req.originalUrl} not found`
    });
});

// Error handling middleware (MUST be after routes)
app.use((err, req, res, next) => {
    console.error('❌ Error caught by middleware:', err);
    const status = typeof err.status === "number" ? err.status : 500;
    const message = err.message || "Internal Server Error";
    if (res.headersSent) return next(err);
    res.status(status).json({ 
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const server = http.createServer(app);

// Initialize Socket.IO
const io = initSocket(server);

// Make io available globally for notification dispatch
app.set("io", io);

// Start Event Processor (THE BRAIN)
eventProcessor.start(io);
console.log("Event Processor started - Ready to process live data!");

// Start Agent Bus (AGENT COORDINATION)
await agentBus.start(io);
console.log("Agent Bus started - Ready to coordinate agents!");

// console.log(webpush.generateVAPIDKeys());
if (process.env.PUBLIC_VAPID_KEY && process.env.PRIVATE_VAPID_KEY) {
  webpush.setVapidDetails(
    "mailto:guptakaran.port@gmail.com",
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY,
  );
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
