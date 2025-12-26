<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Mail;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/test-mail', function () {
    Mail::raw('Test mail OK', function ($msg) {
        $msg->to('hoangnam131020@gmail.com')
            ->subject('Test Gmail SMTP');
    });

    return 'Mail sent';
});
Route::get('/test-paypal-env', function () {
    dd(
        env('PAYPAL_CLIENT_ID'),
        env('PAYPAL_CLIENT_SECRET'),
        env('PAYPAL_MODE')
    );
});
