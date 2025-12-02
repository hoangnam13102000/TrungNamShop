FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libxml2-dev libonig-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring zip xml

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy Laravel source code
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Create entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port Render requires
EXPOSE 8080

# Use entrypoint to migrate before start
ENTRYPOINT ["/entrypoint.sh"]

# Start Laravel Server
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
