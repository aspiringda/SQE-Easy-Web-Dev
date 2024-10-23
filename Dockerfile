# Start with a base image (use one that suits your application, e.g., Node.js if you're using Node)
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json if applicable (for Node.js projects)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy your application code into the container
COPY . .

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Expose the port your app runs on (if applicable)
EXPOSE 3000

# Start your application
CMD ["npm", "start"]
