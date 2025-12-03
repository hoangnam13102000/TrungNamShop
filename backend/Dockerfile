# 1. Base image PHP-FPM
FROM php:8.2-fpm

# 2. System dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libxml2-dev libonig-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring zip xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4. Working dir
WORKDIR /app
COPY . .

# 5. Install dependencies (CÓ faker)
RUN composer install --optimize-autoloader

# Nếu muốn, bạn remove dev sau khi seed thành công.
# Nhưng build image phải giữ dev trước, vì seed đang chạy trong CMD.

# 6. Cache config
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

# 7. Expose
EXPOSE 8080

# 8. Start Laravel
CMD php artisan migrate --force \
    && php artisan db:seed --force \
    && php -S 0.0.0.0:8080 -t public
