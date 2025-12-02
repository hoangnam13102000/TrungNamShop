# 1️⃣ Base image PHP-FPM
FROM php:8.2-fpm

# 2️⃣ Cài dependencies hệ thống
RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libxml2-dev libonig-dev libpq-dev \
    supervisor \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring zip xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 3️⃣ Cài Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4️⃣ Thiết lập working directory
WORKDIR /app
COPY . .

# 5️⃣ Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# 6️⃣ Cache configs, routes, views
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# 7️⃣ Set quyền cho Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# 8️⃣ Copy script để run FPM + migrate
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# 9️⃣ Expose port Render yêu cầu
EXPOSE 8080

# 10️⃣ Chạy entrypoint
ENTRYPOINT ["entrypoint.sh"]
