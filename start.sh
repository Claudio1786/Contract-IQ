#!/bin/bash

# Start FastAPI backend in background
cd apps/api && python -m uvicorn contract_iq.main:app --host 0.0.0.0 --port $API_PORT &

# Wait a moment for API to start
sleep 5

# Start Next.js frontend
cd apps/web && npm start -- --port $PORT