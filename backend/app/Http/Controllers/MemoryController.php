<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Memory;

class MemoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $memories = Memory::all();
        return response()->json($memories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ram' => 'required|string|max:50',
            'internal_storage' => 'required|string|max:50',
            'memory_card_slot' => 'nullable|string|max:50',
        ]);

        $memory = Memory::create($validated);
        return response()->json($memory, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $memory = Memory::find($id);

        if (!$memory) {
            return response()->json(['message' => 'Memory not found'], 404);
        }

        return response()->json($memory);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $memory = Memory::find($id);
        if (!$memory) {
            return response()->json(['message' => 'Memory not found'], 404);
        }

        $validated = $request->validate([
            'ram' => 'nullable|string|max:50',
            'internal_storage' => 'nullable|string|max:50',
            'memory_card_slot' => 'nullable|string|max:50',
        ]);

        $memory->update($validated);

        return response()->json([
            'message' => 'Memory updated successfully!',
            'data' => $memory
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $memory = Memory::find($id);
        if (!$memory) {
            return response()->json(['message' => 'Memory not found'], 404);
        }

        $memory->delete();
        return response()->json(['message' => 'Memory deleted successfully']);
    }
}
