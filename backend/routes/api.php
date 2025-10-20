<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\AccountLevelController;
use App\Http\Controllers\AccountTypeController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\BrandController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


// Get current user information (requires auth)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Group Router for Admin
Route::prefix('admin')->group(function () {

    // ------------------ Store ------------------
    Route::resource('stores', StoreController::class);

    // ------------------ Warehouse ------------------
    Route::resource('warehouses', WarehouseController::class);

    // ------------------ Promotion ------------------
    Route::resource('promotions', PromotionController::class);

    // ------------------ Account ------------------
    Route::apiResource('accounts', AccountController::class);

    // ------------------ Account Level -----------------
    Route::apiResource('account-leveling', AccountLevelController::class);

    // ------------------ Account Type ------------------
    Route::apiResource('account-types', AccountTypeController::class);

    // ------------------ Customer ------------------
    Route::apiResource('customers', CustomerController::class);

    // ------------------ Reward ------------------
    Route::resource('rewards', RewardController::class);

    // ------------------ Position ------------------
    Route::resource('positions', PositionController::class);

    // ------------------ Brand ------------------
    Route::apiResource('brands', BrandController::class);
});
