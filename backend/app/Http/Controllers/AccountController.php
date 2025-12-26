<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    public function index()
    {
        return response()->json(
            Account::with(['accountType', 'accountLevel'])->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_type_id'  => 'required|exists:account_types,id',
            'account_level_id' => 'required|exists:account_levels,id',
            'username'         => 'required|string|max:255|unique:accounts,username',
            'email'            => 'nullable|email|unique:accounts,email',
            'password'         => 'required|string|min:6',
            'status'           => 'nullable|in:0,1',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $account = Account::create($validated);

        return response()->json([
            'message' => 'Account created successfully',
            'data' => $account
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json(
            Account::with(['accountType', 'accountLevel'])->findOrFail($id)
        );
    }

    public function update(Request $request, string $id)
    {
        $account = Account::findOrFail($id);

        $validated = $request->validate([
            'account_type_id'  => 'sometimes|exists:account_types,id',
            'account_level_id' => 'sometimes|exists:account_levels,id',
            'username'         => 'sometimes|string|max:255|unique:accounts,username,' . $account->id,
            'email'            => 'sometimes|nullable|email|unique:accounts,email,' . $account->id,
            'password'         => 'nullable|string|min:6',
            'status'           => 'nullable|in:0,1',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $account->update($validated);

        return response()->json([
            'message' => 'Account updated successfully',
            'data' => $account
        ]);
    }

    public function destroy(string $id)
    {
        Account::findOrFail($id)->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }
}
