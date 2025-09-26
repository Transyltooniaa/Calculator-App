# Use small base image
FROM node:lts-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
# --omit=dev makes image smaller by skipping devDependencies
RUN npm ci --omit=dev

# Copy the rest of your source code
COPY src/ ./src/

# Set environment variables
ENV NODE_ENV=production PORT=3000

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
