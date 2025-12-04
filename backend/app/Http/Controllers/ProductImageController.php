<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use App\Services\UploadService;

class ProductImageController extends Controller
{
    private $uploadService;

    public function __construct(UploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function index(Request $request)
    {
        $query = ProductImage::with(['product', 'color']);

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('product_detail_id')) {
            $query->where('product_detail_id', $request->product_detail_id);
        }

        $images = $query->get();

        // Trả về URL (local hoặc Supabase)
        $images->transform(function ($img) {
            $img->image_url = $img->image_path;
            return $img;
        });

        return response()->json($images);
    }

    public function store(Request $request)
    {
        $request->merge([
            'is_primary' => filter_var($request->is_primary, FILTER_VALIDATE_BOOLEAN),
        ]);

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_detail_id' => 'nullable|exists:product_details,id',
            'color_id' => 'nullable|exists:colors,id',
            'image' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:4096',
            'is_primary' => 'nullable|boolean',
        ]);

        $file = $request->file('image');

        if (app()->environment('local')) {
            // Local dev → lưu file vào storage
            $path = $this->uploadService->uploadLocal($file);
        } else {
            // Server thật → upload Supabase, không lưu file local
            $path = $this->uploadService->uploadSupabase($file, 'products/' . uniqid() . '_' . $file->getClientOriginalName());
        }

        $image = ProductImage::create([
            'product_id' => $validated['product_id'],
            'product_detail_id' => $validated['product_detail_id'] ?? null,
            'color_id' => $validated['color_id'] ?? null,
            'image_path' => $path,
            'is_primary' => $validated['is_primary'] ?? false,
        ]);

        $image->image_url = $path;

        return response()->json([
            'message' => 'Image created successfully',
            'data' => $image
        ], 201);
    }

    public function show(string $id)
    {
        $image = ProductImage::with(['product', 'color'])->findOrFail($id);
        $image->image_url = $image->image_path;

        return response()->json($image);
    }

    public function update(Request $request, string $id)
    {
        $image = ProductImage::findOrFail($id);

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_detail_id' => 'nullable|exists:product_details,id',
            'color_id' => 'nullable|exists:colors,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:4096',
            'is_primary' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');

            if (app()->environment('local')) {
                // Local → xóa file cũ, lưu file mới
                $this->uploadService->deleteLocal($image->image_path);
                $path = $this->uploadService->uploadLocal($file);
            } else {
                // Server → upload Supabase mới
                $path = $this->uploadService->uploadSupabase($file, 'products/' . uniqid() . '_' . $file->getClientOriginalName());
            }

            $validated['image_path'] = $path;
        }

        unset($validated['image']); // bỏ key image cũ
        $image->update($validated);
        $image->image_url = $image->image_path;

        return response()->json([
            'message' => 'Image updated successfully',
            'data' => $image
        ]);
    }

    public function destroy(string $id)
    {
        $image = ProductImage::findOrFail($id);

        if (app()->environment('local') && $image->image_path) {
            $this->uploadService->deleteLocal($image->image_path);
        } else if (!app()->environment('local') && $image->image_path) {
            // Server → xóa Supabase nếu muốn
            $this->uploadService->deleteSupabase($image->image_path);
        }

        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
