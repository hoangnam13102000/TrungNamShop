<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
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

        // Không Hash::make – Model đã tự hash bằng setPasswordAttribute
        $account = Account::create([
            'username' => $request->username,
            'password' => $request->password,
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

        // Check login
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

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect'
            ]);
        }

        // Không Hash::make – Model tự hash
        $user->password = $request->new_password;
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
            'token' => $token
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

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token'
            ], 400);
        }

        $account = Account::where('username', $request->username)->first();

        // Không Hash::make – Model tự hash
        $account->password = $request->password;
        $account->save();

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
