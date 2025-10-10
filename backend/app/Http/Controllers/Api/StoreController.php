<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Display a listing of the stores.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Retrieve all stores and return as JSON
        return response()->json(Store::all());
    }

    /**
     * Store a newly created store in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|max:30',
            'address' => 'required|max:500',
            'google_map' => 'nullable|url',
        ]);

        // Create a new store record
        $store = Store::create($validated);

        // Return the created store as JSON with 201 status
        return response()->json($store, 201);
    }

    /**
     * Display the specified store.
     *
     * @param  \App\Models\Store  $store
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Store $store)
    {
        // Return the specific store as JSON
        return response()->json($store);
    }

    /**
     * Update the specified store in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Store  $store
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Store $store)
    {
        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|max:30',
            'address' => 'required|max:500',
            'google_map' => 'nullable|url',
        ]);

        // Update the store record
        $store->update($validated);

        // Return the updated store as JSON
        return response()->json($store);
    }

    /**
     * Remove the specified store from the database.
     *
     * @param  \App\Models\Store  $store
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Store $store)
    {
        // Delete the store record
        $store->delete();

        // Return a 204 No Content response
        return response()->json(null, 204);
    }
}
