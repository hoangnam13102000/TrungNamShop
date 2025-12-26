<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;


class AuthController extends Controller
{
    // ================= REGISTER =================
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:accounts,username',
            'email'    => 'nullable|email|unique:accounts,email',
            'password' => 'required|min:6',
        ]);

        $account = Account::create([
            'username' => $request->username,
            'email'    => $request->email, 
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
        $request->validate([
            'email' => 'required|email|exists:accounts,email'
        ]);

        $token = Str::random(64);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        // ✅ LINK ĐÚNG
        $link = config('app.frontend_url')
            . '/reset-mat-khau?token=' . $token
            . '&email=' . urlencode($request->email);

        Mail::to($request->email)->send(new ResetPasswordMail($link));

        return response()->json([
            'success' => true,
            'message' => 'Email đặt lại mật khẩu đã được gửi.'
        ]);
    }


    // ================= RESET PASSWORD =================
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:accounts,email',
            'token' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        $record = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'Yêu cầu đặt lại mật khẩu không tồn tại.'
            ], 400);
        }

        // Check token
        if (!Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ hoặc đã hết hạn.'
            ], 400);
        }

        // Update password (Model tự hash)
        $account = Account::where('email', $request->email)->first();
        $account->password = $request->password;
        $account->save();

        // Xoá token sau khi dùng
        DB::table('password_resets')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đặt lại mật khẩu thành công.'
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
