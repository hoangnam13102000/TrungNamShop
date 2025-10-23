<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OperatingSystem;

class OperatingSystemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $operatingSystems = OperatingSystem::all();
        return response()->json($operatingSystems);
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
            'processor' => 'nullable|string|max:255',
            'cpu_speed' => 'nullable|string|max:50',
            'gpu' => 'nullable|string|max:255',
        ]);

        $os = OperatingSystem::create($validated);
        return response()->json($os, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $os = OperatingSystem::find($id);

        if (!$os) {
            return response()->json(['message' => 'Operating System not found'], 404);
        }

        return response()->json($os);
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
        $os = OperatingSystem::find($id);
        if (!$os) {
            return response()->json(['message' => 'Operating System not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'processor' => 'nullable|string|max:255',
            'cpu_speed' => 'nullable|string|max:50',
            'gpu' => 'nullable|string|max:255',
        ]);

        $os->update($validated);

        return response()->json([
            'message' => 'Operating System updated successfully!',
            'data' => $os
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $os = OperatingSystem::find($id);
        if (!$os) {
            return response()->json(['message' => 'Operating System not found'], 404);
        }

        $os->delete();
        return response()->json(['message' => 'Operating System deleted successfully']);
    }
}
