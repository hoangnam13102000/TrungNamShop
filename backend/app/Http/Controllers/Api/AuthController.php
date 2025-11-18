<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    // Đăng ký
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:accounts,username',
            'password' => 'required|min:6',
        ]);

        $account = Account::create([
            'username' => $request->username,
            'password' => $request->password, // tự hash do cast
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

    // Đăng nhập
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required|min:6',
        ]);

        $account = Account::where('username', $request->username)->first();

        if (!$account || !Hash::check($request->password, $account->password)) {
            throw ValidationException::withMessages([
                'username' => ['Tên đăng nhập hoặc mật khẩu không đúng.'],
            ]);
        }

        $token = $account->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $account,
            'token' => $token,
        ]);
    }

    // Đăng xuất
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Đăng xuất thành công']);
    }
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
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:accounts,email',
        ]);

        // Gửi link reset mật khẩu
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Liên kết đặt lại mật khẩu đã được gửi!'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Không thể gửi liên kết, vui lòng thử lại.'
            ], 400);
        }
    }
}
