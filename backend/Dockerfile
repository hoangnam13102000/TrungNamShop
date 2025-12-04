# 1. Base image PHP-FPM
FROM php:8.2-fpm

# 2. System dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libxml2-dev libonig-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring zip xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4. Set working directory
WORKDIR /app
COPY . .

# 5. Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# 6. PHP upload size (tối đa 10MB)
RUN echo "upload_max_filesize=10M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size=10M" >> /usr/local/etc/php/conf.d/uploads.ini

# 7. Cache config/routes/views
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# 8. Fix permissions storage & cache
RUN chmod -R 777 storage bootstrap/cache

# 9. Create folder for product images with full permissions
RUN mkdir -p storage/app/public/products \
    && chmod -R 777 storage/app/public/products

# 10. Create symbolic link storage → public/storage
RUN php artisan storage:link || true

# 11. Expose port
EXPOSE 8080

# 12. Start Laravel: migrate + seed + dev server
CMD php artisan migrate --force \
    && php artisan db:seed --force \
    && php -S 0.0.0.0:8080 -t public
