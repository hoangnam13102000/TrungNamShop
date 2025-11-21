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
    'allowed_methods' => ['*'],

    // Các origin được phép truy cập
    'allowed_origins' => ['http://localhost:5173'], // frontend của bạn

    'allowed_origins_patterns' => [],

    // Header được phép
    'allowed_headers' => ['*'],

    // Header sẽ expose cho client
    'exposed_headers' => [],

    // Số giây lưu preflight cache
    'max_age' => 0,

    // Bật nếu cần gửi cookie hoặc session
    'supports_credentials' => true,
];
