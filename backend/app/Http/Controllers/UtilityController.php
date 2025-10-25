<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Utility;

class UtilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $utilities = Utility::all();
        return response()->json($utilities);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'advanced_security' => 'nullable|string|max:255',
            'special_features' => 'nullable|string|max:255',
            'water_dust_resistance' => 'nullable|string|max:255',
        ]);

        $utility = Utility::create($validated);
        return response()->json($utility, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $utility = Utility::find($id);

        if (!$utility) {
            return response()->json(['message' => 'Utility not found'], 404);
        }

        return response()->json($utility);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $utility = Utility::find($id);

        if (!$utility) {
            return response()->json(['message' => 'Utility not found'], 404);
        }

        $validated = $request->validate([
            'advanced_security' => 'nullable|string|max:255',
            'special_features' => 'nullable|string|max:255',
            'water_dust_resistance' => 'nullable|string|max:255',
        ]);

        $utility->update($validated);

        return response()->json([
            'message' => 'Utility updated successfully!',
            'data' => $utility
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $utility = Utility::find($id);

        if (!$utility) {
            return response()->json(['message' => 'Utility not found'], 404);
        }

        $utility->delete();

        return response()->json(['message' => 'Utility deleted successfully']);
    }
}
