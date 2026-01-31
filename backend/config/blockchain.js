import { ethers } from "ethers";
import fs from "fs";
import path from "path";

class BlockchainConfig {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.auditContract = null;
    this.isConnected = false;
    
    // Contract configuration
    this.AUDIT_CONTRACT_ADDRESS = process.env.AUDIT_CONTRACT_ADDRESS || "0xcd3b766ccdd6ae721141f452c550ca635964ce71";
    this.PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0";
    this.RPC_URL = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
    
    // ABI for AuditLog contract
    this.AUDIT_ABI = [
      {
        "inputs": [
          { "internalType": "string", "name": "agent", "type": "string" },
          { "internalType": "string", "name": "stationId", "type": "string" },
          { "internalType": "string", "name": "action", "type": "string" },
          { "internalType": "string", "name": "hash", "type": "string" }
        ],
        "name": "addLog",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }],
        "name": "getLog",
        "outputs": [
          {
            "components": [
              { "internalType": "string", "name": "agent", "type": "string" },
              { "internalType": "string", "name": "stationId", "type": "string" },
              { "internalType": "string", "name": "action", "type": "string" },
              { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
              { "internalType": "string", "name": "hash", "type": "string" }
            ],
            "internalType": "struct AuditLog.LogEntry",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalLogs",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          { "indexed": false, "internalType": "string", "name": "agent", "type": "string" },
          { "indexed": false, "internalType": "string", "name": "stationId", "type": "string" },
          { "indexed": false, "internalType": "string", "name": "action", "type": "string" },
          { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "indexed": false, "internalType": "string", "name": "hash", "type": "string" }
        ],
        "name": "LogAdded",
        "type": "event"
      }
    ];
  }

  async initialize() {
    try {
      console.log('🔗 Initializing blockchain connection...');
      
      // Create provider
      this.provider = new ethers.JsonRpcProvider(this.RPC_URL);
      
      // Test connection
      const network = await this.provider.getNetwork();
      console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
      
      // Create wallet
      this.wallet = new ethers.Wallet(this.PRIVATE_KEY, this.provider);
      console.log(`Wallet address: ${this.wallet.address}`);
      
      // Get wallet balance
      const balance = await this.provider.getBalance(this.wallet.address);
      console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);
      
      // Initialize audit contract
      this.auditContract = new ethers.Contract(
        this.AUDIT_CONTRACT_ADDRESS,
        this.AUDIT_ABI,
        this.wallet
      );
      
      // Test contract connection
      const totalLogs = await this.auditContract.totalLogs();
      console.log(`Total audit logs on chain: ${totalLogs}`);
      
      this.isConnected = true;
      console.log('Blockchain connection initialized successfully');
      
      return {
        success: true,
        network: network.name,
        chainId: network.chainId.toString(),
        walletAddress: this.wallet.address,
        balance: ethers.formatEther(balance),
        contractAddress: this.AUDIT_CONTRACT_ADDRESS,
        totalLogs: totalLogs.toString()
      };
      
    } catch (error) {
      console.error('❌ Blockchain initialization failed:', error);
      this.isConnected = false;
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Write audit log to blockchain
  async writeAuditLog({ agent, stationId, action, hash }) {
    try {
      if (!this.isConnected) {
        throw new Error('Blockchain not connected');
      }

      console.log(`Writing audit log to blockchain: ${agent} - ${action}`);
      
      // Estimate gas
      const gasEstimate = await this.auditContract.addLog.estimateGas(
        agent, stationId, action, hash
      );
      
      // Send transaction
      const tx = await this.auditContract.addLog(
        agent,
        stationId,
        action,
        hash,
        {
          gasLimit: gasEstimate * 120n / 100n // Add 20% buffer
        }
      );
      
      console.log(`Transaction sent: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
      
    } catch (error) {
      console.error('Blockchain write failed:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Read audit log from blockchain
  async readAuditLog(index) {
    try {
      if (!this.isConnected) {
        throw new Error('Blockchain not connected');
      }

      const log = await this.auditContract.getLog(index);
      
      return {
        success: true,
        log: {
          agent: log.agent,
          stationId: log.stationId,
          action: log.action,
          timestamp: Number(log.timestamp),
          hash: log.hash
        }
      };
      
    } catch (error) {
      console.error('❌ Blockchain read failed:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get total logs count
  async getTotalLogs() {
    try {
      if (!this.isConnected) {
        throw new Error('Blockchain not connected');
      }

      const total = await this.auditContract.totalLogs();
      return {
        success: true,
        totalLogs: Number(total)
      };
      
    } catch (error) {
      console.error('❌ Get total logs failed:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify audit log integrity
  async verifyAuditLog(index, expectedHash) {
    try {
      const result = await this.readAuditLog(index);
      
      if (!result.success) {
        return result;
      }
      
      const isValid = result.log.hash === expectedHash;
      
      return {
        success: true,
        isValid,
        chainHash: result.log.hash,
        expectedHash,
        log: result.log
      };
      
    } catch (error) {
      console.error('❌ Audit verification failed:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Health check
  async healthCheck() {
    try {
      if (!this.isConnected) {
        return {
          status: 'disconnected',
          error: 'Blockchain not initialized'
        };
      }

      // Check provider connection
      const blockNumber = await this.provider.getBlockNumber();
      
      // Check wallet balance
      const balance = await this.provider.getBalance(this.wallet.address);
      
      // Check contract
      const totalLogs = await this.auditContract.totalLogs();
      
      return {
        status: 'healthy',
        blockNumber,
        walletBalance: ethers.formatEther(balance),
        totalLogs: Number(totalLogs),
        contractAddress: this.AUDIT_CONTRACT_ADDRESS,
        walletAddress: this.wallet.address
      };
      
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // 🔌 Close connection
  async close() {
    if (this.provider) {
      await this.provider.destroy();
    }
    this.isConnected = false;
    console.log('Blockchain connection closed');
  }
}

// Create singleton instance
const blockchainConfig = new BlockchainConfig();

export default blockchainConfig;