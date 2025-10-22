<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $images = ProductImage::with(['product', 'color'])->get();
        return response()->json($images);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'color_id' => 'nullable|exists:colors,id',
            'image' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
            'is_primary' => 'nullable|boolean',
        ]);

        // Upload file
        $path = $request->file('image')->store('products', 'public');

        // Create a record
        $image = ProductImage::create([
            'product_id'  => $validated['product_id'],
            'color_id'    => $validated['color_id'] ?? null,
            'image_path'  => $path,
            'is_primary'  => $validated['is_primary'] ?? false,
        ]);

        return response()->json([
            'message' => 'Image created successfully',
            'data' => $image
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $image = ProductImage::with(['product', 'color'])->findOrFail($id);
        return response()->json($image);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $image = ProductImage::findOrFail($id);

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'color_id' => 'nullable|exists:colors,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
            'is_primary' => 'nullable|boolean',
        ]);

      // If there is a new photo → delete the old photo and upload a new photo
        if ($request->hasFile('image')) {
            if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }

            $path = $request->file('image')->store('products', 'public');
            $validated['image_path'] = $path;
        }

        // Delete key 'image' to avoid column non-existent error
        unset($validated['image']);

        $image->update($validated);

        return response()->json([
            'message' => 'Image updated successfully',
            'data' => $image
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $image = ProductImage::findOrFail($id);

        if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
