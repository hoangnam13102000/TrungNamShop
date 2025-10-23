<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CommunicationConnectivity;

class CommunicationConnectivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = CommunicationConnectivity::all();
        return response()->json($items);
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
            'nfc' => 'required|boolean',
            'sim_slot' => 'nullable|string|max:100',
            'mobile_network' => 'nullable|string|max:50',
            'gps' => 'nullable|string|max:255',
        ]);

        $item = CommunicationConnectivity::create($validated);
        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $item = CommunicationConnectivity::find($id);
        if (!$item) return response()->json(['message' => 'Not found'], 404);

        return response()->json($item);
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
        $item = CommunicationConnectivity::find($id);
        if (!$item) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'nfc' => 'nullable|boolean',
            'sim_slot' => 'nullable|string|max:100',
            'mobile_network' => 'nullable|string|max:50',
            'gps' => 'nullable|string|max:255',
        ]);

        $item->update($validated);

        return response()->json([
            'message' => 'Updated successfully!',
            'data' => $item
        ]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = CommunicationConnectivity::find($id);
        if (!$item) return response()->json(['message' => 'Not found'], 404);

        $item->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
