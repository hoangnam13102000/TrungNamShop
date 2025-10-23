<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Screen;

class ScreenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    
        $screens = Screen::all();

        return response()->json($screens);
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
            'display_technology' => 'required|string|max:255',
            'resolution'         => 'nullable|string|max:255',
            'screen_size'        => 'nullable|string|max:255',
            'max_brightness'     => 'nullable|string|max:255',
            'glass_protection'   => 'nullable|string|max:255',
        ]);

        $screen = Screen::create($validated);

        return response()->json($screen, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $screen = Screen::find($id);

        if (!$screen) {
            return response()->json(['message' => 'Screen not found'], 404);
        }

        return response()->json($screen);
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
        $screen = Screen::find($id);

        if (!$screen) {
            return response()->json(['message' => 'Screen not found'], 404);
        }

        $validated = $request->validate([
            'display_technology' => 'nullable|string|max:255',
            'resolution'         => 'nullable|string|max:255',
            'screen_size'        => 'nullable|string|max:255',
            'max_brightness'     => 'nullable|string|max:255',
            'glass_protection'   => 'nullable|string|max:255',
        ]);

        $screen->update($validated);

        return response()->json([
            'message' => 'Screen updated successfully!',
            'data' => $screen
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $screen = Screen::find($id);

        if (!$screen) {
            return response()->json(['message' => 'Screen not found'], 404);
        }

        $screen->delete();

        return response()->json(['message' => 'Screen deleted successfully']);
    }
}
