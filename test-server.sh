#!/bin/bash

echo "🧪 Testing Backend Server"
echo "========================"

# Test health check
echo "Testing health check..."
RESPONSE=$(curl -s http://localhost:5002/ || echo "ERROR")

if [[ "$RESPONSE" == *"Disaster Preparedness API"* ]]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed: $RESPONSE"
fi

echo "Server test completed!"