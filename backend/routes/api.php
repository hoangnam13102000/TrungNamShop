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
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ScreenController;
use App\Http\Controllers\FrontCameraController;
use App\Http\Controllers\RearCameraController;
use App\Http\Controllers\OperatingSystemController;
use App\Http\Controllers\MemoryController;
use App\Http\Controllers\CommunicationConnectivityController;
use App\Http\Controllers\BatteryChargingController;
use App\Http\Controllers\GeneralInformationController;
use App\Http\Controllers\UtilityController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\ReviewController;
use App\Models\Review;

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

    // ------------------ Product ------------------
    Route::resource('products', ProductController::class);

    // ------------------ Color ------------------
    Route::resource('colors', ColorController::class);

    // ------------------ ProductImages ------------------
    Route::apiResource('product-images', ProductImageController::class);

    // ------------------ ProductImages ------------------
    Route::apiResource('screens', ScreenController::class);

    // ------------------ FrontCamera ------------------
    Route::apiResource('front-cameras', FrontCameraController::class);

    // ------------------ RearCamera ------------------
    Route::apiResource('rear-cameras', RearCameraController::class);

    // ------------------ OperatingSystems ------------------
    Route::apiResource('operating-systems', OperatingSystemController::class);

    // ------------------ Memories ------------------
    Route::apiResource('memories', MemoryController::class);

    // ------------------ CommunicationConnectivity ------------------
    Route::apiResource('communication-connectivities', CommunicationConnectivityController::class);

    // ------------------ Batteries Charging ------------------
    Route::apiResource('batteries-charging', BatteryChargingController::class);

    // ------------------ General Informations ------------------
    Route::apiResource('general-informations', GeneralInformationController::class);

    // ------------------ General Utility ------------------
    Route::apiResource('utilities', UtilityController::class);

    // ------------------Product Detail ------------------
    Route::apiResource('product-details', ProductDetailController::class);

    // ------------------Reviews ------------------
    Route::apiResource('reviews', ReviewController::class);
});
