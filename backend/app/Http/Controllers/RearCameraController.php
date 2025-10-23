<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RearCamera;

class RearCameraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rearCameras = RearCamera::all();
        return response()->json($rearCameras);
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

        $rearCamera = RearCamera::create($validated);

        return response()->json($rearCamera, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $rearCamera = RearCamera::find($id);

        if (!$rearCamera) {
            return response()->json(['message' => 'Rear camera not found'], 404);
        }

        return response()->json($rearCamera);
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
        $rearCamera = RearCamera::find($id);

        if (!$rearCamera) {
            return response()->json(['message' => 'Rear camera not found'], 404);
        }

        $validated = $request->validate([
            'resolution' => 'nullable|string|max:255',
            'features' => 'nullable|string',
            'aperture' => 'nullable|string|max:50',
            'video_capability' => 'nullable|string|max:255',
        ]);

        $rearCamera->update($validated);

        return response()->json([
            'message' => 'Rear camera updated successfully!',
            'data' => $rearCamera
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $rearCamera = RearCamera::find($id);

        if (!$rearCamera) {
            return response()->json(['message' => 'Rear camera not found'], 404);
        }

        $rearCamera->delete();

        return response()->json(['message' => 'Rear camera deleted successfully']);
    }
}
