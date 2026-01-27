import express from 'express';
import { wrapAsync } from '../middlewares/wrapAsync.js';

const router = express.Router();

// Placeholder audit routes - implement when needed
router.get('/health', wrapAsync(async (req, res) => {
  res.json({
    success: true,
    message: "Audit service placeholder - implement when needed",
    timestamp: new Date().toISOString()
  });
}));

export default router;