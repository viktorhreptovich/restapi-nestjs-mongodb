# Use the official Node.js 16 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Build the Nest.js application
RUN npm run build

# Display directory structure
RUN ls -l

# Expose the port your Nest.js application is listening on
EXPOSE 3000

# Command to start your Nest.js application
CMD [ "npm", "run", "start:prod" ]
