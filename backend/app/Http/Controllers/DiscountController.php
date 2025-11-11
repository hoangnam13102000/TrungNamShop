<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Discount;

class DiscountController extends Controller
{
    /**
     * Display a listing of discounts.
     */
    public function index()
    {
        $discounts = Discount::all();
        return response()->json($discounts);
    }

    /**
     * Show the form for creating a new discount.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created discount in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:discounts,code',
            'percentage' => 'nullable|numeric|min:0|max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:active,inactive',
        ]);

        $discount = Discount::create($validated);

        return response()->json([
            'message' => 'Discount created successfully!',
            'data' => $discount
        ], 201);
    }

    /**
     * Display the specified discount.
     */
    public function show(string $id)
    {
        $discount = Discount::find($id);

        if (!$discount) {
            return response()->json(['message' => 'Discount not found'], 404);
        }

        return response()->json($discount);
    }

    /**
     * Show the form for editing the specified discount.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified discount in storage.
     */
    public function update(Request $request, string $id)
    {
        $discount = Discount::find($id);

        if (!$discount) {
            return response()->json(['message' => 'Discount not found'], 404);
        }

        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:discounts,code,' . $discount->id,
            'percentage' => 'nullable|numeric|min:0|max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:active,inactive',
        ]);

        $discount->update($validated);

        return response()->json([
            'message' => 'Discount updated successfully!',
            'data' => $discount
        ]);
    }

    /**
     * Soft delete the specified discount.
     */
    public function destroy(string $id)
    {
        $discount = Discount::find($id);

        if (!$discount) {
            return response()->json(['message' => 'Discount not found'], 404);
        }

        $discount->delete();

        return response()->json(['message' => 'Discount deleted successfully!']);
    }

    // /**
    //  * Display soft-deleted discounts.
    //  */
    // public function trashed()
    // {
    //     $trashed = Discount::onlyTrashed()->get();
    //     return response()->json($trashed);
    // }

    // /**
    //  * Restore a soft-deleted discount.
    //  */
    // public function restore(string $id)
    // {
    //     $discount = Discount::onlyTrashed()->find($id);

    //     if (!$discount) {
    //         return response()->json(['message' => 'Discount not found in trash'], 404);
    //     }

    //     $discount->restore();

    //     return response()->json(['message' => 'Discount restored successfully!']);
    // }

    // /**
    //  * Permanently delete a soft-deleted discount.
    //  */
    // public function forceDelete(string $id)
    // {
    //     $discount = Discount::onlyTrashed()->find($id);

    //     if (!$discount) {
    //         return response()->json(['message' => 'Discount not found in trash'], 404);
    //     }

    //     $discount->forceDelete();

    //     return response()->json(['message' => 'Discount permanently deleted!']);
    // }
}
