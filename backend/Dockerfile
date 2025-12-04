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

# ⚠ FIX: Ensure project files belong to www-data
COPY --chown=www-data:www-data . .

# 5. Install dependencies
RUN composer install --optimize-autoloader --no-dev

# 6. Cache config/routes/views
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# 7. Fix permissions (runtime user)
RUN chmod -R 775 storage bootstrap/cache

# 8. Remove existing storage link if wrong
RUN rm -f public/storage

#  Do NOT run storage:link here (build stage cannot symlink properly)

EXPOSE 8080

# 9. Runtime bootstrapping
CMD mkdir -p storage/app/public/products \
    && chown -R www-data:www-data storage \
    && chmod -R 775 storage \
    && php artisan storage:link \
    && php artisan migrate --force \
    && php artisan db:seed --force \
    && php -S 0.0.0.0:8080 -t public
