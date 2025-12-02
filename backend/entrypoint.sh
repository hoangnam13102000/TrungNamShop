#!/bin/sh

# Chờ database (tránh lỗi connection refused)
echo "Waiting for database..."
sleep 5

# Chạy migrate
php /var/www/html/artisan migrate --force

# Khởi động nginx (hoặc php-fpm)
exec "$@"
