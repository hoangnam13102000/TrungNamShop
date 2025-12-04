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

        $images->transform(function ($img) {
            $img->image_url = $img->image_path 
                ? Storage::url($img->image_path) 
                : $img->supabase_url;
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
        $supabaseName = "products/" . uniqid() . "_" . $file->getClientOriginalName();

        if (app()->environment('local')) {
            // LOCAL → lưu file local
            $localPath = $this->uploadService->uploadLocal($file);
            $image = ProductImage::create([
                'product_id' => $validated['product_id'],
                'product_detail_id' => $validated['product_detail_id'] ?? null,
                'color_id' => $validated['color_id'] ?? null,
                'image_path' => $localPath,
                'is_primary' => $validated['is_primary'] ?? false,
            ]);
            $image->image_url = Storage::url($localPath);
            $image->supabase_url = null;
        } else {
            // SERVER thật → chỉ upload Supabase
            $supabaseUrl = $this->uploadService->uploadSupabase($file, $supabaseName);
            $image = ProductImage::create([
                'product_id' => $validated['product_id'],
                'product_detail_id' => $validated['product_detail_id'] ?? null,
                'color_id' => $validated['color_id'] ?? null,
                'image_path' => null,
                'is_primary' => $validated['is_primary'] ?? false,
                'supabase_url' => $supabaseUrl,
            ]);
            $image->image_url = $supabaseUrl;
        }

        return response()->json([
            'message' => 'Image created successfully',
            'data' => $image
        ], 201);
    }

    public function show(string $id)
    {
        $image = ProductImage::with(['product', 'color'])->findOrFail($id);
        $image->image_url = $image->image_path 
            ? Storage::url($image->image_path) 
            : $image->supabase_url;

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
            $supabaseName = "products/" . uniqid() . "_" . $file->getClientOriginalName();

            if (app()->environment('local')) {
                // LOCAL → xóa cũ, lưu local mới
                $this->uploadService->deleteLocal($image->image_path);
                $localPath = $this->uploadService->uploadLocal($file);
                $validated['image_path'] = $localPath;
                $image->supabase_url = null;
                $image->image_url = Storage::url($localPath);
            } else {
                // SERVER → upload Supabase mới
                $supabaseUrl = $this->uploadService->uploadSupabase($file, $supabaseName);
                $validated['image_path'] = null;
                $image->supabase_url = $supabaseUrl;
                $image->image_url = $supabaseUrl;
            }
        }

        unset($validated['image']);
        $image->update($validated);

        return response()->json([
            'message' => 'Image updated successfully',
            'data' => $image
        ]);
    }

    public function destroy(string $id)
    {
        $image = ProductImage::findOrFail($id);

        if ($image->image_path) {
            $this->uploadService->deleteLocal($image->image_path);
        }

        if ($image->supabase_url) {
            $this->uploadService->deleteSupabase($image->supabase_url);
        }

        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
