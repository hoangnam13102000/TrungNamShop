<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GeneralInformation;

class GeneralInformationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $generalInfos = GeneralInformation::all();
        return response()->json($generalInfos);
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
            'design'        => 'nullable|string|max:255',
            'material'      => 'nullable|string|max:255',
            'dimensions'    => 'nullable|string|max:255',
            'weight'        => 'nullable|string|max:255',
            'launch_time'  => 'nullable|date',
        ]);

        $generalInfo = GeneralInformation::create($validated);
        return response()->json($generalInfo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $generalInfo = GeneralInformation::find($id);

        if (!$generalInfo) {
            return response()->json(['message' => 'General information not found'], 404);
        }

        return response()->json($generalInfo);
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
        $generalInfo = GeneralInformation::find($id);
        if (!$generalInfo) {
            return response()->json(['message' => 'General information not found'], 404);
        }

        $validated = $request->validate([
            'design'        => 'nullable|string|max:255',
            'material'      => 'nullable|string|max:255',
            'dimensions'    => 'nullable|string|max:255',
            'weight'        => 'nullable|string|max:255',
            'launch_time'  => 'nullable|date',
        ]);

        $generalInfo->update($validated);

        return response()->json([
            'message' => 'General information updated successfully!',
            'data'    => $generalInfo
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $generalInfo = GeneralInformation::find($id);
        if (!$generalInfo) {
            return response()->json(['message' => 'General information not found'], 404);
        }

        $generalInfo->delete();
        return response()->json(['message' => 'General information deleted successfully']);
    }
}
