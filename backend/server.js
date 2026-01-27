import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import webpush from "web-push";

import redis from "./config/redis.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";

//routes
import mlRoutes from "./routes/ml.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
    res.json({ message: "Server is running" });
});

await connectDB();

app.use((err, req, res, next) => {
    const status = typeof err.status === "number" ? err.status : 500;
    const message = err.message || "Internal Server Error";
    if (res.headersSent) return next(err);
    res.status(status).json({ message });
});

//routes
app.use("/api/ml", mlRoutes);

const server = http.createServer(app);

// Initialize Socket.IO
const io = initSocket(server);

// Make io available globally for notification dispatch
app.set('io', io);

// console.log(webpush.generateVAPIDKeys());
if (process.env.PUBLIC_VAPID_KEY && process.env.PRIVATE_VAPID_KEY) {
    webpush.setVapidDetails(
        "mailto:guptakaran.port@gmail.com",
        process.env.PUBLIC_VAPID_KEY,
        process.env.PRIVATE_VAPID_KEY
    );
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
