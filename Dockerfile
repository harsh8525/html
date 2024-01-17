# Use Node.js Alpine base image
FROM node:alpine AS nodebuilder

# Create and set the working directory inside the container for Node.js
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the entire codebase to the working directory
COPY . /app/

# Build your Node.js application (replace "build" with the actual command to build your app)
RUN npm run build

# Use PHP-Apache image
FROM php:7.4-apache

# Set the working directory inside the container for PHP-Apache
WORKDIR /var/www/html

# Copy the built Node.js application into the Apache server's document root
COPY --from=nodebuilder /app/dist /var/www/html/

# Copy Apache configuration files (if needed)
# COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Expose the port your app runs on (replace <PORT_NUMBER> with your app's actual port)
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
