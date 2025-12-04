# 1. Base image PHP-FPM
FROM php:8.2-fpm

# 2. System dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libxml2-dev libonig-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring zip xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4. Working directory
WORKDIR /app
COPY . .

# 5. Install dependencies
RUN composer install --optimize-autoloader

# 6. Cache config/routes/views
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# 7. Fix permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# 8. Create symbolic link storage → public/storage
RUN php artisan storage:link || true

# 9. Create folder for product images
RUN mkdir -p storage/app/public/products

# 10. Optional sample image copy (DISABLED)
# COPY docker_samples/products/ storage/app/public/products/

# 11. Expose port
EXPOSE 8080

# 12. Start Laravel: migrate + seed + serve
CMD php artisan migrate --force \
    && php artisan db:seed --force \
    && php -S 0.0.0.0:8080 -t public
