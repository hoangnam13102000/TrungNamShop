# 1. Base image PHP-FPM
FROM php:8.2-fpm

# 2. Cài dependencies hệ thống
RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libxml2-dev libonig-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring zip xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Cài Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4. Thiết lập working directory
WORKDIR /app
COPY . .

# 5. Install dependencies PHP
RUN composer install --no-dev --optimize-autoloader

# 6. Cache Laravel configs, routes, views
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

# 7. Expose port Render yêu cầu
EXPOSE 8080

# 8. Start command: chạy Laravel server
# Tự động migrate nếu muốn
CMD php artisan migrate --force \
    && php artisan db:seed --force \
    && php -S 0.0.0.0:8080 -t public
