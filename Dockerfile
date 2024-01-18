# Use Ubuntu as the base image
FROM ubuntu:latest

# Update the package list and install Apache
RUN apt-get update && \
    apt-get install -y apache2

COPY ./ /var/www/html

# Expose port 80 for web traffic
EXPOSE 3000

RUN service apache2 restart

# Start Apache in the foreground
CMD ["apache2", "-D", "FOREGROUND"]

