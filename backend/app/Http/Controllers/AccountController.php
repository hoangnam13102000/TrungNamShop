<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;
class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $accounts = Account::with(['accountType', 'accountLevel'])->get();
        return response()->json($accounts);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_type_id' => 'required|exists:account_types,id',
            'account_level_id' => 'required|exists:account_levels,id',
            'username' => 'required|string|max:255|unique:accounts,username',
            'password' => 'required|string|min:6',
            'reward_points' => 'nullable|integer|min:0',
            'token' => 'nullable|string|max:255',
            'status' => 'nullable|integer|min:0|max:1',
        ]);

        // // Hash the password
        // $validated['password'] = bcrypt($validated['password']);

        $account = Account::create($validated);

        return response()->json([
            'message' => 'Account created successfully!',
            'data' => $account
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $account = Account::with(['accountType', 'accountLevel'])->find($id);

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        return response()->json($account);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        $validated = $request->validate([
            'account_type_id' => 'sometimes|exists:account_types,id',
            'account_level_id' => 'sometimes|exists:account_levels,id',
            'username' => 'sometimes|string|max:255|unique:accounts,username,' . $account->id,
            'password' => 'nullable|string|min:6',
            'reward_points' => 'nullable|integer|min:0',
            'token' => 'nullable|string|max:255',
            'status' => 'nullable|integer|min:0|max:1',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $account->update($validated);

        return response()->json([
            'message' => 'Account updated successfully!',
            'data' => $account
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        $account->delete();

        return response()->json(['message' => 'Account deleted successfully!']);
    
    }
}
