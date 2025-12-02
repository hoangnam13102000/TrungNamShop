#!/bin/sh

# Migrate database (không fail nếu lỗi)
php artisan migrate --force || true

# Start PHP-FPM (Render bind port tự động)
exec php-fpm
