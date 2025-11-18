<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Discount;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

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

     /**
     * Validate discount code
     */
    public function validateDiscount(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'valid' => false,
                'message' => 'Mã giảm giá không hợp lệ'
            ], 400);
        }

        $code = $request->input('code');
        
        // Tìm mã giảm giá
        $discount = Discount::where('code', $code)
            ->where('status', 'active')
            ->first();

        if (!$discount) {
            return response()->json([
                'valid' => false,
                'message' => 'Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa'
            ], 404);
        }

        $now = Carbon::now();

        // Kiểm tra thời gian hiệu lực
        if ($discount->start_date && $now->lt($discount->start_date)) {
            return response()->json([
                'valid' => false,
                'message' => 'Mã giảm giá chưa có hiệu lực. Hiệu lực từ: ' . $discount->start_date->format('d/m/Y H:i')
            ], 400);
        }

        if ($discount->end_date && $now->gt($discount->end_date)) {
            return response()->json([
                'valid' => false,
                'message' => 'Mã giảm giá đã hết hạn. Hết hạn: ' . $discount->end_date->format('d/m/Y H:i')
            ], 400);
        }

        return response()->json([
            'valid' => true,
            'discount' => [
                'id' => $discount->id,
                'code' => $discount->code,
                'percentage' => (float) $discount->percentage,
                'start_date' => $discount->start_date?->format('Y-m-d H:i:s'),
                'end_date' => $discount->end_date?->format('Y-m-d H:i:s'),
            ],
            'message' => 'Áp dụng mã giảm giá thành công!'
        ]);
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
