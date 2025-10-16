<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AccountType;
class AccountTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $accountTypes = AccountType::all();
        return response()->json($accountTypes);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_type_name' => 'required|string|max:100',
        ]);

        $accountType = AccountType::create($validated);

        return response()->json([
            'message' => 'AccountType created successfully!',
            'data' => $accountType
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $accountType = AccountType::find($id);

        if (!$accountType) {
            return response()->json(['message' => 'AccountType not found'], 404);
        }

        return response()->json($accountType);
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
        $accountType = AccountType::find($id);

        if (!$accountType) {
            return response()->json(['message' => 'AccountType not found'], 404);
        }

        $validated = $request->validate([
            'account_type_name' => 'required|string|max:100',
        ]);

        $accountType->update($validated);

        return response()->json([
            'message' => 'AccountType updated successfully!',
            'data' => $accountType
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $accountType = AccountType::find($id);

        if (!$accountType) {
            return response()->json(['message' => 'AccountType not found'], 404);
        }

        $accountType->delete();

        return response()->json(['message' => 'AccountType deleted successfully!']);
    
    }
}
