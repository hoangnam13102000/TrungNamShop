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
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SalaryCoefficientController;
use App\Http\Controllers\AllowanceController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\OrderDetailController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\MomoController;
use App\Http\Controllers\PaypalController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
*/

// Route::post('/register', [AuthController::class, 'register']);
// Route::post(uri: '/login', [AuthController::class, 'login']);

// // Authenticated routes (SPA / admin / user)
// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/logout', [AuthController::class, 'logout']);
//     Route::get('/user', function (Request $request) {
//         return $request->user();
//     });
// });

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::post('/check-username', [AuthController::class, 'checkUsername']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');
// Get current user information (requires auth)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// ------------------ Chat bot ------------------
Route::post('/chatbot', [ChatbotController::class, 'chat']);

// ------------------ Concact ------------------
Route::post('/contact', [ContactController::class, 'sendEmail']);

// ------------------ Momo Payment ------------------

Route::post('/momo/payment', [MomoController::class, 'createMomoPayment']);
Route::post('/momo/notify', [MomoController::class, 'momoNotify']);
Route::get('/momo/return', [MomoController::class, 'momoReturnHandler']);

Route::post('/momo/confirm', [MomoController::class, 'clientConfirmPayment']);
Route::get('/discounts/validate', [DiscountController::class, 'validateDiscount']);

// ------------------ PayPal Payment ------------------
Route::post('/paypal/payment', [PaypalController::class, 'createPaypalPayment'])->name('paypal.create');
Route::get('/paypal/success', [PaypalController::class, 'paypalSuccess'])->name('paypal.success');
Route::get('/paypal/cancel', [PaypalController::class, 'paypalCancel'])->name('paypal.cancel');
Route::get('/order-status/{orderId}', [PaypalController::class, 'orderStatus']);
Route::get('/order-by-paypal/{token}', [PaypalController::class, 'orderByPaypal']);

Route::prefix("dashboard")->group(function () {
    Route::get("/revenue",       [DashboardController::class,"revenue"]);
    Route::get('/summary-30days', [DashboardController::class, 'summary30Days']);
    Route::get('/top-products', [DashboardController::class, 'topProducts']);
});

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

    // ------------------ Employee ------------------
    Route::apiResource('employees', EmployeeController::class);

    // ------------------ Reward ------------------
    Route::resource('rewards', RewardController::class);

    // ------------------SalaryCoefficient ------------------
    Route::apiResource('salary-coefficients', SalaryCoefficientController::class);

    // ------------------Allowance ------------------
    Route::apiResource('allowances', AllowanceController::class);

    // ------------------Attendance ------------------
    Route::apiResource('attendances', AttendanceController::class);

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

    // ------------------Orders ------------------
    Route::apiResource('orders', OrderController::class);

    // ------------------Order-Details ------------------
    Route::apiResource('order-details', OrderDetailController::class);

    // ------------------Discount ------------------
    Route::apiResource('discounts', DiscountController::class);
    // ------------------Reviews ------------------
    Route::apiResource('reviews', ReviewController::class);

    // ------------------ Recommendations System ------------------
    Route::get('/recommendations/{product_id}', [RecommendationController::class, 'getRecommendations']);

});
