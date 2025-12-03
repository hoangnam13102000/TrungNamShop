<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // Các đường dẫn API cần cho phép CORS
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Phương thức HTTP cho phép
    'allowed_origins' => [
        // Local development
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',

        // Your Vercel frontend production URLs
        'https://trung-nam-shop-ao6x.vercel.app',
        'https://trungnamshop-frontend.vercel.app',

        // All Vercel subdomains
        'https://*.vercel.app',

        // Render backend itself (for internal calls)
        'https://trungnamshop-1.onrender.com',
    ],

    'allowed_origins_patterns' => [
        '/^https?:\/\/.*\.vercel\.app$/',
        '/^https?:\/\/localhost:[0-9]+$/',
    ],

    // 'allowed_origins_patterns' => [],

    // Header được phép
    'allowed_headers' => ['*'],

    // Header sẽ expose cho client
    'exposed_headers' => [],

    // Số giây lưu preflight cache
    'max_age' => 0,

    // Bật nếu cần gửi cookie hoặc session
    'supports_credentials' => true,
];
