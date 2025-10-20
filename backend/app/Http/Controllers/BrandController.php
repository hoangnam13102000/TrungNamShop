<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = Brand::all();
        $brands->transform(function ($brand) {
            if ($brand->image && !str_starts_with($brand->image, 'http')) {
                $brand->image = asset('storage/' . $brand->image);
            }
            return $brand;
        });

        return response()->json($brands);
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
            'name' => 'required|string|max:255',
            'image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('brands', 'public');
            $validated['image'] = $path;
        }

        $brand = Brand::create($validated);


        $brand->image = $brand->image ? asset('storage/' . $brand->image) : null;

        return response()->json([
            'message' => 'Brand created successfully!',
            'data' => $brand,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json(['message' => 'Brand not found'], 404);
        }

        if ($brand->image && !str_starts_with($brand->image, 'http')) {
            $brand->image = asset('storage/' . $brand->image);
        }

        return response()->json($brand);
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
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json(['message' => 'Brand not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($brand->image && Storage::disk('public')->exists($brand->image)) {
                Storage::disk('public')->delete($brand->image);
            }

            $path = $request->file('image')->store('brands', 'public');
            $validated['image'] = $path;
        }

        $brand->update($validated);
        $brand->image = $brand->image ? asset('storage/' . $brand->image) : null;

        return response()->json([
            'message' => 'Brand updated successfully!',
            'data' => $brand,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $brand = Brand::find($id);

        if (!$brand) {
            return response()->json(['message' => 'Brand not found'], 404);
        }

       
        if ($brand->image && !str_starts_with($brand->image, 'http')) {
            $relativePath = str_replace('storage/', '', $brand->image);
            if (Storage::disk('public')->exists($relativePath)) {
                Storage::disk('public')->delete($relativePath);
            }
        }

        $brand->delete();

        return response()->json(['message' => 'Brand deleted successfully!']);
    }
}
