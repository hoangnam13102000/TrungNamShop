<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AccountLevel;
class AccountLevelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $accountLevels = AccountLevel::all();
        return response()->json($accountLevels);
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
            'name' => 'required|string|max:255',
            'limit' => 'nullable|numeric|min:0',
        ]);
        $accountLevel = AccountLevel::create($validated);
        return response()->json([
            'message' => 'AccountLevel created successfully!',
            'data' => $accountLevel
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         
        $accountLevel = AccountLevel::find($id);

        if (!$accountLevel) {
            return response()->json(['message' => 'AccountLevel not found'], 404);
        }

        return response()->json($accountLevel);
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
        if ($id == 1) {
        return response()->json(['message' => 'Không thể sửa Level này'], 403);
        }

        $accountLevel = AccountLevel::find($id);
         if (!$accountLevel) {
            return response()->json(['message' => 'AccountLevel not found'], 404);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'limit' => 'nullable|numeric|min:0',
        ]);

        $accountLevel->update($validated);

        return response()->json([
            'message' => 'AccountLevel updated successfully!',
            'data' => $accountLevel
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if ($id == 1) {
        return response()->json(['message' => 'Không thể xoá Level này'], 403);
        }

        $accountLevel = AccountLevel::find($id);

        if (!$accountLevel) {
            return response()->json(['message' => 'AccountLevel not found'], 404);
        }

        // Soft delete
        $accountLevel->delete();

        return response()->json(['message' => 'AccountLevel deleted successfully!']);
    }
}
