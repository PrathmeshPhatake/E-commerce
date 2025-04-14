# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY backend/package*.json ./
RUN npm install

# Copy source code
COPY backend/ .

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["node", "src/server.js"]