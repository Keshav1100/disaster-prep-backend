#!/usr/bin/env node

// Simple test to check if the server can start
console.log("🧪 Testing server startup...");

try {
  // Test basic imports
  console.log("✅ Testing imports...");
  
  // Test dotenv
  await import('dotenv');
  console.log("✅ dotenv imported");
  
  // Test express
  await import('express');
  console.log("✅ express imported");
  
  // Test our config
  await import('./src/config/db.js');
  console.log("✅ db config imported");
  
  // Test file db
  await import('./src/config/filedb.js');
  console.log("✅ filedb imported");
  
  // Test routes
  await import('./src/routes/authRoutes.js');
  console.log("✅ auth routes imported");
  
  console.log("🎉 All imports successful! Server should start normally.");
  
  // Now try to start the actual server
  console.log("🚀 Starting actual server...");
  await import('./server.js');
  
} catch (error) {
  console.error("❌ Error during startup test:", error);
  process.exit(1);
}