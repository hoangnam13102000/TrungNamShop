<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // ================= REGISTER =================
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:accounts,username',
            'password' => 'required|min:6',
        ]);

        $account = Account::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),  // Hash password before store
            'status' => 1,
            'account_type_id' => 3,
            'account_level_id' => 1,
        ]);

        $token = $account->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $account,
            'token' => $token,
        ], 201);
    }

    // ================= LOGIN =================
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required|min:6',
        ]);

        $account = Account::where('username', $request->username)->first();

        // Check if user exists + validate password
        if (!$account || !Hash::check($request->password, $account->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Incorrect username or password.'
            ], 401);
        }

        $token = $account->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user' => $account,
            'token' => $token,
        ]);
    }

    // ================= LOGOUT =================
    public function logout(Request $request)
    {
        // Remove all tokens of this user
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    // ================= CHANGE PASSWORD =================
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        $user = $request->user();

        // Verify old password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect'
            ]);
        }

        // Update new password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    }

    // ================= FORGOT PASSWORD =================
    public function forgotPassword(Request $request)
    {
        $request->validate(['username' => 'required|exists:accounts,username']);

        // Generate recovery token
        $token = Str::random(50);

        DB::table('password_account_resets')->updateOrInsert(
            ['username' => $request->username],
            [
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Reset password token generated',
            'token' => $token // Frontend receives this to redirect to reset page
        ]);
    }

    // ================= RESET PASSWORD =================
    public function resetPassword(Request $request)
    {
        $request->validate([
            'username' => 'required|exists:accounts,username',
            'token' => 'required|string',
            'password' => 'required|min:6|confirmed'
        ]);

        $record = DB::table('password_account_resets')
            ->where('username', $request->username)
            ->first();

        // Validate token
        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token'
            ], 400);
        }

        // Update account password
        $account = Account::where('username', $request->username)->first();
        $account->password = Hash::make($request->password);
        $account->save();

        // Remove used token
        DB::table('password_account_resets')->where('username', $request->username)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully!'
        ]);
    }

    // ================= CHECK USERNAME EXISTS =================
    public function checkUsername(Request $request)
    {
        return response()->json([
            'exists' => Account::where('username', $request->username)->exists()
        ]);
    }
}
