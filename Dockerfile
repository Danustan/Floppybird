# Multi-stage build for Green Justice application
# Stage 1: Build frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend and serve both
FROM node:18-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm ci --production

# Copy built frontend
COPY --from=frontend-build /app/frontend/build ./public

# Copy backend application
COPY backend/ ./

# Expose port (Railway uses PORT env var, fallback to 5000)
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
