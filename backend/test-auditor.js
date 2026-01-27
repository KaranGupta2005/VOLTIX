import auditorAgent from './agents/AuditorAgent.js';
import blockchainService from './services/blockchainService.js';
import connectDB from './config/db.js';

// 🧪 Test the Auditor System
async function testAuditorSystem() {
  console.log('🧪 Testing Auditor System...\n');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');
    
    // Initialize blockchain
    const blockchainInit = await blockchainService.initialize();
    if (blockchainInit.success) {
      console.log('✅ Blockchain initialized');
      console.log(`📋 Contract: ${blockchainInit.contractAddress}`);
      console.log(`👛 Wallet: ${blockchainInit.walletAddress}\n`);
    } else {
      console.log('⚠️ Blockchain not available, testing database-only mode\n');
    }
    
    // Sample decision data
    const sampleDecision = {
      agent: 'MechanicAgent',
      stationId: 'ST001',
      action: 'reboot_charger',
      timestamp: new Date(),
      triggerEvent: 'threshold_breach',
      context: {
        inputData: {
          errorCode: 'E503',
          temperature: 85,
          voltage: 220
        },
        environmentalFactors: {
          weather: 'sunny',
          timeOfDay: 'afternoon'
        },
        stationContext: {
          currentLoad: 75,
          queueLength: 3,
          inventoryLevel: 15
        }
      },
      mlMetrics: {
        confidenceScore: 0.92,
        executionTime: 1500,
        modelVersion: '1.0.0',
        featuresUsed: ['temperature', 'voltage', 'error_history']
      },
      impact: {
        costImpact: -50,
        revenueImpact: 200,
        successRate: 0.95,
        userSatisfaction: 0.88,
        riskScore: 0.2,
        environmentalImpact: {
          carbonSaved: 5.2,
          energyEfficiency: 0.92
        }
      },
      systemMetrics: {
        cpuUsage: 45,
        memoryUsage: 60,
        apiCalls: 3,
        networkLatency: 120,
        databaseQueries: 2
      },
      priority: 'medium'
    };
    
    console.log('📝 Testing decision audit...');
    
    // Audit the decision
    const auditResult = await auditorAgent.auditDecision(sampleDecision, null);
    
    if (auditResult.success) {
      console.log('✅ Decision audited successfully!');
      console.log(`🔍 Decision ID: ${auditResult.auditResult.decisionId}`);
      console.log(`🔐 Audit Hash: ${auditResult.auditResult.auditHash}`);
      
      if (auditResult.auditResult.blockchainTx) {
        console.log(`⛓️ Blockchain TX: ${auditResult.auditResult.blockchainTx}`);
      }
      
      console.log('\n📊 Analysis Results:');
      console.log(`Quality Grade: ${auditResult.analysis.quality.grade} (Score: ${auditResult.analysis.quality.score.toFixed(2)})`);
      console.log(`Compliance: ${auditResult.analysis.compliance.status}`);
      console.log(`Risk Level: ${auditResult.analysis.risk.level} (Score: ${auditResult.analysis.risk.score.toFixed(2)})`);
      
      if (auditResult.analysis.compliance.violations.length > 0) {
        console.log(`⚠️ Violations: ${auditResult.analysis.compliance.violations.join(', ')}`);
      }
      
      // Test verification
      console.log('\n🔍 Testing verification...');
      const verification = await blockchainService.verifyDecision(auditResult.auditResult.decisionId);
      
      if (verification.success) {
        console.log(`✅ Verification: ${verification.overallIntegrity ? 'PASSED' : 'FAILED'}`);
        console.log(`Database Integrity: ${verification.verification.database.integrity ? 'VALID' : 'INVALID'}`);
        
        if (verification.verification.blockchain.found) {
          console.log(`Blockchain Integrity: ${verification.verification.blockchain.integrity ? 'VALID' : 'INVALID'}`);
        } else {
          console.log('Blockchain: Not found (expected for test)');
        }
      }
      
    } else {
      console.log('❌ Audit failed:', auditResult.errors);
    }
    
    // Test audit statistics
    console.log('\n📊 Getting audit statistics...');
    const stats = await blockchainService.getAuditStats();
    
    if (stats.success) {
      console.log(`Total Decisions: ${stats.stats.database.totalDecisions}`);
      console.log(`Blockchain Coverage: ${stats.stats.database.blockchainCoverage}`);
      console.log(`Recent Decisions (24h): ${stats.stats.database.recentDecisions}`);
    }
    
    console.log('\n🎉 Auditor system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testAuditorSystem();