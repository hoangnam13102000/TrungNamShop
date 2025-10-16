<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $positions = Position::all();
        return response()->json($positions);
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
            'name' => 'required|string|max:191',
            'base_salary' => 'nullable|numeric',
        ]);

        $position = Position::create($validated);

        return response()->json([
            'message' => 'Position created successfully!',
            'data' => $position
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json(['message' => 'Position not found'], 404);
        }

        return response()->json($position);
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
        $position = Position::find($id);

        if (!$position) {
            return response()->json(['message' => 'Position not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'base_salary' => 'nullable|numeric',
        ]);

        $position->update($validated);

        return response()->json([
            'message' => 'Position updated successfully!',
            'data' => $position
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json(['message' => 'Position not found'], 404);
        }

        $position->delete();

        return response()->json(['message' => 'Position deleted successfully!']);
    }

    /**
     * Restore soft deleted position.
     */
    // public function restore(string $id)
    // {
    //     $position = Position::withTrashed()->find($id);

    //     if (!$position) {
    //         return response()->json(['message' => 'Position not found'], 404);
    //     }

    //     $position->restore();

    //     return response()->json(['message' => 'Position restored successfully!']);
    // }

    // /**
    //  * Get list of soft deleted positions.
    //  */
    // public function trashed()
    // {
    //     $trashed = Position::onlyTrashed()->get();
    //     return response()->json($trashed);
    // }
}
