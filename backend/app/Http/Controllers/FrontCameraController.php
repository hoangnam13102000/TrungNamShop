<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FrontCamera;

class FrontCameraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $frontCameras = FrontCamera::all();
        return response()->json($frontCameras);
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
            'resolution' => 'required|string|max:255',
            'features' => 'nullable|string',
            'aperture' => 'nullable|string|max:50',
            'video_capability' => 'nullable|string|max:255',
        ]);

        $frontCamera = FrontCamera::create($validated);

        return response()->json($frontCamera, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $frontCamera = FrontCamera::find($id);

        if (!$frontCamera) {
            return response()->json(['message' => 'Front camera not found'], 404);
        }

        return response()->json($frontCamera);
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
        $frontCamera = FrontCamera::find($id);

        if (!$frontCamera) {
            return response()->json(['message' => 'Front camera not found'], 404);
        }

        $validated = $request->validate([
            'resolution' => 'nullable|string|max:255',
            'features' => 'nullable|string',
            'aperture' => 'nullable|string|max:50',
            'video_capability' => 'nullable|string|max:255',
        ]);

        $frontCamera->update($validated);

        return response()->json([
            'message' => 'Front camera updated successfully!',
            'data' => $frontCamera
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $frontCamera = FrontCamera::find($id);

        if (!$frontCamera) {
            return response()->json(['message' => 'Front camera not found'], 404);
        }

        $frontCamera->delete();

        return response()->json(['message' => 'Front camera deleted successfully']);
    }
}
