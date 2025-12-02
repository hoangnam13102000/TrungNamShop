FROM php:8.2-fpm AS build

RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libxml2-dev libonig-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip xml

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . /app
WORKDIR /app

RUN composer install --no-dev --optimize-autoloader

RUN php artisan config:cache && php artisan route:cache && php artisan view:cache


FROM nginx:stable-alpine

COPY --from=build /app /var/www/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /var/www/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
