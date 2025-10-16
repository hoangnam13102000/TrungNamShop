<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reward;

class RewardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rewards = Reward::all();
        return response()->json($rewards);
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
            'reward_name' => 'required|string|max:255',
            'reward_money' => 'required|numeric|min:0',
        ]);

        $reward = Reward::create($validated);

        return response()->json([
            'message' => 'Reward created successfully!',
            'data' => $reward
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $reward = Reward::find($id);

        if (!$reward) {
            return response()->json(['message' => 'Reward not found'], 404);
        }

        return response()->json($reward);
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
        $reward = Reward::find($id);

        if (!$reward) {
            return response()->json(['message' => 'Reward not found'], 404);
        }

       $validated = $request->validate([
            'reward_name' => 'required|string|max:255',
            'reward_money' => 'required|numeric|min:0',
        ]);
        $reward->update($validated);

        return response()->json([
            'message' => 'Reward updated successfully!',
            'data' => $reward
        ]);
    }

    /**
     * Remove the specified resource from storage (Soft Delete).
     */
    public function destroy(string $id)
    {
        $reward = Reward::find($id);

        if (!$reward) {
            return response()->json(['message' => 'Reward not found'], 404);
        }

        $reward->delete(); // Soft delete

        return response()->json(['message' => 'Reward deleted successfully!']);
    }

    /**
     * Display soft-deleted rewards (optional).
     */
    public function trashed()
    {
        $trashed = Reward::onlyTrashed()->get();
        return response()->json($trashed);
    }

    /**
     * Restore a soft-deleted reward (optional).
     */
    public function restore(string $id)
    {
        $reward = Reward::onlyTrashed()->find($id);

        if (!$reward) {
            return response()->json(['message' => 'Reward not found in trash'], 404);
        }

        $reward->restore();

        return response()->json(['message' => 'Reward restored successfully!']);
    }

    /**
     * Permanently delete a soft-deleted reward (optional).
     */
    public function forceDelete(string $id)
    {
        $reward = Reward::onlyTrashed()->find($id);

        if (!$reward) {
            return response()->json(['message' => 'Reward not found in trash'], 404);
        }

        $reward->forceDelete();

        return response()->json(['message' => 'Reward permanently deleted!']);
    }
}
