# Build stage
FROM php:8.2-fpm AS build

# Extensions
RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip tokenizer xml

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy source
COPY . /app
WORKDIR /app

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Optimize Laravel
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache


# Production stage
FROM nginx:stable-alpine

COPY --from=build /app /var/www/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
