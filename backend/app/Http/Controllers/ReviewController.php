<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     * Optional query string: ?product_id=1
     */
    public function index(Request $request)
    {
        $productId = $request->query('product_id');

        $reviews = Review::when($productId, function ($query, $productId) {
            return $query->where('product_id', $productId);
        })->orderBy('created_at', 'desc')->get();

        return ReviewResource::collection($reviews);
    }

    /**
     * Store a newly created review.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'product_id' => 'required|exists:products,id',
            'content' => 'required|string',
            'stars' => 'required|integer|min:1|max:5',
            'status' => 'nullable|boolean',
        ]);

        $review = Review::create($validated);

        return new ReviewResource($review);
    }

    /**
     * Display the specified review.
     */
    public function show($id)
    {
        $review = Review::findOrFail($id);
        return new ReviewResource($review);
    }

    /**
     * Update the specified review.
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $validated = $request->validate([
            'content' => 'sometimes|string',
            'stars' => 'sometimes|integer|min:1|max:5',
            'status' => 'sometimes|boolean',
        ]);

        $review->update($validated);

        return new ReviewResource($review);
    }

    /**
     * Remove the specified review (soft delete).
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
