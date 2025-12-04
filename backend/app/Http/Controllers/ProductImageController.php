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
            $img->image_url = Storage::url($img->image_path);
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

        // Lưu LOCAL
        $localPath = $this->uploadService->uploadLocal($request->file('image'));

        // Upload lên Supabase
        $file = $request->file('image');
        $supabaseName = "products/" . uniqid() . "_" . $file->getClientOriginalName();
        $supabaseUrl = $this->uploadService->uploadSupabase($file, $supabaseName);

        // Lưu DB (không lưu supabase_url)
        $image = ProductImage::create([
            'product_id' => $validated['product_id'],
            'product_detail_id' => $validated['product_detail_id'] ?? null,
            'color_id' => $validated['color_id'] ?? null,
            'image_path' => $localPath,
            'is_primary' => $validated['is_primary'] ?? false,
        ]);

        $image->image_url = Storage::url($image->image_path);
        $image->supabase_url = $supabaseUrl; // chỉ trả về JSON—not saved

        return response()->json([
            'message' => 'Image created successfully',
            'data' => $image
        ], 201);
    }

    public function show(string $id)
    {
        $image = ProductImage::with(['product', 'color'])->findOrFail($id);
        $image->image_url = Storage::url($image->image_path);

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

            // Xóa local cũ
            $this->uploadService->deleteLocal($image->image_path);

            // Lưu local mới
            $localPath = $this->uploadService->uploadLocal($request->file('image'));
            $validated['image_path'] = $localPath;

            // Upload Supabase mới
            $file = $request->file('image');
            $supabaseName = "products/" . uniqid() . "_" . $file->getClientOriginalName();
            $supabaseUrl = $this->uploadService->uploadSupabase($file, $supabaseName);

            $image->supabase_url = $supabaseUrl; // không lưu DB
        }

        unset($validated['image']);

        $image->update($validated);
        $image->image_url = Storage::url($image->image_path);

        return response()->json([
            'message' => 'Image updated successfully',
            'data' => $image
        ]);
    }

    public function destroy(string $id)
    {
        $image = ProductImage::findOrFail($id);

        // Xóa local
        $this->uploadService->deleteLocal($image->image_path);

        // Xóa Supabase nếu có
        if (isset($image->supabase_url)) {
            $this->uploadService->deleteSupabase($image->supabase_url);
        }

        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
