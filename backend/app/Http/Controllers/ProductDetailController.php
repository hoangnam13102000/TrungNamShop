<?php

namespace App\Http\Controllers;

use App\Models\ProductDetail;
use Illuminate\Http\Request;
use App\Http\Resources\ProductDetailResource;

class ProductDetailController extends Controller
{
    protected array $relations = [
        'product.brand',
        'color',
        'screen',
        'rearCamera',
        'frontCamera',
        'memory',
        'operatingSystem',
        'generalInformation',
        'communicationConnectivity',
        'batteryCharging',
        'utility',
        'images',
    ];

    protected function validationRules($isUpdate = false): array
    {
        return [
            'product_id' => $isUpdate ? 'sometimes|exists:products,id' : 'required|exists:products,id',
            'color_id' => 'nullable|exists:colors,id',
            'screen_id' => 'nullable|exists:screens,id',
            'rear_camera_id' => 'nullable|exists:rear_cameras,id',
            'front_camera_id' => 'nullable|exists:front_cameras,id',
            'memory_id' => 'nullable|exists:memories,id',
            'operating_system_id' => 'nullable|exists:operating_systems,id',
            'general_information_id' => 'nullable|exists:general_informations,id',
            'communication_connectivity_id' => 'nullable|exists:communication_connectivities,id',
            'battery_charging_id' => 'nullable|exists:battery_chargings,id',
            'utility_id' => 'nullable|exists:utilities,id',
            'price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
        ];
    }

    public function index()
    {
        $details = ProductDetail::with($this->relations)
            ->latest()
            ->paginate(20);

        return ProductDetailResource::collection($details);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());

        $data = collect($validated)
            ->only((new ProductDetail())->getFillable())
            ->map(fn($v) => $v ?? null)
            ->toArray();

        $detail = ProductDetail::create($data)->load($this->relations);

        return new ProductDetailResource($detail);
    }

    public function show($id)
    {
        $detail = ProductDetail::with($this->relations)->findOrFail($id);
        return new ProductDetailResource($detail);
    }

    public function update(Request $request, $id)
    {
        $detail = ProductDetail::findOrFail($id);

        $validated = $request->validate($this->validationRules(true));

        $data = collect($validated)
            ->only((new ProductDetail())->getFillable())
            ->map(fn($v) => $v ?? null)
            ->toArray();

        $detail->update($data);
        $detail->load($this->relations);

        return new ProductDetailResource($detail);
    }

    public function destroy($id)
    {
        $detail = ProductDetail::with('images')->findOrFail($id);

        foreach ($detail->images as $img) {
            $img->delete();
        }

        $detail->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product detail deleted successfully',
        ]);
    }
}
