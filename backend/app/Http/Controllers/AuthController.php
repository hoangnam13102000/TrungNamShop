<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Account;

class AuthController extends Controller
{
    /**
     * REGISTER ACCOUNT
     * POST /api/register
     */
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:accounts,username',
            'password' => 'required|string|min:6',
        ]);

        // Create new user , define account_type_id = 3 (customer), level = 1
        $user = Account::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'account_type_id' => 3,
            'account_level_id' => 1,
            'status' => 1,
            'reward_points' => 0,
        ]);

        // Create token
        $token = Str::random(60);
        $user->token = $token;
        $user->save();

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'account_type_id' => $user->account_type_id,
                'account_level_id' => $user->account_level_id,
                'reward_points' => $user->reward_points,
                'avatar' => '/default-avatar.png',
                'status' => $user->status,
            ],
        ]);
    }

    /**
     * LOGIN
     * POST /api/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $user = Account::where('username', $request->username)->first();

        if (!$user) {
            return response()->json(['message' => 'Tài khoản không tồn tại'], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Mật khẩu không đúng'], 401);
        }

        if ($user->status === 0) {
            return response()->json(['message' => 'Tài khoản bị khóa'], 403);
        }

        // Create new token 
        $token = Str::random(60);
        $user->token = $token;
        $user->save();

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'account_type_id' => $user->account_type_id,
                'account_level_id' => $user->account_level_id,
                'reward_points' => $user->reward_points,
                'avatar' => '/default-avatar.png',
                'status' => $user->status,
            ],
        ]);
    }

    /**
     * LOGOUT
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        $user = Account::where('token', $request->bearerToken())->first();
        if ($user) {
            $user->token = null;
            $user->save();
        }
        return response()->json(['message' => 'Đăng xuất thành công']);
    }

    /**
     * Get info current user
     * GET /api/user
     */
    public function user(Request $request)
    {
        $user = Account::where('token', $request->bearerToken())->first();
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy user'], 404);
        }

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'account_type_id' => $user->account_type_id,
            'account_level_id' => $user->account_level_id,
            'reward_points' => $user->reward_points,
            'avatar' => '/default-avatar.png',
            'status' => $user->status,
        ]);
    }

    /**
     * CHANGE PASSWORD
     * POST /api/auth/change-password
     */

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed', // new_password_confirmation
        ]);

        $user = $request->user(); // hoặc Auth::user()

        // Kiểm tra mật khẩu hiện tại
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mật khẩu hiện tại không đúng'
            ], 400);
        }

        // Cập nhật mật khẩu mới (mutator tự hash)
        $user->password = $request->new_password;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Đổi mật khẩu thành công'
        ]);
    }
}
