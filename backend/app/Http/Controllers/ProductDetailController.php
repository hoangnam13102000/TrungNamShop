<?php

namespace App\Http\Controllers;

use App\Models\ProductDetail;
use Illuminate\Http\Request;
use App\Http\Resources\ProductDetailResource;

class ProductDetailController extends Controller
{
     /**
     * List of relations to load together
     */
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
    ];

     /**
     * General validation rules
     */
     protected function validationRules($isUpdate = false): array
    {
        $baseRules = [
            'product_id' => $isUpdate ? 'sometimes|exists:products,id' : 'required|exists:products,id',
            'color_id' => 'nullable|exists:colors,id',
            'screen_id' => 'nullable|exists:screens,id',
            'rear_camera_id' => 'nullable|exists:rear_cameras,id',
            'front_camera_id' => 'nullable|exists:front_cameras,id',
            'memory_id' => 'nullable|exists:memories,id',
            'operating_system_id' => 'nullable|exists:operating_systems,id',
            'general_information_id' => 'nullable|exists:general_informations,id',
            'communication_connectivity_id' => 'nullable|exists:communication_connectivities,id',
            'battery_charging_id' => 'nullable|exists:batteries_charging,id',
            'utility_id' => 'nullable|exists:utilities,id',
            'price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
        ];

        return $baseRules;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $details = ProductDetail::with($this->relations)->latest()->get();

         $details = ProductDetail::with($this->relations)->latest()->get();
        return ProductDetailResource::collection($details);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());

        $detail = ProductDetail::create($validated)->load($this->relations);

        return new ProductDetailResource($detail);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $detail = ProductDetail::with($this->relations)->findOrFail($id);

        return new ProductDetailResource($detail);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $detail = ProductDetail::findOrFail($id);

        $validated = $request->validate($this->validationRules(isUpdate: true));

        $detail->update($validated);

        $detail->load($this->relations);

        return new ProductDetailResource($detail);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
       $detail = ProductDetail::findOrFail($id);
        $detail->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product detail deleted successfully',
        ]);
    }
}
