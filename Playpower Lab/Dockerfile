# Use a Node.js image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Set environment variables (use .env for your secrets)
ENV PORT=6000

# Expose the application port
EXPOSE 6000

# Start the application
CMD ["npm", "start"]
