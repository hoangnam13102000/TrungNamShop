<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $promotions = Promotion::all();
        return response()->json($promotions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'discount_percent' => 'required|numeric|min:0|max:100',
        ]);

        $promotion = Promotion::create($validated);

        return response()->json([
            'message' => 'Promotion created successfully!',
            'data' => $promotion
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found'], 404);
        }

        return response()->json($promotion);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'discount_percent' => 'required|numeric|min:0|max:100',
        ]);

        $promotion->update($validated);

        return response()->json([
            'message' => 'Promotion updated successfully!',
            'data' => $promotion
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json(['message' => 'Promotion not found'], 404);
        }

        $promotion->delete();

        return response()->json(['message' => 'Promotion deleted successfully!']);
    }
}
