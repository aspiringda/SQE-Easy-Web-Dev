# Use the official Node.js 16 image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the entrypoint script and make it executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set the entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]

# Expose the port (adjust based on your app's configuration)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
