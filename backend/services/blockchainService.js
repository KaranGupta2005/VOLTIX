import crypto from "crypto";
import blockchainConfig from "../config/blockchain.js";
import DecisionLog from "../models/DecisionLog.js";
import ExpressError from "../middlewares/expressError.js";

class BlockchainService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize blockchain service
  async initialize() {
    try {
      const result = await blockchainConfig.initialize();
      this.isInitialized = result.success;
      
      if (this.isInitialized) {
        console.log('BlockchainService initialized successfully');
      } else {
        console.error('BlockchainService initialization failed:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('BlockchainService initialization error:', error);
      this.isInitialized = false;
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate hash for audit data
  generateAuditHash(data) {
    const auditData = {
      agent: data.agent,
      stationId: data.stationId,
      action: data.action,
      timestamp: data.timestamp,
      context: data.context,
      mlMetrics: data.mlMetrics,
      impact: data.impact
    };
    
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(auditData))
      .digest("hex");
  }

  // Audit decision and write to blockchain
  async auditDecision(decisionData) {
    try {
      console.log(`Auditing decision: ${decisionData.agent} - ${decisionData.action}`);
      
      // Generate audit hash
      const auditHash = this.generateAuditHash(decisionData);
      
      // Prepare blockchain data
      const blockchainData = {
        agent: decisionData.agent,
        stationId: decisionData.stationId,
        action: decisionData.action,
        hash: auditHash
      };
      
      let blockchainResult = null;
      
      // Write to blockchain if connected
      if (this.isInitialized) {
        blockchainResult = await blockchainConfig.writeAuditLog(blockchainData);
        
        if (!blockchainResult.success) {
          console.error('Blockchain write failed, continuing without blockchain:', blockchainResult.error);
        }
      } else {
        console.warn('Blockchain not initialized, skipping blockchain write');
      }
      
      // Always save to database
      const decisionCount = await DecisionLog.countDocuments();
      const decisionId = `DEC_${(decisionCount + 1).toString().padStart(6, '0')}`;
      
      const decisionLog = await DecisionLog.create({
        ...decisionData,
        decisionId,
        auditHash,
        blockchainTx: blockchainResult?.success ? blockchainResult.transactionHash : null,
        blockNumber: blockchainResult?.success ? blockchainResult.blockNumber : null,
        auditedAt: new Date()
      });
      
      console.log(`Decision audited: ${decisionId}`);
      
      return {
        success: true,
        decisionId,
        auditHash,
        blockchainTx: blockchainResult?.transactionHash || null,
        blockNumber: blockchainResult?.blockNumber || null,
        decisionLog
      };
      
    } catch (error) {
      console.error('Decision audit failed:', error);
      throw new ExpressError(500, `Audit failed: ${error.message}`);
    }
  }

  // Verify decision integrity
  async verifyDecision(decisionId) {
    try {
      // Get decision from database
      const decision = await DecisionLog.findOne({ decisionId });
      if (!decision) {
        throw new ExpressError(404, 'Decision not found');
      }
      
      // Regenerate hash from stored data
      const expectedHash = this.generateAuditHash(decision);
      
      // Check database integrity
      const dbIntegrity = decision.auditHash === expectedHash;
      
      let blockchainIntegrity = null;
      let blockchainLog = null;
      
      // Verify blockchain if transaction exists
      if (decision.blockchainTx && this.isInitialized) {
        // Find the log index (this is simplified - in production you'd store the index)
        const totalLogs = await blockchainConfig.getTotalLogs();
        
        if (totalLogs.success) {
          // Search recent logs (in production, store the index with the decision)
          for (let i = Math.max(0, totalLogs.totalLogs - 100); i < totalLogs.totalLogs; i++) {
            const logResult = await blockchainConfig.readAuditLog(i);
            
            if (logResult.success && 
                logResult.log.agent === decision.agent &&
                logResult.log.stationId === decision.stationId &&
                logResult.log.action === decision.action) {
              
              blockchainLog = logResult.log;
              blockchainIntegrity = logResult.log.hash === decision.auditHash;
              break;
            }
          }
        }
      }
      
      return {
        success: true,
        decisionId,
        verification: {
          database: {
            integrity: dbIntegrity,
            storedHash: decision.auditHash,
            computedHash: expectedHash
          },
          blockchain: blockchainLog ? {
            integrity: blockchainIntegrity,
            chainHash: blockchainLog.hash,
            timestamp: blockchainLog.timestamp,
            found: true
          } : {
            found: false,
            reason: decision.blockchainTx ? 'Not found in recent logs' : 'No blockchain transaction'
          }
        },
        overallIntegrity: dbIntegrity && (blockchainIntegrity !== false),
        decision
      };
      
    } catch (error) {
      console.error('Decision verification failed:', error);
      throw new ExpressError(500, `Verification failed: ${error.message}`);
    }
  }

  // Get audit statistics
  async getAuditStats() {
    try {
      const totalDecisions = await DecisionLog.countDocuments();
      const blockchainDecisions = await DecisionLog.countDocuments({ blockchainTx: { $ne: null } });
      const recentDecisions = await DecisionLog.countDocuments({
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      
      let blockchainStats = null;
      if (this.isInitialized) {
        const totalLogs = await blockchainConfig.getTotalLogs();
        const healthCheck = await blockchainConfig.healthCheck();
        
        blockchainStats = {
          totalLogs: totalLogs.success ? totalLogs.totalLogs : 0,
          health: healthCheck
        };
      }
      
      return {
        success: true,
        stats: {
          database: {
            totalDecisions,
            blockchainDecisions,
            recentDecisions,
            blockchainCoverage: totalDecisions > 0 ? 
              ((blockchainDecisions / totalDecisions) * 100).toFixed(2) + '%' : '0%'
          },
          blockchain: blockchainStats
        },
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Audit stats failed:', error);
      throw new ExpressError(500, `Stats failed: ${error.message}`);
    }
  }

  // Search audit logs
  async searchAuditLogs(filters = {}) {
    try {
      const query = {};
      
      if (filters.agent) query.agent = filters.agent;
      if (filters.stationId) query.stationId = filters.stationId;
      if (filters.action) query.action = { $regex: filters.action, $options: 'i' };
      if (filters.startDate) query.timestamp = { $gte: new Date(filters.startDate) };
      if (filters.endDate) {
        query.timestamp = { ...query.timestamp, $lte: new Date(filters.endDate) };
      }
      
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;
      const skip = (page - 1) * limit;
      
      const decisions = await DecisionLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await DecisionLog.countDocuments(query);
      
      return {
        success: true,
        decisions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
      
    } catch (error) {
      console.error('Audit search failed:', error);
      throw new ExpressError(500, `Search failed: ${error.message}`);
    }
  }

  // Health check
  async healthCheck() {
    try {
      const dbHealth = await DecisionLog.countDocuments();
      const blockchainHealth = this.isInitialized ? 
        await blockchainConfig.healthCheck() : 
        { status: 'not_initialized' };
      
      return {
        success: true,
        database: {
          status: 'healthy',
          totalDecisions: dbHealth
        },
        blockchain: blockchainHealth,
        service: {
          initialized: this.isInitialized,
          status: 'healthy'
        },
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Close service
  async close() {
    if (this.isInitialized) {
      await blockchainConfig.close();
      this.isInitialized = false;
    }
    console.log('BlockchainService closed');
  }
}

// Create singleton instance
const blockchainService = new BlockchainService();

export default blockchainService;