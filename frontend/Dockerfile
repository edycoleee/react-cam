# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies and vite for preview
RUN npm install

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/vite.config.js ./vite.config.js

# Expose port
EXPOSE 4173

# Run the app in preview mode
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
