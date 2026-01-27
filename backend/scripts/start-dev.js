#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting EV Copilot Development Environment...\n');

// Check if ML service is running
async function checkMLService() {
  try {
    const response = await fetch('http://localhost:8000/health');
    if (response.ok) {
      console.log('✅ ML Service is running on http://localhost:8000');
      return true;
    }
  } catch (error) {
    console.log('❌ ML Service not running on http://localhost:8000');
    console.log('   Please start the ML service first:');
    console.log('   cd ml && python main.py\n');
    return false;
  }
}

// Start the backend server
function startBackend() {
  console.log('🔧 Starting Backend Server...');
  
  const backend = spawn('node', ['server.js'], {
    cwd: join(__dirname, '..'),
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PORT: '5000',
      ML_SERVICE_URL: 'http://localhost:8000'
    }
  });

  backend.on('error', (error) => {
    console.error('❌ Backend server error:', error);
  });

  backend.on('close', (code) => {
    console.log(`Backend server exited with code ${code}`);
  });

  return backend;
}

// Main startup function
async function main() {
  console.log('🔍 Checking ML Service availability...');
  
  const mlServiceRunning = await checkMLService();
  
  if (!mlServiceRunning) {
    console.log('⚠️  Warning: ML Service is not running. Some features may not work.');
    console.log('   The backend will still start, but ML endpoints will return errors.\n');
  }
  
  console.log('🚀 Starting Backend Server...\n');
  
  const backend = startBackend();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development environment...');
    backend.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down development environment...');
    backend.kill('SIGTERM');
    process.exit(0);
  });
}

main().catch(console.error);