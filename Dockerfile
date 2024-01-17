# Use PHP Apache base image
FROM php:7.4-apache

# Copy the HTML code to the Apache document root
COPY . /var/www/html

# Update Apache configuration to listen on port 8081
RUN sed -i 's/Listen 80/Listen 8081/' /etc/apache2/ports.conf \
    && sed -i 's/<VirtualHost \*:80>/<VirtualHost \*:8081>/' /etc/apache2/sites-available/000-default.conf \
    && sed -i 's/\/var\/www\/html/\/var\/www\/html\n        AllowOverride All/' /etc/apache2/sites-available/000-default.conf

# Expose the port your Apache server runs on
EXPOSE 8081

# The CMD instruction provides default execution behavior for the container
CMD ["apache2-foreground"]
