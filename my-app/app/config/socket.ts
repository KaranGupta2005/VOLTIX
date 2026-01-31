import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
            withCredentials: true,
            transports: ["websocket", "polling"],
            autoConnect: false,
        });
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
};