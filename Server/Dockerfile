# Use the official Ubuntu base image
FROM ubuntu:20.04

# # Set environment variables to ensure non-interactive installation (to avoid prompting during package installation)
# ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install Node.js, Python 3, and other build dependencies
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    build-essential \
    make \
    g++ \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (LTS version, adjust version as needed)
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# Verify the installation of Node.js and Python
RUN node -v && npm -v && python3 --version

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app will run on (adjust based on your app)
EXPOSE 3000

# Command to run your app (adjust based on your app)
CMD ["node", "index.js"]
