<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

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
            'account_level_id'=> 1, 
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
}
