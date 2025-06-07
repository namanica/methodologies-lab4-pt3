# Use a lightweight Node.js image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install build tools if needed (optional, для деяких нативних модулів)
# RUN apk add --no-cache python3 g++ make

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies (using npm ci for clean install)
RUN npm ci

# Copy app source code
COPY . .

# Expose application port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
