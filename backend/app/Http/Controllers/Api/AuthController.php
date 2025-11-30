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
    // Đăng ký
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:accounts,username',
            'password' => 'required|min:6',
        ]);

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

    // Thay đổi mật khẩu
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed', // new_password_confirmation
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mật khẩu hiện tại không đúng'
            ], 400);
        }

        $user->password = $request->new_password;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Đổi mật khẩu thành công'
        ]);
    }

    // Quên mật khẩu (tạo token dựa trên username)
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'username' => 'required|string|exists:accounts,username',
        ]);

        $account = Account::where('username', $request->username)->first();

        // Tạo token random
        $token = Str::random(60);

        // Lưu token hash vào bảng password_account_resets
        DB::table('password_account_resets')->updateOrInsert(
            ['username' => $account->username],
            ['token' => Hash::make($token), 'created_at' => Carbon::now()]
        );

        // Trong thực tế bạn gửi token này qua email/SMS
        return response()->json([
            'success' => true,
            'message' => 'Token đặt lại mật khẩu đã được tạo!',
            'token' => $token
        ]);
    }

    // Reset password bằng username + token
    public function resetPassword(Request $request)
    {
        $request->validate([
            'username' => 'required|string|exists:accounts,username',
            'token' => 'required|string',
            'password' => 'required|min:6|confirmed', // password_confirmation
        ]);

        $record = DB::table('password_account_resets')
            ->where('username', $request->username)
            ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ hoặc đã hết hạn.'
            ], 400);
        }

        // Reset mật khẩu
        $account = Account::where('username', $request->username)->first();
        $account->password = $request->password;
        $account->save();

        // Xóa token sau khi reset
        DB::table('password_account_resets')->where('username', $request->username)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đặt lại mật khẩu thành công!'
        ]);
    }

    // Kiểm tra username đã tồn tại
    public function checkUsername(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
        ]);

        $exists = Account::where('username', $request->username)->exists();

        return response()->json([
            'exists' => $exists
        ]);
    }
}
