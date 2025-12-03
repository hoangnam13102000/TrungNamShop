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

# 5. Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# 6. Cache config & routes
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# 7. Fix permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# 8. Create storage symbolic link
RUN php artisan storage:link

# 9. Optional: copy storage contents to public if php -S dùng
RUN mkdir -p public/storage \
    && cp -r storage/app/public/* public/storage/

# 10. Expose port
EXPOSE 8080

# 11. Start Laravel with built-in PHP server
CMD php artisan migrate --force \
    && php artisan db:seed --force \
    && php -S 0.0.0.0:8080 -t public
