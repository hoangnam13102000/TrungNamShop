<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BatteryCharging;

class BatteryChargingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $batteries = BatteryCharging::all();
        return response()->json($batteries);
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
            'battery_capacity' => 'nullable|string|max:255',
            'charging_port'    => 'nullable|string|max:255',
            'charging'         => 'nullable|string|max:255',
        ]);

        $battery = BatteryCharging::create($validated);

        return response()->json($battery, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $battery = BatteryCharging::find($id);

        if (!$battery) {
            return response()->json(['message' => 'Battery not found'], 404);
        }

        return response()->json($battery);
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
        $battery = BatteryCharging::find($id);
        if (!$battery) {
            return response()->json(['message' => 'Battery not found'], 404);
        }

        $validated = $request->validate([
            'battery_capacity' => 'nullable|string|max:255',
            'charging_port'    => 'nullable|string|max:255',
            'charging'         => 'nullable|string|max:255',
        ]);

        $battery->update($validated);

        return response()->json([
            'message' => 'Battery updated successfully!',
            'data'    => $battery
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $battery = BatteryCharging::find($id);
        if (!$battery) {
            return response()->json(['message' => 'Battery not found'], 404);
        }

        $battery->delete();

        return response()->json(['message' => 'Battery deleted successfully']);
    }
}
