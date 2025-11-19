<?php

namespace App\Http\Controllers;

use App\Models\ProductDetail;
use Illuminate\Http\Request;
use App\Http\Resources\ProductDetailResource;

class ProductDetailController extends Controller
{
    protected array $relations = [
        'product:id,name,brand_id',
        'product.brand:id,name',
        'screen:id,display_technology,resolution,screen_size,max_brightness,glass_protection',
        'rearCamera:id,resolution,aperture,video_capability,features',
        'frontCamera:id,resolution,aperture,video_capability,features',
        'memory:id,ram,internal_storage,memory_card_slot',
        'operatingSystem:id,name,processor,cpu_speed,gpu',
        'generalInformation:id,design,material,dimensions,weight,launch_time',
        'communicationConnectivity:id,nfc,sim_slot,mobile_network,gps',
        'batteryCharging:id,battery_capacity,charging_port,charging',
        'utility:id,advanced_security,special_features,water_dust_resistance',
        'promotion:id,name,description,discount_percent,start_date,end_date,status',
        'images:id,product_id,product_detail_id,color_id,image_path,is_primary',
    ];

    protected function validationRules($isUpdate = false): array
    {
        return [
            'product_id' => $isUpdate ? 'sometimes|exists:products,id' : 'required|exists:products,id',
            'screen_id' => 'nullable|exists:screens,id',
            'rear_camera_id' => 'nullable|exists:rear_cameras,id',
            'front_camera_id' => 'nullable|exists:front_cameras,id',
            'memory_id' => 'nullable|exists:memories,id',
            'operating_system_id' => 'nullable|exists:operating_systems,id',
            'general_information_id' => 'nullable|exists:general_informations,id',
            'communication_connectivity_id' => 'nullable|exists:communication_connectivities,id',
            'battery_charging_id' => 'nullable|exists:batteries_charging,id',
            'utility_id' => 'nullable|exists:utilities,id',
            'promotion_id' => 'nullable|exists:promotions,id',
            'price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
        ];
    }

    public function index()
    {
        $details = ProductDetail::with($this->relations)->latest()->paginate(20);
        return ProductDetailResource::collection($details);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());

        $data = collect($validated)
            ->only((new ProductDetail())->getFillable())
            ->map(fn($v) => $v ?? null)
            ->toArray();

        $detail = ProductDetail::create($data);

        // Load relation
        $detail->load($this->relations);

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

        // Load relation để trả về resource
        $detail->load($this->relations);

        return new ProductDetailResource($detail);
    }

    public function destroy($id)
    {
        $detail = ProductDetail::with('images')->findOrFail($id);
        $detail->images()->delete();
        $detail->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product detail deleted successfully',
        ]);
    }
}
