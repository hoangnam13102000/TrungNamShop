# Base image PHP 8.2 FPM
FROM php:8.2-fpm

# Cài các package cần thiết và extension PHP
RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libxml2-dev libonig-dev libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring zip xml

# Cài Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy toàn bộ code
COPY . .

# Install dependencies Laravel
RUN composer install --no-dev --optimize-autoloader

# Cache config/routes/views
RUN php artisan config:cache \
 && php artisan route:cache \
 && php artisan view:cache

# Expose port Render yêu cầu
EXPOSE 8080

# Start PHP-FPM (Render sẽ handle port 8080)
CMD ["php-fpm"]
