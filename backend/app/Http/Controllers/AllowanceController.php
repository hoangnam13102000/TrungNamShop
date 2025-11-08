<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Allowance;
class AllowanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $allowances = Allowance::all();
        return response()->json($allowances);
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
            'allowance_name' => 'required|string|max:255',
            'allowance_amount' => 'required|numeric|min:0',
        ]);

        $allowance = Allowance::create($validated);

        return response()->json([
            'message' => 'Allowance created successfully!',
            'data' => $allowance
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $allowance = Allowance::find($id);

        if (!$allowance) {
            return response()->json(['message' => 'Allowance not found'], 404);
        }

        return response()->json($allowance);
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
        $allowance = Allowance::find($id);

        if (!$allowance) {
            return response()->json(['message' => 'Allowance not found'], 404);
        }

        $validated = $request->validate([
            'allowance_name' => 'required|string|max:255',
            'allowance_amount' => 'required|numeric|min:0',
        ]);

        $allowance->update($validated);

        return response()->json([
            'message' => 'Allowance updated successfully!',
            'data' => $allowance
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $allowance = Allowance::find($id);

        if (!$allowance) {
            return response()->json(['message' => 'Allowance not found'], 404);
        }

        $allowance->delete();

        return response()->json(['message' => 'Allowance deleted successfully!']);
    }
}
