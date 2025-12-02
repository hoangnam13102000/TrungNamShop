# -------------------------
# Build stage (PHP)
# -------------------------
FROM php:8.2-fpm AS build

# Install system packages + PHP extensions
RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip xml

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy app source
COPY . /app
WORKDIR /app

# Install Laravel dependencies (production)
RUN composer install --no-dev --optimize-autoloader

# Laravel optimizations
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache


# -------------------------
# Production stage (Nginx)
# -------------------------
FROM nginx:stable-alpine

# Copy Laravel app from build stage
COPY --from=build /app /var/www/html

# Copy nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Public web root permission fix
RUN chown -R nginx:nginx /var/www/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
