#!/bin/sh

# Migrate database (không fail nếu lỗi)
php artisan migrate --force || true

# Start PHP-FPM (Render bind port tự động)
echo "==> Starting PHP built-in server on port 8080..."
exec php -S 0.0.0.0:8080 -t public
