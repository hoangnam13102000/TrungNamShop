<?php

namespace App\Http\Controllers;

use App\Models\Color;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $colors = Color::all();
        return response()->json($colors);
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
            'name' => 'required|string|max:191|unique:colors,name',
        ]);

        $color = Color::create($validated);

        return response()->json([
            'message' => 'Color created successfully!',
            'data' => $color
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $color = Color::find($id);

        if (!$color) {
            return response()->json(['message' => 'Color not found'], 404);
        }

        return response()->json($color);
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
        $color = Color::find($id);

        if (!$color) {
            return response()->json(['message' => 'Color not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:191|unique:colors,name,' . $color->id,
        ]);

        $color->update($validated);

        return response()->json([
            'message' => 'Color updated successfully!',
            'data' => $color
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $color = Color::find($id);

        if (!$color) {
            return response()->json(['message' => 'Color not found'], 404);
        }

        $color->delete();

        return response()->json(['message' => 'Color deleted successfully!']);
    }

    /**
     * Optional: Restore soft deleted color.
     */
    // public function restore(string $id)
    // {
    //     $color = Color::withTrashed()->find($id);

    //     if (!$color) {
    //         return response()->json(['message' => 'Color not found'], 404);
    //     }

    //     $color->restore();

    //     return response()->json(['message' => 'Color restored successfully!']);
    // }

    /**
     * Optional: Get list of soft deleted colors.
     */
    // public function trashed()
    // {
    //     $trashed = Color::onlyTrashed()->get();
    //     return response()->json($trashed);
    // }
}
