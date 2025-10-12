<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store as StoreModel;
class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $store= StoreModel::all();
        return response()->json($store);
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
            'address' => 'required|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:100',
            'google_map' => 'nullable|string|max:500',
        ]);

        $store = StoreModel::create($validated);

        return response()->json([
            'message' => 'Store created successfully!',
            'data' => $store
        ], 201);
    }

    /**
     * Display the specified resource.
     */
   public function show($id)
    {
        $store = StoreModel::find($id);

        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        return response()->json($store);
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
     public function update(Request $request, $id)
    {
        $store = StoreModel::find($id);

        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:100',
            'google_map' => 'nullable|string|max:500',
        ]);

        $store->update($validated);

        return response()->json([
            'message' => 'Store updated successfully!',
            'data' => $store
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
     public function destroy($id)
    {
        $store = StoreModel::find($id);

        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $store->delete();

        return response()->json(['message' => 'Store deleted successfully!']);
    }
}

