<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\AccountLevelController;
use App\Http\Controllers\AccountTypeController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\PositionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
*/

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

    // ------------------ Account Level -----------------
    Route::apiResource('account-leveling', AccountLevelController::class);

    // ------------------ Account Type ------------------
    Route::apiResource('account-types', AccountTypeController::class);

    // ------------------ Reward ------------------
    Route::resource('rewards', RewardController::class);

    // ------------------ Position ------------------
    Route::resource('positions', PositionController::class);

});
