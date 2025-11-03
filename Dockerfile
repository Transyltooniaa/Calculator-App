# Use small base image
# lts : long-term support version (recommended for production)
# alpine : smaller and faster version of the linux distribution
FROM node:lts-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
# --omit=dev makes image smaller by skipping devDependencies
RUN npm ci --omit=dev

# Copy the rest of your source code
# src/ : source code directory(your local source code) to ./src/ (inside container)
COPY src/ ./src/

# Set environment variables
# NODE_ENV=production : production environment
ENV NODE_ENV=production PORT=3000

# Expose the app port
# 3000 : app port (this is the local port inside the container)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
